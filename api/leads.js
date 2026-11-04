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

  if (req.method !== "POST") {
    return res.status(405).json({ ok: false, error: "Method not allowed" });
  }

  try {
    const endpoint =
      process.env.LEADS_ENDPOINT ||
      "https://script.google.com/macros/s/AKfycbwaCNHQ51gf80Y9vrlJdeKxHPNvdkWkSUdj9pLdI-g65tHjhW4IVPeWkiaTSwDeAoemMw/exec";

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

    return res.status(200).json(data);
  } catch (err) {
    console.error("Error proxying lead to Google Apps Script:", err);
    return res.status(500).json({ ok: false, error: String(err?.message || err) });
  }
}

