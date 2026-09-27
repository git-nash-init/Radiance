# Lead capture → Google Sheet (about 10 minutes)

Every enquiry, brochure download and tour enquiry lands as a row in a Google Sheet. An email alert can optionally go to the sales inbox. No CRM is needed; tele-callers work from the sheet.

## 1. Create the sheet
1. Sign in with the client's Google account and create a sheet named, for example, **RADIANCE Leads**.
2. Open **Extensions ▸ Apps Script**.

## 2. Add the script
1. Delete the sample code and paste the contents of [`apps-script/Code.gs`](apps-script/Code.gs).
2. Optionally edit `NOTIFY_EMAIL` at the top. Set it to `""` to turn off email alerts.
3. Click **Save**.

## 3. Deploy as a web app
1. Click **Deploy ▸ New deployment**. Under the gear icon, choose **Web app**.
2. Set **Execute as:** *Me*, and **Who has access:** *Anyone*.
3. Click **Deploy**, then approve the permissions. This allows access to *this* spreadsheet and sending mail as you.
4. Copy the **Web app URL**. It ends in `/exec`.

## 4. Connect the website
1. In `radiance-web/`, create a `.env` file:
   ```
   VITE_LEADS_ENDPOINT=https://script.google.com/macros/s/XXXXXXXX/exec
   ```
2. Rebuild with `npm run build` and re-upload `dist/`.

## 5. Test
Submit the enquiry form on the live site. A "Leads" tab should appear with a header row and your entry. Columns:
Received (IST) · Name · Phone · Email · Interested in · Message · Source · Consent · Page · User agent.

## Notes
- If you **edit** the script later, use **Deploy ▸ Manage deployments ▸ Edit ▸ New version**. This keeps the same URL. Creating a new deployment changes it.
- **Spam:** the form has a hidden honeypot field, and the script re-validates name and phone before writing.
- Cells starting with `= + - @` are escaped to prevent formula injection.
- Apps Script quotas (free accounts) are about 20,000 URL calls and 100 emails per day, which is far above landing-page volumes.
