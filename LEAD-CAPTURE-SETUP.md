# Weflux — Google Calendar Booking & Google Apps Script Setup Guide

This guide explains how to connect your **Google Calendar** (`hello@weflux.in`) for live demo bookings and set up the **Google Sheet & Apps Script** for capturing intent leads.

---

## 1. Setting Up Google Calendar Appointment Booking (`hello@weflux.in`)

Google Workspace includes built-in **Appointment Schedules** so visitors can pick an available time slot directly on your `hello@weflux.in` calendar.

### How to create your Appointment Booking Link:

1. Log into **Google Calendar** using `hello@weflux.in`.
2. Click **+ Create** (top-left) → Select **Appointment schedule**.
3. Set the schedule details:
   - **Title**: `Weflux Demo & Product Consultation (30 min)`
   - **Duration**: `30 minutes`
   - **General Availability**: Set your available working days and hours (e.g. Mon–Fri, 10:00 AM – 6:00 PM IST).
   - **Booking Window**: e.g., Available up to 30 days in advance.
   - **Location / Conference**: Select **Google Meet** (auto-generates meeting link upon booking).
4. Click **Save**.
5. Click **Share** on your new Appointment Schedule → Click **Copy link**.
   - Your link will look like: `https://calendar.app.google/XXXXX` or `https://calendar.google.com/calendar/u/0/appointments/s/XXXXX`

### Where to paste your Google Calendar Booking Link in the code:

Open [lead-capture.js](file:///Users/bosc/Websites/bulkmessage-sender/lead-capture.js#L22):
```javascript
// Line 22:
bookingUrl: 'https://calendar.google.com/calendar/u/0/appointments/s/YOUR_ACTUAL_BOOKING_LINK'
```

Open [contact.html](file:///Users/bosc/Websites/bulkmessage-sender/contact.html#L109):
```html
<!-- Line 109: -->
<a href="https://calendar.google.com/calendar/u/0/appointments/s/YOUR_ACTUAL_BOOKING_LINK" target="_blank" rel="noopener" class="btn btn-green">Book on Google Calendar →</a>
```

Whenever someone clicks **"Book a Demo"** (in the popup thank-you screen or contact page), it will open your Google Calendar booking page in a new tab where they can pick a slot. The event and Google Meet link are automatically added to your `hello@weflux.in` calendar!

---

## 2. Setting Up Google Apps Script for Google Sheet Lead Capture

The system captures both **Phase 1** (contact details saved instantly on "Continue") and **Phase 2** (8 qualification answers) directly into your Google Sheet.

### Step-by-Step Instructions:

1. Open **Google Sheets** ([sheets.google.com](https://sheets.google.com)) while logged into your Google account.
2. Create a **New Spreadsheet** and name it `Weflux Intent Leads`.
3. In the top menu, go to **Extensions** → **Apps Script**.
4. Delete any existing sample code in `Code.gs`.
5. Copy the complete code from [lead-capture-form.gs](file:///Users/bosc/Websites/bulkmessage-sender/lead-capture-form.gs) and paste it into `Code.gs`.
6. Click the **Save** icon (💾) or press `Cmd+S` / `Ctrl+S`.
7. Click **Deploy** (top-right) → **New deployment**.
8. Click the gear icon (⚙️) next to *Select type* → choose **Web app**.
9. Configure deployment settings:
   - **Description**: `Weflux Lead Capture v2`
   - **Execute as**: `Me (your email)`
   - **Who has access**: `Anyone` *(Crucial: must be set to Anyone so web forms can submit)*
10. Click **Deploy**.
11. Grant permissions when prompted (*Advanced → Go to Untitled project (unsafe) → Allow*).
12. Copy the generated **Web App URL** (starts with `https://script.google.com/macros/s/XXXXX/exec`).

### Where to paste your Apps Script URL:

Open [lead-capture.js](file:///Users/bosc/Websites/bulkmessage-sender/lead-capture.js#L20):
```javascript
// Line 20:
endpoint: 'https://script.google.com/macros/s/YOUR_DEPLOYED_SCRIPT_ID/exec'
```

---

## Predefined Headers Generated in your Google Sheet

When the script receives its first submission, it automatically creates a sheet named `IntentLeads` with these 25 formatted columns:

| Column # | Header Name | Description |
|----------|-------------|-------------|
| 1 | `Timestamp` | Date & time of interaction |
| 2 | `Session ID` | Unique ID for deduplication (merges partial & complete submissions) |
| 3 | `Status` | `contact_captured`, `qualification_in_progress`, `completed`, or `skipped_qualification` |
| 4 | `Abandoned At` | Step at which visitor closed form (e.g. `contact`, `step_3`) |
| 5 | `Intent Score` | Point score (0–100) based on answers |
| 6 | `Intent Tier` | `🔥 Hot Lead`, `🟡 Warm Lead`, or `🔵 Cold Lead` |
| 7 | `Name` | Full Name |
| 8 | `Phone` | Mobile Number (with country code) |
| 9 | `Email` | Work Email |
| 10 | `Country` | Country Name |
| 11 | `Business Type` | e.g. Ecommerce, Healthcare, Agency |
| 12 | `WhatsApp Usage` | Never used, App, or API |
| 13 | `Current Provider` | AiSensy, Interakt, WATI, etc. (if API selected) |
| 14 | `Monthly Conversations` | Under 500, 500-2,000, 2,000-10,000, 10,000+ |
| 15 | `Team Size` | Just me, 2-5, 6-20, 20+ |
| 16 | `WhatsApp Numbers` | 1, 2-3, 4-10, More than 10 |
| 17 | `Features` | Selected key features (comma-separated) |
| 18 | `Timeline` | Today, Within a week, This month, Just exploring |
| 19 | `Budget` | Under ₹1,000, ₹1,000-2,500, ₹2,500-5,000, ₹5,000+ |
| 20 | `Source Page` | Path where popup opened |
| 21 | `Time on Page (s)` | Seconds visitor spent on page before opening |
| 22 | `Device` | Mobile or Desktop |
| 23 | `UTM Source` | `utm_source` query parameter |
| 24 | `UTM Medium` | `utm_medium` query parameter |
| 25 | `UTM Campaign` | `utm_campaign` query parameter |

---

## 3. Rebuilding the Site

After updating `lead-capture.js` or `contact.html` with your URLs, run:
```bash
node build.js
```
Then commit and push your changes to deploy to production.
