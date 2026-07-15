/**
 * AIXelerate Challenge — Google Sheets backend
 * ------------------------------------------------
 * Paste this whole file into Extensions > Apps Script (attached to your
 * Google Sheet), then deploy as a Web App. Full setup steps are in
 * SETUP_GOOGLE_SHEETS.md.
 *
 * What it does:
 *  - doPost(e)  -> called by join.html on every form submit. Appends a row
 *                  to the matching tab (Competitor / Volunteer / Mentor-Judge
 *                  / Board), creating the tab + header row the first time.
 *  - doGet(e)   -> called by join.html's "View Saved Responses" dashboard.
 *                  Returns every row from every tab as one JSON array so the
 *                  dashboard can show live data instead of only local data.
 */

// Optional shared secret. Leave as "" to disable the check (anyone with your
// URL could then read submissions). If you set this, put the SAME value in
// SHEETS_CONFIG.sharedToken in join.html.
const TOKEN = "";

// One tab per form, with the exact column order we want written.
const SHEET_CONFIG = {
  "Competitor": ["submittedAt","firstName","lastName","email","age","school","grade","country","track","teamPreference","emergencyPhone","teamName","teammates","projectIdea","agreeRules","agreePhotos"],
  "Volunteer": ["submittedAt","firstName","lastName","email","availability","whyVolunteer"],
  "Mentor/Judge": ["submittedAt","firstName","lastName","email","role","expertise"],
  "Board Member": ["submittedAt","firstName","lastName","email","location","background","intent"]
};

function doPost(e) {
  try {
    const params = e.parameter || {};
    const role = params.role;
    const columns = SHEET_CONFIG[role];

    if (!columns) {
      return jsonResponse({ ok: false, error: "Unknown role: " + role });
    }

    const sheet = getOrCreateSheet(role, columns);
    const row = columns.map(col => params[col] !== undefined ? params[col] : "");
    sheet.appendRow(row);

    return jsonResponse({ ok: true });
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
