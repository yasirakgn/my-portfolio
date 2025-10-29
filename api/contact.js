// api/contact.js
export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).send("Method Not Allowed");

  const { name, email, message } = req.body || {};
  if (!name || !message) return res.status(400).send("Ad ve mesaj zorunlu.");

  const { BREVO_API_KEY, SENDER_EMAIL, CONTACT_TO } = process.env;
  if (!BREVO_API_KEY || !SENDER_EMAIL || !CONTACT_TO) {
    return res.status(500).send("Sunucu ayarı eksik (BREVO_API_KEY, SENDER_EMAIL, CONTACT_TO).");
  }

  try {
    const payload = {
      sender: { name: "Portfolio Formu", email: SENDER_EMAIL }, // sabit & doğrulanmış
      to: [{ email: CONTACT_TO, name: "Site Sahibi" }],
      subject: "Yeni İletişim Mesajı",
      htmlContent: `
        <h3>Yeni mesaj</h3>
        <p><b>Ad:</b> ${escapeHtml(name)}</p>
        <p><b>E-posta:</b> ${email ? escapeHtml(email) : "<i>verilmedi</i>"}</p>
        <p><b>Mesaj:</b><br/>${escapeHtml(message).replace(/\n/g, "<br/>")}</p>
      `,
    };

    // Kullanıcı e-posta girdiyse, cevaplayabilmen için Reply-To ekle
    if (email) payload.replyTo = { name, email };

    const response = await fetch("https://api.brevo.com/v3/smtp/email", {
      method: "POST",
      headers: {
        accept: "application/json",
        "api-key": BREVO_API_KEY,
        "content-type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    const text = await response.text();
    if (!response.ok) return res.status(502).send("Brevo API hatası: " + text);

    return res.status(200).json({ ok: true });
  } catch (err) {
    return res.status(500).send("Sunucu hatası: " + err.message);
  }
}

// Basit XSS koruması
function escapeHtml(s = "") {
  return String(s)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}
