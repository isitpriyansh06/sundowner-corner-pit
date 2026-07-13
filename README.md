# Fir Se Guest List

This is a standalone static RSVP page with a Google Apps Script sheet endpoint.

## Connect the sheet

1. Create a blank Google Sheet and copy its ID from the URL.
2. Open **Extensions → Apps Script**.
3. Replace `PASTE_GOOGLE_SHEET_ID_HERE` in `backend/Code.gs` with that ID.
4. Deploy the script as a web app: **Execute as me**, access **Anyone**.
5. Copy the web-app URL into `config.js` as `SHEET_ENDPOINT`.
6. Add the private Google Maps URL as `MAP_LINK` in `config.js`.

The first submission creates a `Guests` tab with `Timestamp`, `Name`, `Plus Ones`, and `Total Guests` columns. The page reveals the map only after the RSVP submission completes.

The local preview works before the endpoint is connected, but it will not write to the sheet until `SHEET_ENDPOINT` is filled in.
