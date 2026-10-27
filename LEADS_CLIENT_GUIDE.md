# 📊 Adinarayan Buildcon & RADIANCE — Real-Time Leads Sheet & Excel Guide
### Step-by-Step Client Setup & Handover Instructions

This guide explains how to connect all website forms directly to a **live Google Sheet and Microsoft Excel**. Whenever any visitor submits an enquiry, requests a site visit, or downloads the **RADIANCE Brochure** or **Company Profile**, their details will appear in your spreadsheet in **real time (< 1 second)** and trigger an instant email alert to `salesadinarayanbuildconllp@gmail.com`.

---

## 🎯 What Leads Will Be Stored?
Every lead captured across the entire website lands in this spreadsheet:
1. **General Enquiries & Contact Form** (`source: company`)
2. **RADIANCE Project Enquiries** (`source: enquiry`)
3. **RADIANCE Brochure PDF Downloads** (`source: brochure`)
4. **Adinarayan Company Profile PDF Downloads** (`source: profile`)
5. **360° Virtual Tour Call-Back Requests** (`source: experience`)

---

## 🚀 5-Minute Client Setup (Step-by-Step)

### Step 1: Create the Google Sheet
1. Sign in to your Google Account (recommended: `salesadinarayanbuildconllp@gmail.com`).
2. Go to [https://sheets.google.com](https://sheets.google.com) and click **Blank spreadsheet** (+).
3. Name the sheet at the top left:
   ```
   RADIANCE & ADINARAYAN Leads
   ```

---

### Step 2: Open Google Apps Script
1. In the top menu bar of the Google Sheet, click:
   **Extensions** ▸ **Apps Script**
2. A new tab will open with a code editor.
3. Select everything in the editor (Ctrl+A), delete it, and paste the following script:

```javascript
/**
 * Adinarayan Buildcon LLP & RADIANCE
 * Real-Time Lead Capture Script
 */

const SHEET_NAME = "Leads";
const NOTIFY_EMAIL = "salesadinarayanbuildconllp@gmail.com"; // Instant email alert destination
const HEADERS = [
  "Received (IST)",
  "Name",
  "Phone",
  "Email",
  "Interested in",
  "Message",
  "Source",
  "Consent",
  "Page URL",
  "User Device"
];

function doPost(e) {
  const lock = LockService.getScriptLock();
  lock.tryLock(10000);
  try {
    const data = JSON.parse((e && e.postData && e.postData.contents) || "{}");

    // Spam honeypot protection
    if (data.website) return json({ ok: true });

    const name = String(data.name || "").trim().slice(0, 120);
    const phone = String(data.phone || "").replace(/[^\d+]/g, "").slice(0, 16);

    // Validation
    if (name.length < 2 || !/^(\+?91)?[6-9]\d{9}$/.test(phone)) {
      return json({ ok: false, error: "invalid_input" });
    }

    const sheet = getSheet();
    const row = [
      Utilities.formatDate(new Date(), "Asia/Kolkata", "yyyy-MM-dd HH:mm:ss"),
      name,
      phone,
      String(data.email || "").slice(0, 160),
      String(data.interest || "").slice(0, 80),
      String(data.message || "").slice(0, 2000),
      String(data.source || "enquiry").slice(0, 40),
      data.consent ? "Yes" : "No",
      String(data.page || "").slice(0, 300),
      String(data.userAgent || "").slice(0, 300),
    ];

    // Escape formula characters to prevent spreadsheet formula injection
    sheet.appendRow(row.map((v) => (typeof v === "string" && /^[=+\-@]/.test(v) ? "'" + v : v)));

    // Send instant email notification to sales team
    if (NOTIFY_EMAIL) {
      MailApp.sendEmail({
        to: NOTIFY_EMAIL,
        subject: `🚨 New Lead (${row[6].toUpperCase()}): ${name} (${phone})`,
        body: `Hello Sales Team,\n\nYou have received a new website lead!\n\n` +
              HEADERS.map((h, i) => `${h}: ${row[i]}`).join("\n") +
              `\n\nPlease follow up with the client promptly.`
      });
    }

    return json({ ok: true });
  } catch (err) {
    return json({ ok: false, error: String(err) });
  } finally {
    lock.releaseLock();
  }
}

function doGet() {
  return json({ ok: true, service: "adinarayan-leads-active" });
}

function getSheet() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  let sheet = ss.getSheetByName(SHEET_NAME);
  if (!sheet) sheet = ss.insertSheet(SHEET_NAME);
  if (sheet.getLastRow() === 0) {
    sheet.appendRow(HEADERS);
    sheet.setFrozenRows(1);
    sheet.getRange(1, 1, 1, HEADERS.length).setFontWeight("bold").setBackground("#dcd3c3").setFontColor("#0e1628");
  }
  return sheet;
}

function json(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj)).setMimeType(ContentService.MimeType.JSON);
}
```

4. Click the **Save** icon (diskette icon) or press `Ctrl + S`.

---

### Step 3: Deploy as Web App
1. In the top right corner of Apps Script, click the blue button:
   **Deploy** ▸ **New deployment**
2. Click the gear icon (⚙️) next to "Select type" and choose **Web app**.
3. Fill in the deployment settings:
   - **Description**: `Adinarayan Leads Webhook`
   - **Execute as**: `Me (your Google account)`
   - **Who has access**: `Anyone` *(Crucial so the website can send lead entries without requiring Google logins)*
4. Click **Deploy**.
5. Google will ask for authorization:
   - Click **Authorize access**.
   - Select your Google account (`salesadinarayanbuildconllp@gmail.com`).
   - Click **Advanced** ▸ **Go to Untitled project (unsafe)** (Google shows this standard prompt for personal scripts).
   - Click **Allow**.
6. You will see a **Web app URL** that looks like:
   ```
   https://script.google.com/macros/s/AKfycbx.../exec
   ```
7. **Copy this URL** and send it to your website developer (or paste it into `.env` under `VITE_LEADS_ENDPOINT`).

---

## 📋 What Columns Appear in the Sheet?

When a visitor submits a lead, the "Leads" tab is automatically created with formatted header columns:

| Column | Header | Description | Example |
| :--- | :--- | :--- | :--- |
| **A** | `Received (IST)` | Exact date & time of submission in Indian Standard Time | `2026-10-28 10:15:30` |
| **B** | `Name` | Visitor's full name | `Rajesh Sharma` |
| **C** | `Phone` | 10-digit mobile number | `9820123456` |
| **D** | `Email` | Email address (if entered) | `rajesh@example.com` |
| **E** | `Interested in` | Selected interest | `Site visit` / `Brochure` |
| **F** | `Message` | Custom query or question | `Looking for 2 BHK pricing` |
| **G** | `Source` | Where the lead came from | `enquiry`, `brochure`, `profile`, `company` |
| **H** | `Consent` | Legal consent to contact | `Yes` |
| **I** | `Page URL` | Exact website page submitted | `https://adinarayanbuildconllp.com/radiance` |
| **J** | `User Device` | Browser / device info | Mobile / Desktop |

---

## 💼 How the Sales Team Can Work with this Data

### 1. Working Directly in Google Sheets (Recommended)
- **Live Real-time Collaboration:** Multiple telecallers and sales managers can have the sheet open on laptops or phones simultaneously.
- **Add Custom Workflow Columns:**
  You can add additional columns in Columns **K, L, M, N** without affecting the automated entries:
  - Column K: `Call Status` (*e.g. Pending, Called, Interested, Not Interested*)
  - Column L: `Telecaller Assigned` (*e.g. Ramesh, Priya*)
  - Column M: `Site Visit Scheduled Date`
  - Column N: `Remarks / Notes`

### 2. Opening & Using in Microsoft Excel (.xlsx)

#### Option A: 1-Click Excel Download (Instant)
At any time, click:
**File** ▸ **Download** ▸ **Microsoft Excel (.xlsx)**
The full spreadsheet opens in desktop Microsoft Excel with all formatting intact.

#### Option B: Live Auto-Sync to Desktop Excel (Power Query)
If the client prefers to work exclusively in desktop Microsoft Excel and wants it to refresh automatically:
1. In Google Sheets, click **File** ▸ **Share** ▸ **Publish to web**.
2. Under "Entire Document", select **Leads**, format as **CSV (Comma-separated values)**, and click **Publish**.
3. Copy the published link.
4. Open Microsoft Excel on your computer.
5. Go to the **Data** tab ▸ **From Web** (or **Get Data ▸ From Web**).
6. Paste the Google Sheet CSV link and click **Load**.
7. Whenever you open Excel or click **Refresh All**, all new leads from the website will automatically sync right into your Excel spreadsheet!

---

## 📱 Instant WhatsApp Lead Contact
Every lead includes a verified 10-digit phone number.
Telecallers can message the lead directly via WhatsApp Web / App using:
`https://wa.me/91[10_DIGIT_PHONE]?text=Hello%20[Name],%20thank%20you%20for%20enquiring%20about%20RADIANCE.`

---

## 🇮🇳 Quick Summary for Client (Hinglish / Hindi)

> **Client ke liye aasan steps:**
> 1. Apne Google account se `sheets.google.com` kholiye aur nayi Excel sheet banaiye: **RADIANCE & ADINARAYAN Leads**.
> 2. Upar menu me **Extensions ▸ Apps Script** par click kijiye.
> 3. Purana code delete karke upar diya gaya code paste karein aur Save (Ctrl+S) karein.
> 4. Upar right corner me **Deploy ▸ New deployment** select karein.
> 5. Gear icon ⚙️ me **Web app** select karein, "Who has access" me **Anyone** chuniye, aur **Deploy** karke permissions Allow kijiye.
> 6. Aakhri me jo **Web app URL** (`/exec`) milega, wo developer ko bhej dijiye.
> 7. Ab website par koi bhi Enquiry karega, Brochure download karega, ya Company Profile download karega — uska data **turant aapki sheet me new row ban kar add ho jayega** aur aapko **`salesadinarayanbuildconllp@gmail.com`** par email alert bhi aa jayega!
