# Weflux — Unified Dual-Sheet Lead Capture & Calendar Sync Setup Guide

This guide explains how to set up **ONE Google Spreadsheet** with **TWO automatically managed tabs**:
1. **`IntentLeads`** → Popup Submissions, Phase 1 Contact Info, Qualification & Native Calendar Bookings.
2. **`ContactFormLeads`** → Main Contact Page Submissions (`contact.html`).

---

## 1. Step-by-Step Google Apps Script Setup (One-Time)

1. Open **Google Sheets** ([sheets.google.com](https://sheets.google.com)) while logged into your **`hello@weflux.in`** account.
2. Create a **New Spreadsheet** and name it `Weflux Master Leads`.
3. In the top menu, go to **Extensions** → **Apps Script**.
4. Delete any existing sample code in `Code.gs`.
5. Copy the complete unified code from [lead-capture-form.gs](file:///Users/bosc/Websites/bulkmessage-sender/lead-capture-form.gs) and paste it into `Code.gs`.
6. Click the **Save** icon (💾) or press `Cmd+S` / `Ctrl+S`.
7. Click **Deploy** (top-right) → **New deployment**.
8. Click the gear icon (⚙️) next to *Select type* → choose **Web app**.
9. Configure deployment settings:
   - **Description**: `Weflux Unified Lead Capture v2`
   - **Execute as**: `Me (hello@weflux.in)`
   - **Who has access**: `Anyone` *(Crucial: must be set to Anyone so web forms can submit)*
10. Click **Deploy**.
11. Grant permissions when prompted (*Advanced → Go to project (unsafe) → Allow Google Calendar & Sheets permissions*).
12. Copy the generated **Web App URL** (starts with `https://script.google.com/macros/s/XXXXX/exec`).

---

## 2. Where to Paste Your Web App URL in Code

### A. Popup Engine (`lead-capture.js`):
Open [lead-capture.js (Line 20)](file:///Users/bosc/Websites/bulkmessage-sender/lead-capture.js#L20):
```javascript
// Line 20:
endpoint: 'https://script.google.com/macros/s/YOUR_DEPLOYED_SCRIPT_ID/exec'
```

### B. Contact Page Form (`contact.html`):
Open [contact.html (Line 46)](file:///Users/bosc/Websites/bulkmessage-sender/contact.html#L46):
```html
<!-- Line 46: -->
<form id="contactForm" novalidate data-endpoint="https://script.google.com/macros/s/YOUR_DEPLOYED_SCRIPT_ID/exec">
```

---

## 3. Spreadsheet Structure & Automatically Generated Tabs

When the script receives submissions, it automatically creates both tabs with formatted headers:

### Tab 1: `IntentLeads` (Popup Lead Capturing & Native Demo Bookings)
| Column # | Header Name | Description |
|----------|-------------|-------------|
| 1 | `Timestamp` | Date & time of interaction |
| 2 | `Session ID` | Unique ID for deduplication (merges partial & complete submissions) |
| 3 | `Status` | `contact_captured`, `qualification_in_progress`, `demo_booked`, or `completed` |
| 4 | `Abandoned At` | Step at which visitor closed form (e.g. `contact`, `step_3`) |
| 5 | `Intent Score` | Point score (0–100) based on answers |
| 6 | `Intent Tier` | `🔥 Hot Lead`, `🟡 Warm Lead`, or `🔵 Cold Lead` |
| 7 | `Name` | Full Name |
| 8 | `Phone` | Mobile Number |
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

### Tab 2: `ContactFormLeads` (Contact Page Form Submissions)
| Column # | Header Name | Description |
|----------|-------------|-------------|
| 1 | `Timestamp` | Submission Date & Time |
| 2 | `Name` | Visitor Name |
| 3 | `Company` | Company Name |
| 4 | `Email` | Work Email |
| 5 | `Country` | Country Name |
| 6 | `Phone` | Phone Number |
| 7 | `Topic` | Dropdown Topic |
| 8 | `Team Size` | Team Size Dropdown |
| 9 | `Message` | Custom Message Text |
| 10 | `Source Page` | Page URL |

---

## 4. Rebuilding the Site

After pasting your Web App URL into `lead-capture.js` and `contact.html`, run:
```bash
node build.js
```
Then commit and push your changes to deploy live.
