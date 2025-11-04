import React, { useState } from "react";
import ReCAPTCHA from "react-google-recaptcha";
import { Send } from "lucide-react";

export default function ContactForm() {
  const [formData, setFormData] = useState({ name: "", email: "", message: "" });
  const [captcha, setCaptcha] = useState(null);
  const [status, setStatus] = useState("");

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus("Gönderiliyor...");

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ ...formData, captcha }),
      });
      if (res.ok) setStatus("✅ Mesaj başarıyla gönderildi!");
      else setStatus("❌ Gönderim hatası.");
    } catch (err) {
      setStatus("Sunucu hatası: " + err.message);
    }
  };

  return (
    <div className="max-w-lg mx-auto bg-gray-800 p-6 rounded-xl shadow-lg">
      <h2 className="text-2xl font-bold mb-4">İletişim Formu</h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          name="name"
          placeholder="Adınız"
          onChange={handleChange}
          className="w-full p-2 rounded bg-gray-700 text-white border border-gray-600 focus:ring-2 focus:ring-cyan-500"
          required
        />

        <input
          type="email"
          name="email"
          placeholder="E-posta"
          onChange={handleChange}
          className="w-full p-2 rounded bg-gray-700 text-white border border-gray-600 focus:ring-2 focus:ring-cyan-500"
        />

        <textarea
          name="message"
          placeholder="Mesajınız"
          rows="5"
          onChange={handleChange}
          className="w-full p-2 rounded bg-gray-700 text-white border border-gray-600 focus:ring-2 focus:ring-cyan-500"
          required
        />

        {/* 🔐 reCAPTCHA doğrudan sabit sitekey ile */}
        <ReCAPTCHA
          sitekey="6LedKPwrAAAAAJFkwRxMOVBqRiSykae_Ux0LRJhZ"
          onChange={setCaptcha}
        />

        <button
          type="submit"
          className="flex items-center gap-2 bg-cyan-600 hover:bg-cyan-500 px-4 py-2 rounded text-white font-semibold"
        >
          <Send size={18} /> Gönder
        </button>

        {status && <p className="text-sm text-gray-300 mt-2">{status}</p>}
      </form>
    </div>
  );
}
