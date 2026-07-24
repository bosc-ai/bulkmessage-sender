/**
 * Weflux — Intent-Based Lead Capture v2 → Google Sheet
 * ----------------------------------------------------
 * Phase 1: Contact captured immediately on "Continue"
 * Phase 2: 8 qualification steps progressively enrich the row
 *
 * SESSION DEDUPLICATION: Multiple POSTs per visitor are merged
 * into a single row using the sessionId field.
 *
 * SETUP (one time):
 *  1. Create / open a Google Sheet for intent leads.
 *  2. Extensions → Apps Script. Paste this whole file (replace Code.gs).
 *  3. Deploy → New deployment → type "Web app".
 *       - Execute as:      Me
 *       - Who has access:  Anyone
 *     Deploy, authorise, COPY the Web app URL.
 *  4. Paste that URL into lead-capture.js → CONFIG.endpoint.
 *
 * Redeploy: Manage deployments → edit → Version: New version.
 */

var SHEET_NAME = 'IntentLeads';

var HEADERS = [
  'Timestamp',
  'Session ID',
  'Status',
  'Abandoned At',
  'Intent Score',
  'Intent Tier',
  // Phase 1 — Contact
  'Name',
  'Phone',
  'Email',
  'Country',
  // Phase 2 — Qualification
  'Business Type',
  'WhatsApp Usage',
  'Current Provider',
  'Monthly Conversations',
  'Team Size',
  'WhatsApp Numbers',
  'Features',
  'Timeline',
  'Budget',
  // Meta
  'Source Page',
  'Time on Page (s)',
  'Device',
  'UTM Source',
  'UTM Medium',
  'UTM Campaign'
];

function doPost(e) {
  var lock = LockService.getScriptLock();
  lock.waitLock(20000);

  try {
    var sheet = getSheet_();
    var p = (e && e.parameter) ? e.parameter : {};
    var sessionId = p.sessionId || '';

    // --- Upsert: find existing row by sessionId ---
    var existingRow = -1;
    if (sessionId) {
      var data = sheet.getDataRange().getValues();
      for (var i = 1; i < data.length; i++) {
        if (data[i][1] === sessionId) {
          existingRow = i + 1;
          break;
        }
      }
    }

    var row = [
      new Date(),                           // Timestamp
      sessionId,                            // Session ID
      p.status || 'partial',                // Status
      p.abandonedAtStep || '',              // Abandoned At
      p.intentScore || '0',                 // Intent Score
      p.intentTier || '',                   // Intent Tier
      // Phase 1
      p.name || '',                         // Name
      p.phone || '',                        // Phone
      p.email || '',                        // Email
      p.country || '',                      // Country
      // Phase 2
      p.businessType || '',                 // Business Type
      p.whatsappUsage || '',                // WhatsApp Usage
      p.currentProvider || '',              // Current Provider
      p.monthlyConversations || '',         // Monthly Conversations
      p.teamSize || '',                     // Team Size
      p.whatsappNumbers || '',              // WhatsApp Numbers
      p.features || '',                     // Features (comma-separated)
      p.timeline || '',                     // Timeline
      p.budget || '',                       // Budget
      // Meta
      p.sourcePage || '',                   // Source Page
      p.timeOnPage || '',                   // Time on Page
      p.device || '',                       // Device
      p.utmSource || '',                    // UTM Source
      p.utmMedium || '',                    // UTM Medium
      p.utmCampaign || ''                   // UTM Campaign
    ];

    if (existingRow > 0) {
      sheet.getRange(existingRow, 1, 1, row.length).setValues([row]);
    } else {
      sheet.appendRow(row);
    }

    return json_({ result: 'ok' });
  } catch (err) {
    return json_({ result: 'error', message: String(err) });
  } finally {
    lock.releaseLock();
  }
}

function doGet() {
  return json_({ result: 'ok', message: 'Lead capture endpoint is live.' });
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
    // Formatting
    sheet.setColumnWidth(1, 160);   // Timestamp
    sheet.setColumnWidth(3, 180);   // Status
    sheet.setColumnWidth(5, 100);   // Intent Score
    sheet.setColumnWidth(6, 120);   // Intent Tier
    sheet.setColumnWidth(7, 160);   // Name
    sheet.setColumnWidth(8, 140);   // Phone
    sheet.setColumnWidth(9, 200);   // Email
    sheet.setColumnWidth(17, 220);  // Features
  }
  return sheet;
}

function json_(obj) {
  return ContentService
    .createTextOutput(JSON.stringify(obj))
    .setMimeType(ContentService.MimeType.JSON);
}
