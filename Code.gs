const CONFIG = {
  SHEET_ID: "1eJDCdnUTy7I927OeKVZjuK0qDT_Y2pZbazDFo2ULpCU",
  SHEET_NAME: "18th July Sundowner RSVP"
};

function doGet() {
  return json_({ ok: true, service: "raves-rsvp" });
}

function doPost(e) {
  const params = (e && e.parameter) || {};

  // Quietly discard automated honeypot submissions.
  if (String(params.website || "").trim()) {
    return json_({ ok: true });
  }

  const name = String(params.name || "").replace(/\s+/g, " ").trim();
  const plusOnes = Number(params.plusOnes);

  if (!name || name.length > 80 || !Number.isInteger(plusOnes) || plusOnes < 0 || plusOnes > 2) {
    return json_({ ok: false, error: "Invalid RSVP" });
  }

  const spreadsheet = SpreadsheetApp.openById(CONFIG.SHEET_ID);
  const sheet = spreadsheet.getSheetByName(CONFIG.SHEET_NAME) || spreadsheet.insertSheet(CONFIG.SHEET_NAME);

  if (sheet.getLastRow() === 0) {
    sheet.appendRow(["Timestamp", "Name", "Plus Ones", "Total Guests"]);
    sheet.setFrozenRows(1);
  }

  sheet.appendRow([new Date(), name, plusOnes, 1 + plusOnes]);
  return json_({ ok: true });
}

function json_(value) {
  return ContentService
    .createTextOutput(JSON.stringify(value))
    .setMimeType(ContentService.MimeType.JSON);
}
