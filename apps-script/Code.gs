/**
 * AIXelerate Challenge — Google Sheets backend
 * ------------------------------------------------
 * Updated for apply.html student and mentor forms.
 * Paste this whole file into Extensions > Apps Script (attached to your
 * Google Sheet), then deploy as a Web App.
 */

// Optional shared secret. Leave as "" to disable the check.
const TOKEN = "";

// One tab per form, with the exact column order we want written.
// These columns MUST match the fields sent from apply.html
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
    // Parse JSON body (apply.html sends JSON, not form-encoded)
    let params;
    if (e.postData && e.postData.contents) {
      params = JSON.parse(e.postData.contents);
    } else {
      params = e.parameter || {};
    }
    
    // Determine role from the data (student or mentor)
    // We check for fields that are unique to each form
    let role;
    if (params.grade !== undefined) {
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
        return params["team-status"];
      }
      return params[col] !== undefined ? params[col] : "";
    });
    
    sheet.appendRow(row);

    return jsonResponse({ ok: true, message: "Application saved!" });
  } catch (err) {
    return jsonResponse({ ok: false, error: String(err) });
  }
}

function doGet(e) {
  const params = e.parameter || {};

  if (TOKEN && params.token !== TOKEN) {
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

function jsonResponse(obj) {
  return ContentService
    .createTextOutput(JSON.stringify(obj))
    .setMimeType(ContentService.MimeType.JSON);
}
