# Weflux — Native Calendar Booking & Google Apps Script Setup Guide

This guide explains how the **Native Calendar Booking** system works (zero external redirects, custom Weflux UI) and how to set up **Google Apps Script** to automatically create Google Calendar events on `hello@weflux.in` and store lead data in your Google Sheet.

---

## 1. How Native Calendar Booking Works (No External Redirects!)

1. **Custom Weflux UI**: The visitor picks their preferred Date (e.g. `Mon, Jul 27`) and Time slot (e.g. `2:00 PM`) right inside the Weflux popup. No Google logos, no external windows.
2. **Instant Creation**: When they click **Confirm Booking**, the data is sent to your **Google Apps Script**.
3. **Google Calendar Sync**:
   - Apps Script uses `CalendarApp.getDefaultCalendar()` to create a 30-minute event on your `hello@weflux.in` Google Calendar.
   - It includes all lead details (Name, Phone, Email, Business Type, Team Size, Timeline, Budget) in the event description.
   - It automatically sends a **Google Calendar invitation** to the lead's email!
4. **Google Sheet Logging**: It records the `Booking Date`, `Booking Time`, and `Calendar Event ID` right in your Google Sheet row.

---

## 2. Setting Up Google Apps Script (One-Time Setup)

### Step-by-Step Instructions:

1. Open **Google Sheets** ([sheets.google.com](https://sheets.google.com)) while logged into your **`hello@weflux.in`** Google Workspace account.
2. Create a **New Spreadsheet** and name it `Weflux Intent Leads`.
3. In the top menu, go to **Extensions** → **Apps Script**.
4. Delete any existing sample code in `Code.gs`.
5. Copy the complete code from [lead-capture-form.gs](file:///Users/bosc/Websites/bulkmessage-sender/lead-capture-form.gs) and paste it into `Code.gs`.
6. Click the **Save** icon (💾) or press `Cmd+S` / `Ctrl+S`.
7. Click **Deploy** (top-right) → **New deployment**.
8. Click the gear icon (⚙️) next to *Select type* → choose **Web app**.
9. Configure deployment settings:
   - **Description**: `Weflux Lead Capture & Calendar Booking`
   - **Execute as**: `Me (hello@weflux.in)`
   - **Who has access**: `Anyone` *(Crucial: must be set to Anyone so web forms can submit)*
10. Click **Deploy**.
11. Grant permissions when prompted (*Advanced → Go to project (unsafe) → Allow Google Calendar & Sheets permissions*).
12. Copy the generated **Web App URL** (starts with `https://script.google.com/macros/s/XXXXX/exec`).

### Where to paste your Apps Script Web App URL:

Open [lead-capture.js](file:///Users/bosc/Websites/bulkmessage-sender/lead-capture.js#L20):
```javascript
// Line 20:
endpoint: 'https://script.google.com/macros/s/YOUR_DEPLOYED_SCRIPT_ID/exec'
```

---

## Predefined Headers Generated in your Google Sheet

When the script receives its first submission, it automatically creates a sheet named `IntentLeads` with these 28 formatted columns:

| Column # | Header Name | Description |
|----------|-------------|-------------|
| 1 | `Timestamp` | Date & time of interaction |
| 2 | `Session ID` | Unique ID for deduplication (merges partial & complete submissions) |
| 3 | `Status` | `contact_captured`, `qualification_in_progress`, `demo_booked`, or `completed` |
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
| 20 | `Booking Date` | Selected Date (e.g. `2026-07-28`) |
| 21 | `Booking Time` | Selected Time Slot (e.g. `14:00`) |
| 22 | `Calendar Event ID` | Google Calendar Event ID |
| 23 | `Source Page` | Path where popup opened |
| 24 | `Time on Page (s)` | Seconds visitor spent on page before opening |
| 25 | `Device` | Mobile or Desktop |
| 26 | `UTM Source` | `utm_source` query parameter |
| 27 | `UTM Medium` | `utm_medium` query parameter |
| 28 | `UTM Campaign` | `utm_campaign` query parameter |

---

## 3. Rebuilding the Site

After updating `lead-capture.js` with your endpoint URL, run:
```bash
node build.js
```
Then commit and push your changes to deploy to production.
