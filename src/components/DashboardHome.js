import React from "react";
import {
  Play, Bot, Sparkles, MapPin, Activity, Cpu
} from "lucide-react";

export default function DashboardHome({ setPage }) {
  return (
    <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 pt-10 items-center">
      {/* Sol Taraf: Profil */}
      <div className="lg:col-span-7 space-y-8 text-center lg:text-left">
        <div className="space-y-4">
           <div className="inline-block px-3 py-1 rounded-full bg-blue-100 text-blue-600 text-xs font-bold tracking-wide shadow-sm">
             OTOMASYON & YAZILIM MÜHENDİSİ
           </div>
           <h1 className="text-5xl md:text-7xl font-extrabold text-slate-800 tracking-tight leading-tight">
             Merhaba, ben <br/>
             <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">
               Yağser Akgün.
             </span>
           </h1>
           <p className="text-lg text-slate-600 leading-relaxed max-w-2xl mx-auto lg:mx-0">
             Endüstriyel otomasyonun gücünü modern web teknolojileriyle birleştiriyorum.
             PLC programlama, SCADA sistemleri ve kullanıcı dostu arayüzler tasarlayarak
             akıllı çözümler üretiyorum.
           </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
          <button
            onClick={() => setPage('simulation')}
            className="px-8 py-4 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl shadow-lg shadow-blue-200 transition-all flex items-center justify-center gap-3 transform hover:-translate-y-1"
          >
            <Play className="w-5 h-5 fill-current" />
            Simülasyonu Başlat
          </button>
          <button
            onClick={() => setPage('ai_tools')}
            className="px-8 py-4 bg-white hover:bg-slate-50 text-slate-700 font-bold rounded-xl border border-slate-200 shadow-lg shadow-slate-100 transition-all flex items-center justify-center gap-3 transform hover:-translate-y-1"
          >
            <Bot className="w-5 h-5 text-purple-500" />
            AI Asistanı
            <Sparkles className="w-4 h-4 text-yellow-400" />
          </button>
        </div>

        <div className="flex items-center justify-center lg:justify-start gap-6 text-slate-500 text-sm font-medium pt-4">
          <div className="flex items-center gap-2">
            <MapPin className="w-4 h-4 text-red-500" /> İstanbul, TR
          </div>
          <div className="flex items-center gap-2">
             <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
             Yeni Projelere Açık
          </div>
        </div>
      </div>

      {/* Sağ Taraf: Kartlar */}
      <div className="lg:col-span-5 space-y-6">
        <div className="bg-white p-6 rounded-2xl shadow-xl shadow-slate-200/50 border border-slate-100 transform rotate-1 hover:rotate-0 transition-transform duration-300">
          <div className="flex items-center gap-4 mb-4">
            <div className="p-3 bg-blue-50 text-blue-600 rounded-lg">
              <Activity size={24} />
            </div>
            <div>
              <h3 className="font-bold text-slate-800">Sistem Durumu</h3>
              <p className="text-xs text-slate-500">Gerçek Zamanlı İzleme</p>
            </div>
          </div>
          <p className="text-slate-600 text-sm">
             Endüstriyel sahalardan alınan verileri anlık olarak işleyip görselleştiren sistemler.
          </p>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-xl shadow-slate-200/50 border border-slate-100 transform -rotate-1 hover:rotate-0 transition-transform duration-300">
          <div className="flex items-center gap-4 mb-4">
             <div className="p-3 bg-indigo-50 text-indigo-600 rounded-lg">
               <Cpu size={24} />
             </div>
             <div>
               <h3 className="font-bold text-slate-800">Ana Uzmanlık</h3>
               <p className="text-xs text-slate-500">PLC & Web Entegrasyonu</p>
             </div>
          </div>
          <p className="text-slate-600 text-sm">
             Siemens S7 serisi PLC'ler ile React tabanlı modern web arayüzlerini birbirine bağlıyorum.
          </p>
        </div>
      </div>
    </div>
  );
}
