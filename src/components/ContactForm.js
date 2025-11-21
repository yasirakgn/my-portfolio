import React, { useState } from "react";
import { Mail, User, Send, Check } from "lucide-react";

export default function ContactForm() {
  const [formState, setFormState] = useState("idle"); // idle, sending, success

  const handleSubmit = (e) => {
    e.preventDefault();
    setFormState("sending");
    // Simule edilmiş gönderim
    setTimeout(() => setFormState("success"), 1500);
  };

  return (
    <div className="max-w-2xl mx-auto">
       <h2 className="text-2xl font-bold text-cyan-400 mb-6 flex items-center font-mono border-b border-gray-700 pb-2">
        <Mail className="mr-3"/> İLETİŞİM AĞI
      </h2>
      <div className="bg-gray-800 border-t-4 border-cyan-500 p-8 rounded shadow-2xl relative">
        {formState === "success" ? (
          <div className="text-center py-10">
            <div className="w-20 h-20 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-4 border-2 border-green-500 text-green-400">
              <Check size={40} />
            </div>
            <h3 className="text-2xl font-bold text-white mb-2">Mesaj İletildi!</h3>
            <p className="text-gray-400">Sistem yöneticisi en kısa sürede dönüş yapacaktır.</p>
            <button onClick={() => setFormState("idle")} className="mt-6 text-cyan-400 hover:underline">Yeni Mesaj Gönder</button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-xs font-mono text-cyan-400 uppercase">Kimlik (Ad Soyad)</label>
                <div className="relative">
                  <User className="absolute left-3 top-3 text-gray-500 w-5 h-5" />
                  <input required type="text" className="w-full bg-gray-900 border border-gray-600 text-white pl-10 p-3 rounded focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 outline-none transition-colors font-mono" placeholder="Ad Soyad" />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-xs font-mono text-cyan-400 uppercase">Frekans (E-posta)</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 text-gray-500 w-5 h-5" />
                  <input required type="email" className="w-full bg-gray-900 border border-gray-600 text-white pl-10 p-3 rounded focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 outline-none transition-colors font-mono" placeholder="ornek@email.com" />
                </div>
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-xs font-mono text-cyan-400 uppercase">Veri Paketi (Mesaj)</label>
              <textarea required rows="5" className="w-full bg-gray-900 border border-gray-600 text-white p-3 rounded focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 outline-none transition-colors font-mono" placeholder="Mesajınızı buraya girin..."></textarea>
            </div>
            <button 
              type="submit" 
              disabled={formState === "sending"}
              className="w-full bg-cyan-700 hover:bg-cyan-600 disabled:bg-gray-600 text-white font-bold py-3 px-6 rounded shadow transition-all flex items-center justify-center gap-2"
            >
              {formState === "sending" ? (
                <><div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div> GÖNDERİLİYOR...</>
              ) : (
                <><Send className="w-5 h-5" /> VERİYİ GÖNDER</>
              )}
            </button>
          </form>
        )}
        
        {/* Dekoratif Köşeler */}
        <div className="absolute top-0 left-0 w-4 h-4 border-l-2 border-t-2 border-cyan-500"></div>
        <div className="absolute top-0 right-0 w-4 h-4 border-r-2 border-t-2 border-cyan-500"></div>
        <div className="absolute bottom-0 left-0 w-4 h-4 border-l-2 border-b-2 border-cyan-500"></div>
        <div className="absolute bottom-0 right-0 w-4 h-4 border-r-2 border-b-2 border-cyan-500"></div>
      </div>
    </div>
  );
}