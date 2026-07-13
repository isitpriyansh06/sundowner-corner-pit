# Fir Se Guest List

This is a standalone static RSVP page with a Google Apps Script sheet endpoint.

## Connect the sheet

1. Create a blank Google Sheet and copy its ID from the URL.
2. Open **Extensions → Apps Script**.
3. Replace `PASTE_GOOGLE_SHEET_ID_HERE` in `Code.gs` with that ID.
4. Deploy the script as a web app: **Execute as me**, access **Anyone**.
5. Copy the web-app URL into `config.js` as `SHEET_ENDPOINT`.
6. Add the private Google Maps URL as `MAP_LINK` in `config.js`.

The first submission creates a `Guests` tab with `Timestamp`, `Name`, `Plus Ones`, `Plus-one Name`, and `Total Guests` columns. The page reveals the map only after the RSVP submission completes.

When updating an existing Apps Script, paste in the new `Code.gs`, then use **Deploy → Manage deployments → Edit → New version → Deploy**. The script adds the `Plus-one Name` column before `Total Guests` without changing existing RSVP rows.

The local preview works before the endpoint is connected, but it will not write to the sheet until `SHEET_ENDPOINT` is filled in.
