// api/contact.js

// Google reCAPTCHA doğrulama
async function verifyCaptcha(token) {
  const secret = process.env.RECAPTCHA_SECRET;
  // Secret yoksa (lokalde test) captcha'yı geç
  if (!secret) return true;

  const params = new URLSearchParams();
  params.append("secret", secret);
  params.append("response", token);

  const resp = await fetch("https://www.google.com/recaptcha/api/siteverify", {
    method: "POST",
    body: params,
  });

  const data = await resp.json();
  return data.success === true;
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

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).send("Method Not Allowed");

  const { name, email, message, captcha } = req.body || {};
  if (!name || !message) return res.status(400).send("Ad ve mesaj zorunlu.");

  // 1) CAPTCHA KONTROLÜ
  const isHuman = await verifyCaptcha(captcha);
  if (!isHuman) {
    return res.status(400).send("Captcha doğrulanamadı.");
  }

  // 2) Brevo ayarları
  const { BREVO_API_KEY, SENDER_EMAIL, CONTACT_TO } = process.env;
  if (!BREVO_API_KEY || !SENDER_EMAIL || !CONTACT_TO) {
    return res.status(500).send("Sunucu ayarı eksik (BREVO_API_KEY, SENDER_EMAIL, CONTACT_TO).");
  }

  try {
    const payload = {
      sender: { name: "Portfolio Formu", email: SENDER_EMAIL }, // doğrulanmış olmalı
      to: [{ email: CONTACT_TO, name: "Site Sahibi" }],
      subject: "Yeni İletişim Mesajı",
      htmlContent: `
        <h3>Yeni mesaj</h3>
        <p><b>Ad:</b> ${escapeHtml(name)}</p>
        <p><b>E-posta:</b> ${email ? escapeHtml(email) : "<i>verilmedi</i>"}</p>
        <p><b>Mesaj:</b><br/>${escapeHtml(message).replace(/\n/g, "<br/>")}</p>
      `,
    };

    // Kullanıcı mail girdiyse reply-to ekle
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
