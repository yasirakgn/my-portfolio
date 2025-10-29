const response = await fetch("https://api.brevo.com/v3/smtp/email", {
  method: "POST",
  headers: {
    accept: "application/json",
    "api-key": process.env.BREVO_API_KEY,
    "content-type": "application/json",
  },
  body: JSON.stringify({
    sender: { email: "seninmailin@domain.com" },
    to: [{ email: "seninmailin@domain.com" }],
    subject: "Yeni İletişim Mesajı",
    htmlContent: `
      <h3>Yeni Mesaj</h3>
      <p><strong>Ad:</strong> ${name}</p>
      <p><strong>E-posta:</strong> ${email}</p>
      <p><strong>Mesaj:</strong> ${message}</p>
    `,
  }),
});
