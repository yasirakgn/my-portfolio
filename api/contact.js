// api/contact.js
export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).send("Method Not Allowed");
  }

  const { name, email, message } = req.body || {};
  if (!name || !email || !message) {
    return res.status(400).send("Eksik alanlar: name, email, message zorunlu.");
  }

  const apiKey = process.env.BREVO_API_KEY; // Vercel Environment Variable
  if (!apiKey) {
    return res.status(500).send("Server misconfig: BREVO_API_KEY tanımlı değil.");
  }

  try {
    // Brevo Transactional Email API
    const brevoRes = await fetch("https://api.brevo.com/v3/smtp/email", {
      method: "POST",
      headers: {
        "accept": "application/json",
        "api-key": apiKey,
        "content-type": "application/json",
      },
      body: JSON.stringify({
        sender: { name, email }, // formu gönderen kişi
        to: [{ email: "ysrakhnn@gmail.com", name: "Site Sahibi" }], // ← BURAYA kendi hedef mailini yaz
        subject: "📩 Yeni İletişim Mesajı (Portfolio Sitesi)",
        htmlContent: `
          <h2>Yeni Mesaj</h2>
          <p><b>Ad Soyad:</b> ${escapeHtml(name)}</p>
          <p><b>E-posta:</b> ${escapeHtml(email)}</p>
          <p><b>Mesaj:</b><br/>${escapeHtml(message).replace(/\n/g, "<br/>")}</p>
        `,
      }),
    });

    if (!brevoRes.ok) {
      const errText = await brevoRes.text();
      return res.status(502).send("Brevo API Hatası: " + errText);
    }

    return res.status(200).json({ ok: true });
  } catch (err) {
    return res.status(500).send("Sunucu hatası: " + err.message);
  }
}

// Basit XSS & HTML inject önlemi:
function escapeHtml(str = "") {
  return String(str)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}
