/**
 * Weflux — Multi-Sheet Lead Capture & Google Calendar Sync
 * ---------------------------------------------------------
 * Manages TWO sheets in a single Google Spreadsheet:
 *   1. "IntentLeads"       → Popup Submissions & Native Demo Bookings
 *   2. "ContactFormLeads" → Contact Page Form Submissions
 *
 * ROUTING:
 *  - If formType === 'contact' or 'topic' parameter is present:
 *      Appends a row to the "ContactFormLeads" sheet.
 *  - Otherwise (formType === 'popup' or sessionId present):
 *      Upserts a row in the "IntentLeads" sheet by Session ID
 *      and creates a Google Calendar event if Date & Time are selected.
 *
 * SETUP INSTRUCTIONS:
 *  1. Create a Google Spreadsheet (e.g., "Weflux All Leads").
 *  2. Go to Extensions → Apps Script. Paste this entire code into Code.gs.
 *  3. Click Deploy → New deployment.
 *       - Select type: Web app
 *       - Execute as:  Me (hello@weflux.in)
 *       - Who has access: Anyone
 *  4. Click Deploy, authorize access, and copy the Web App URL.
 *  5. Paste the URL into:
 *       - lead-capture.js → CONFIG.endpoint
 *       - contact.html    → <form data-endpoint="...">
 */

var SHEET_POPUP = 'IntentLeads';
var SHEET_CONTACT = 'ContactFormLeads';

// Tab 1: IntentLeads Headers (28 columns)
var HEADERS_POPUP = [
  'Timestamp',
  'Session ID',
  'Status',
  'Abandoned At',
  'Intent Score',
  'Intent Tier',
  'Name',
  'Phone',
  'Email',
  'Country',
  'Business Type',
  'WhatsApp Usage',
  'Current Provider',
  'Monthly Conversations',
  'Team Size',
  'WhatsApp Numbers',
  'Features',
  'Timeline',
  'Budget',
  'Booking Date',
  'Booking Time',
  'Calendar Event ID',
  'Source Page',
  'Time on Page (s)',
  'Device',
  'UTM Source',
  'UTM Medium',
  'UTM Campaign'
];

// Tab 2: ContactFormLeads Headers (10 columns)
var HEADERS_CONTACT = [
  'Timestamp',
  'Name',
  'Company',
  'Email',
  'Country',
  'Phone',
  'Topic',
  'Team Size',
  'Message',
  'Source Page'
];

function doPost(e) {
  var lock = LockService.getScriptLock();
  lock.waitLock(20000);

  try {
    var p = (e && e.parameter) ? e.parameter : {};
    var isContactForm = (p.formType === 'contact') || (p.topic && !p.sessionId);

    if (isContactForm) {
      return handleContactForm_(p);
    } else {
      return handlePopupLead_(p);
    }
  } catch (err) {
    return json_({ result: 'error', message: String(err) });
  } finally {
    lock.releaseLock();
  }
}

// Handler for Tab 2: Contact Page Form
function handleContactForm_(p) {
  var sheet = getSheet_(SHEET_CONTACT, HEADERS_CONTACT);
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
    p.page || p.sourcePage || ''
  ]);
  return json_({ result: 'ok', sheet: SHEET_CONTACT });
}

// Handler for Tab 1: Popup Lead Capture & Calendar Booking
function handlePopupLead_(p) {
  var sheet = getSheet_(SHEET_POPUP, HEADERS_POPUP);
  var sessionId = p.sessionId || '';

  // Upsert: find existing row by sessionId
  var existingRow = -1;
  var existingCalId = '';
  if (sessionId) {
    var data = sheet.getDataRange().getValues();
    for (var i = 1; i < data.length; i++) {
      if (data[i][1] === sessionId) {
        existingRow = i + 1;
        existingCalId = data[i][21] || '';
        break;
      }
    }
  }

  // Create Google Calendar event if booking Date & Time provided
  var calEventId = existingCalId;
  if (p.bookingDate && p.bookingTime && !calEventId) {
    calEventId = createCalendarBooking_(p);
  }

  var row = [
    new Date(),
    sessionId,
    p.status || 'partial',
    p.abandonedAtStep || '',
    p.intentScore || '0',
    p.intentTier || '',
    p.name || '',
    p.phone || '',
    p.email || '',
    p.country || '',
    p.businessType || '',
    p.whatsappUsage || '',
    p.currentProvider || '',
    p.monthlyConversations || '',
    p.teamSize || '',
    p.whatsappNumbers || '',
    p.features || '',
    p.timeline || '',
    p.budget || '',
    p.bookingDate || '',
    p.bookingTime || '',
    calEventId,
    p.sourcePage || '',
    p.timeOnPage || '',
    p.device || '',
    p.utmSource || '',
    p.utmMedium || '',
    p.utmCampaign || ''
  ];

  if (existingRow > 0) {
    sheet.getRange(existingRow, 1, 1, row.length).setValues([row]);
  } else {
    sheet.appendRow(row);
  }

  return json_({ result: 'ok', sheet: SHEET_POPUP, calendarEventId: calEventId });
}

// Helper: Create Google Calendar Event
function createCalendarBooking_(p) {
  try {
    if (!p.bookingDate || !p.bookingTime) return '';
    var start = new Date(p.bookingDate + 'T' + p.bookingTime + ':00');
    var end = new Date(start.getTime() + 30 * 60 * 1000);

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
  return json_({ result: 'ok', message: 'Weflux unified lead capture endpoint is live.' });
}

function getSheet_(sheetName, headers) {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = ss.getSheetByName(sheetName);
  if (!sheet) {
    sheet = ss.insertSheet(sheetName);
  }
  if (sheet.getLastRow() === 0) {
    sheet.appendRow(headers);
    sheet.getRange(1, 1, 1, headers.length).setFontWeight('bold');
    sheet.setFrozenRows(1);
  }
  return sheet;
}

function json_(obj) {
  return ContentService
    .createTextOutput(JSON.stringify(obj))
    .setMimeType(ContentService.MimeType.JSON);
}
