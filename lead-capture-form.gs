/**
 * Weflux — Intent-Based Lead Capture & Native Calendar Booking → Google Sheet
 * -------------------------------------------------------------------------
 * Phase 1: Contact captured immediately on "Continue"
 * Phase 2: 8 qualification steps progressively enrich the row
 * Booking: Native Date & Time picker creates a Google Calendar event on hello@weflux.in
 *          AND sends a calendar invite to the lead's email — zero external redirects!
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
  // Booking
  'Booking Date',
  'Booking Time',
  'Calendar Event ID',
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
    var existingCalId = '';
    if (sessionId) {
      var data = sheet.getDataRange().getValues();
      for (var i = 1; i < data.length; i++) {
        if (data[i][1] === sessionId) {
          existingRow = i + 1;
          existingCalId = data[i][21] || ''; // Calendar Event ID column
          break;
        }
      }
    }

    // --- Create Google Calendar Event if date & time provided ---
    var calEventId = existingCalId;
    if (p.bookingDate && p.bookingTime && !calEventId) {
      calEventId = createCalendarBooking_(p);
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
      // Booking
      p.bookingDate || '',                  // Booking Date
      p.bookingTime || '',                  // Booking Time
      calEventId,                           // Calendar Event ID
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

    return json_({ result: 'ok', calendarEventId: calEventId });
  } catch (err) {
    return json_({ result: 'error', message: String(err) });
  } finally {
    lock.releaseLock();
  }
}

function createCalendarBooking_(p) {
  try {
    if (!p.bookingDate || !p.bookingTime) return '';
    var start = new Date(p.bookingDate + 'T' + p.bookingTime + ':00');
    var end = new Date(start.getTime() + 30 * 60 * 1000); // 30 min duration

    var name = p.name || 'Lead';
    var email = p.email || '';
    var phone = p.phone || '';
    var title = 'Weflux Demo — ' + name + (p.company ? (' (' + p.company + ')') : '');

    var desc = 'Weflux 1-on-1 Product Demo Session\n\n' +
               'Lead Details:\n' +
               '• Name: ' + name + '\n' +
               '• Email: ' + email + '\n' +
               '• Phone: ' + phone + '\n' +
               '• Business: ' + (p.businessType || 'N/A') + '\n' +
               '• Current Setup: ' + (p.whatsappUsage || 'N/A') + (p.currentProvider ? (' (' + p.currentProvider + ')') : '') + '\n' +
               '• Monthly Volume: ' + (p.monthlyConversations || 'N/A') + '\n' +
               '• Team Size: ' + (p.teamSize || 'N/A') + '\n' +
               '• Features Interest: ' + (p.features || 'N/A') + '\n' +
               '• Timeline: ' + (p.timeline || 'N/A') + '\n' +
               '• Budget: ' + (p.budget || 'N/A');

    var cal = CalendarApp.getDefaultCalendar();
    var options = {
      description: desc,
      sendInvites: true
    };
    if (email && email.indexOf('@') !== -1) {
      options.guests = email;
    }
    var event = cal.createEvent(title, start, end, options);
    return event.getId();
  } catch (err) {
    Logger.log('Calendar creation failed: ' + err);
    return 'Failed: ' + String(err);
  }
}

function doGet() {
  return json_({ result: 'ok', message: 'Lead capture & native calendar booking endpoint is live.' });
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
    sheet.setColumnWidth(20, 130);  // Booking Date
    sheet.setColumnWidth(21, 110);  // Booking Time
    sheet.setColumnWidth(22, 220);  // Calendar Event ID
  }
  return sheet;
}

function json_(obj) {
  return ContentService
    .createTextOutput(JSON.stringify(obj))
    .setMimeType(ContentService.MimeType.JSON);
}
