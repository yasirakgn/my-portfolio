import React, { useState } from "react";
import ReCAPTCHA from "react-google-recaptcha";
import { Send } from "lucide-react";

export default function ContactForm() {
  const [formData, setFormData] = useState({ name: "", email: "", message: "" });
  const [captcha, setCaptcha] = useState(null);
  const [status, setStatus] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus("");
    setLoading(true);

    if (!captcha) {
      setStatus("❌ Please complete the reCAPTCHA verification.");
      setLoading(false);
      return;
    }

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ ...formData, captcha }),
      });

      if (res.ok) setStatus("✅ Your message has been sent successfully!");
      else setStatus("❌ Failed to send your message. Please try again.");
    } catch (err) {
      setStatus("❌ Server error: " + err.message);
    }

    setLoading(false);
  };

  return (
    <div className="max-w-lg mx-auto bg-gray-800 p-6 rounded-xl shadow-lg">
      <h2 className="text-2xl font-bold mb-4 text-indigo-300">Contact Form</h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          name="name"
          placeholder="Your name"
          onChange={handleChange}
          className="w-full p-2 rounded bg-gray-700 text-white border border-gray-600 focus:ring-2 focus:ring-cyan-500"
          required
        />

        <input
          type="email"
          name="email"
          placeholder="Your email (optional)"
          onChange={handleChange}
          className="w-full p-2 rounded bg-gray-700 text-white border border-gray-600 focus:ring-2 focus:ring-cyan-500"
        />

        <textarea
          name="message"
          placeholder="Your message"
          rows="5"
          onChange={handleChange}
          className="w-full p-2 rounded bg-gray-700 text-white border border-gray-600 focus:ring-2 focus:ring-cyan-500"
          required
        />

        {/* reCAPTCHA */}
        <ReCAPTCHA
          sitekey={process.env.REACT_APP_RECAPTCHA_SITE_KEY}
          onChange={setCaptcha}
        />

        <button
          type="submit"
          disabled={loading}
          className={`flex items-center gap-2 px-4 py-2 rounded text-white font-semibold transition ${
            loading ? "bg-gray-600 cursor-not-allowed" : "bg-cyan-600 hover:bg-cyan-500"
          }`}
        >
          <Send size={18} />
          {loading ? "Sending..." : "Send Message"}
        </button>

        {status && (
          <p className="text-sm text-gray-300 mt-2">
            {status}
          </p>
        )}
      </form>
    </div>
  );
}
