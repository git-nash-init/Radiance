/**
 * Vercel Serverless Function: Lead proxy to Google Apps Script.
 * Eliminates browser CORS issues by forwarding submissions server-to-server.
 */
export default async function handler(req, res) {
  // Enable CORS for flexibility
  res.setHeader("Access-Control-Allow-Credentials", "true");
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET,OPTIONS,POST");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version"
  );

  if (req.method === "OPTIONS") {
    res.status(200).end();
    return;
  }

  const endpoint =
    process.env.LEADS_ENDPOINT ||
    "https://script.google.com/macros/s/AKfycbwaCNHQ51gf80Y9vrlJdeKxHPNvdkWkSUdj9pLdI-g65tHjhW4IVPeWkiaTSwDeAoemMw/exec";

  // Healthcheck GET: Allows verifying Google Apps Script connectivity directly in browser
  if (req.method === "GET") {
    try {
      const googleRes = await fetch(endpoint, { method: "GET", redirect: "follow" });
      const text = await googleRes.text();
      const is403 = googleRes.status === 403 || text.includes("You need access");
      return res.status(is403 ? 403 : 200).json({
        ok: !is403,
        status: googleRes.status,
        accessGranted: !is403,
        configured: Boolean(process.env.LEADS_ENDPOINT),
        message: is403
          ? "Google Apps Script 403 Forbidden: In Google Sheets, go to Extensions > Apps Script > Deploy > Manage deployments and set 'Who has access' to 'Anyone'."
          : "Google Apps Script endpoint is healthy and accessible.",
      });
    } catch (err) {
      return res.status(500).json({ ok: false, error: String(err?.message || err) });
    }
  }

  if (req.method !== "POST") {
    return res.status(405).json({ ok: false, error: "Method not allowed" });
  }

  try {
    const payload = typeof req.body === "string" ? req.body : JSON.stringify(req.body);

    const googleRes = await fetch(endpoint, {
      method: "POST",
      headers: { "Content-Type": "text/plain;charset=utf-8" },
      body: payload,
      redirect: "follow",
    });

    const text = await googleRes.text();
    let data;
    try {
      data = JSON.parse(text);
    } catch {
      data = { ok: googleRes.ok, status: googleRes.status, raw: text.slice(0, 500) };
    }

    // If Google returned an error status or 403 Forbidden page
    const is403 = googleRes.status === 403 || text.includes("You need access") || text.includes("accounts.google.com");
    if (!googleRes.ok || is403 || (data && data.ok === false)) {
      return res.status(is403 ? 403 : 502).json({
        ok: false,
        status: googleRes.status,
        code: is403 ? "GOOGLE_PERMISSION_DENIED" : "GOOGLE_APPS_SCRIPT_ERROR",
        error: is403
          ? "Google Apps Script returned 403 Forbidden: Web App permission must be set to 'Who has access: Anyone'."
          : (data?.error || `Google Apps Script failed with status ${googleRes.status}`),
      });
    }

    return res.status(200).json(data);
  } catch (err) {
    console.error("Error proxying lead to Google Apps Script:", err);
    return res.status(500).json({ ok: false, error: String(err?.message || err) });
  }
}

