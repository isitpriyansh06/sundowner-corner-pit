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
  const plusOneName = String(params.plusOneName || "").replace(/\s+/g, " ").trim();

  if (!name || name.length > 80 || !Number.isInteger(plusOnes) || plusOnes < 0 || plusOnes > 1 || plusOneName.length > 80 || (plusOnes === 1 && !plusOneName)) {
    return json_({ ok: false, error: "Invalid RSVP" });
  }

  const spreadsheet = SpreadsheetApp.openById(CONFIG.SHEET_ID);
  const sheet = spreadsheet.getSheetByName(CONFIG.SHEET_NAME) || spreadsheet.insertSheet(CONFIG.SHEET_NAME);

  setUpSheet_(sheet);

  sheet.appendRow([new Date(), name, plusOnes, plusOnes === 1 ? plusOneName : "", 1 + plusOnes]);
  return json_({ ok: true });
}

function setUpSheet_(sheet) {
  if (sheet.getLastRow() === 0) {
    sheet.appendRow(["Timestamp", "Name", "Plus Ones", "Plus-one Name", "Total Guests"]);
    sheet.setFrozenRows(1);
    return;
  }

  if (sheet.getRange(1, 4).getValue() === "Total Guests") {
    sheet.insertColumnBefore(4);
    sheet.getRange(1, 4).setValue("Plus-one Name");
  }
}

function json_(value) {
  return ContentService
    .createTextOutput(JSON.stringify(value))
    .setMimeType(ContentService.MimeType.JSON);
}
