/**
 * RADIANCE lead capture → Google Sheet.
 *
 * Deploy: Extensions ▸ Apps Script in the leads Google Sheet, paste this file,
 * then Deploy ▸ New deployment ▸ Web app (Execute as: Me, Access: Anyone).
 * Put the /exec URL in the website's .env as VITE_LEADS_ENDPOINT and rebuild.
 * Full steps: LEADS_SETUP.md
 */

const SHEET_NAME = "Leads";
const NOTIFY_EMAIL = "radiance@adinarayanbuildconllp.com"; // set to "" to disable alerts
const HEADERS = ["Received (IST)", "Name", "Phone", "Email", "Interested in", "Message", "Source", "Consent", "Page", "User agent"];

function doPost(e) {
  const lock = LockService.getScriptLock();
  lock.tryLock(10000);
  try {
    const data = JSON.parse((e && e.postData && e.postData.contents) || "{}");

    // Basic server-side validation mirrors the site's client-side checks.
    const name = String(data.name || "").trim().slice(0, 120);
    const phone = String(data.phone || "").replace(/[^\d+]/g, "").slice(0, 16);
    if (data.website) return json({ ok: true }); // honeypot
    if (name.length < 2 || !/^(\+?91)?[6-9]\d{9}$/.test(phone)) return json({ ok: false, error: "invalid" });

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
    // Prefix values that spreadsheets would treat as formulas.
    sheet.appendRow(row.map((v) => (typeof v === "string" && /^[=+\-@]/.test(v) ? "'" + v : v)));

    if (NOTIFY_EMAIL) {
      MailApp.sendEmail({
        to: NOTIFY_EMAIL,
        subject: `New RADIANCE lead (${row[6]}): ${name}`,
        body: HEADERS.map((h, i) => `${h}: ${row[i]}`).join("\n"),
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
  return json({ ok: true, service: "radiance-leads" });
}

function getSheet() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  let sheet = ss.getSheetByName(SHEET_NAME);
  if (!sheet) sheet = ss.insertSheet(SHEET_NAME);
  if (sheet.getLastRow() === 0) {
    sheet.appendRow(HEADERS);
    sheet.setFrozenRows(1);
    sheet.getRange(1, 1, 1, HEADERS.length).setFontWeight("bold");
  }
  return sheet;
}

function json(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj)).setMimeType(ContentService.MimeType.JSON);
}
