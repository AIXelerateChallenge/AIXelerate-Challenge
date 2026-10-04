/**
 * AIXelerate Challenge — Google Sheets backend
 * ------------------------------------------------
 * Handles student, mentor, and contact forms.
 * Paste this whole file into Extensions > Apps Script (attached to your
 * Google Sheet), then deploy as a Web App.
 */

// Optional server-only export token. Blank disables the read/export endpoint.
const TOKEN = "";
const NOTIFY_EMAIL = "vishakh.a@aixeleratechallenge.org";
const CONTACT_TOPICS = [
  "Join an online cohort", "Start a school club", "Host a hackathon",
  "Sponsor a sprint", "Talk with the team"
];

// One tab per form, with the exact column order we want written.
// These columns MUST match the fields sent from /apply and /contact.
const SHEET_CONFIG = {
  "Student": [
    "submittedAt", 
    "name", 
    "email", 
    "grade", 
    "school", 
    "experience", 
    "teamStatus", 
    "idea", 
    "referral"
  ],
  "Contact": ["submittedAt", "name", "email", "topic", "schoolOrCity", "message"],
  "Mentor": [
    "submittedAt", 
    "name", 
    "email", 
    "org", 
    "title", 
    "expertise", 
    "availability", 
    "link", 
    "why"
  ]
};

function doPost(e) {
  try {
    // The site sends JSON as text/plain to avoid a CORS preflight.
    let params;
    if (e.postData && e.postData.contents) {
      params = JSON.parse(e.postData.contents);
    } else {
      params = e.parameter || {};
    }
    
    if (!params || typeof params !== "object" || Array.isArray(params)) {
      return jsonResponse({ ok: false, error: "Invalid submission" });
    }
    if (params.website) return jsonResponse({ ok: false, error: "Invalid submission" });
    if (typeof params.name !== "string" || !params.name.trim() || params.name.length > 200 ||
        typeof params.email !== "string" || params.email.length > 254 ||
        !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(params.email)) {
      return jsonResponse({ ok: false, error: "Please enter your name and a valid email address." });
    }
    if (Object.keys(params).some(key => typeof params[key] !== "string" || params[key].length > 10000)) {
      return jsonResponse({ ok: false, error: "Please shorten your response." });
    }

    // Explicit contact type, with legacy field detection for existing applications.
    let role;
    if (params.formType === "contact") {
      role = "Contact";
      if (CONTACT_TOPICS.indexOf(params.topic) === -1 || !params.message || !params.message.trim()) {
        return jsonResponse({ ok: false, error: "Please select a topic and enter a message." });
      }
    } else if (params.grade !== undefined) {
      role = "Student";
    } else if (params.org !== undefined || params.title !== undefined) {
      role = "Mentor";
    } else {
      return jsonResponse({ ok: false, error: "Could not determine application type" });
    }
    
    const columns = SHEET_CONFIG[role];
    if (!columns) {
      return jsonResponse({ ok: false, error: "Unknown role: " + role });
    }

    const sheet = getOrCreateSheet(role, columns);
    
    // Build the row in the correct column order
    const row = columns.map(col => {
      if (col === "submittedAt") {
        return new Date().toISOString();
      }
      // Handle special field name mapping
      if (col === "teamStatus" && params["team-status"] !== undefined) {
        return safeCell(params["team-status"]);
      }
      return safeCell(params[col] !== undefined ? params[col] : "");
    });
    
    sheet.appendRow(row);

    // Save first: a mail quota or delivery failure must not discard the submission.
    let notified = false;
    try {
      MailApp.sendEmail({
        to: NOTIFY_EMAIL,
        replyTo: params.email,
        subject: "AIXelerate — " + (role === "Contact" ? params.topic : role + " application"),
        body: columns.map(col => {
          const value = col === "submittedAt" ? row[0] :
            col === "teamStatus" ? (params["team-status"] || params.teamStatus || "") : (params[col] || "");
          return col + ": " + value;
        }).join("\n\n")
      });
      notified = true;
    } catch (mailError) {
      console.error("Submission saved; notification failed: " + String(mailError));
    }
    return jsonResponse({ ok: true, notified: notified, message: "Submission saved!" });
  } catch (err) {
    return jsonResponse({ ok: false, error: String(err) });
  }
}

function doGet(e) {
  const params = e.parameter || {};

  if (!TOKEN || params.token !== TOKEN) {
    return jsonResponse({ ok: false, error: "Unauthorized" });
  }

  const allRows = [];

  Object.keys(SHEET_CONFIG).forEach(role => {
    const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(role);
    if (!sheet) return;

    const values = sheet.getDataRange().getValues();
    if (values.length < 2) return; // header only, no data yet

    const headers = values[0];
    for (let i = 1; i < values.length; i++) {
      const rowObj = { role: role };
      headers.forEach((h, idx) => { rowObj[h] = values[i][idx]; });
      allRows.push(rowObj);
    }
  });

  return jsonResponse({ ok: true, rows: allRows });
}

function getOrCreateSheet(role, columns) {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  let sheet = ss.getSheetByName(role);
  if (!sheet) {
    sheet = ss.insertSheet(role);
    sheet.appendRow(columns);
    sheet.setFrozenRows(1);
  }
  return sheet;
}

function safeCell(value) {
  // Keep visitor text literal in Sheets, even if it starts like a formula.
  return /^[=+@\-\t\r\n]/.test(value) ? "'" + value : value;
}

function jsonResponse(obj) {
  return ContentService
    .createTextOutput(JSON.stringify(obj))
    .setMimeType(ContentService.MimeType.JSON);
}
