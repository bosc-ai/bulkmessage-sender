/**
 * BulkMessageSender — Contact form → Google Sheet
 * ------------------------------------------------
 * Receives POSTs from the contact form on bulkmessagesender.com/contact
 * and appends each submission as a row in the bound spreadsheet.
 *
 * SETUP (one time):
 *  1. Create / open the Google Sheet that should collect leads.
 *  2. Extensions → Apps Script.  Paste this whole file in (replace Code.gs).
 *  3. Deploy → New deployment → type "Web app".
 *       - Description:        Contact form
 *       - Execute as:         Me
 *       - Who has access:     Anyone
 *     Click Deploy, authorise, and COPY the Web app URL
 *     (looks like https://script.google.com/macros/s/XXXX/exec).
 *  4. Paste that URL into contact.html → <form ... data-endpoint="...">.
 *
 * When you change this script later, redeploy with Manage deployments →
 * edit the existing deployment → Version: New version (keeps the same URL).
 */

var SHEET_NAME = 'Leads';

var HEADERS = [
  'Timestamp', 'Name', 'Company', 'Email',
  'Country', 'Phone', 'Topic', 'Team size', 'Message', 'Source page'
];

function doPost(e) {
  var lock = LockService.getScriptLock();
  lock.waitLock(20000); // serialise concurrent submissions

  try {
    var sheet = getSheet_();
    var p = (e && e.parameter) ? e.parameter : {};

    sheet.appendRow([
      new Date(),
      p.name || '',
      p.company || '',
      p.email || '',
      p.country || '',
      p.phone || '',
      p.topic || '',
      p.teamSize || '',
      p.message || '',
      p.page || ''
    ]);

    return json_({ result: 'ok' });
  } catch (err) {
    return json_({ result: 'error', message: String(err) });
  } finally {
    lock.releaseLock();
  }
}

// Lets you open the /exec URL in a browser to confirm the app is live.
function doGet() {
  return json_({ result: 'ok', message: 'Contact form endpoint is live.' });
}

function getSheet_() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = ss.getSheetByName(SHEET_NAME);
  if (!sheet) {
    sheet = ss.insertSheet(SHEET_NAME);
  }
  if (sheet.getLastRow() === 0) {
    sheet.appendRow(HEADERS);
    sheet.getRange(1, 1, 1, HEADERS.length).setFontWeight('bold');
    sheet.setFrozenRows(1);
  }
  return sheet;
}

function json_(obj) {
  return ContentService
    .createTextOutput(JSON.stringify(obj))
    .setMimeType(ContentService.MimeType.JSON);
}
