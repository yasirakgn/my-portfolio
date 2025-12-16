import React from "react";
import { useNavigate } from "react-router-dom";
import { Play, Bot, MapPin, Activity, Cpu, ArrowRight, Database, Wifi } from "lucide-react";

export default function DashboardHome() {
  const navigate = useNavigate();

  return (
    <div className="max-w-screen-2xl mx-auto flex flex-col lg:flex-row gap-clamp-gap pt-clamp-header pb-clamp-section px-6 items-center">

      {/* Sol Taraf: Profil & Hero */}
      <div className="lg:w-1/2 space-y-8 text-center lg:text-left">

        <div className="space-y-4">
          <div className="inline-block px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-pastel-blue text-xs font-bold tracking-widest uppercase">
            Saha Tecrübeli Software & Automation Engineer
          </div>

          <h1 className="text-fluid-h1 font-bold text-white tracking-tight leading-tight">
            ENDÜSTRİYEL <br />
            <span className="text-gradient-pastel">OTOMASYON & YAZILIM.</span>
          </h1>

          <p className="text-fluid-body text-slate-400 leading-relaxed max-w-2xl mx-auto lg:mx-0 font-light">
            <strong>PLC/SCADA</strong> sistemleri ve <strong>Fonksiyonel Güvenlik (SIL)</strong> standartlarını, modern <strong>Web Teknolojileri</strong> ile birleştiriyorum.
            Sadece kod yazmıyor; <strong>Sistem Tasarımı</strong>, <strong>Commissioning</strong> ve <strong>Validasyon</strong> süreçlerini uçtan uca yönetiyorum.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
          <button
            onClick={() => navigate("/simulation")}
            className="px-8 py-4 bg-pastel-blue/10 hover:bg-pastel-blue/20 text-pastel-blue font-bold rounded-xl border border-pastel-blue/30 transition-all flex items-center justify-center gap-3 hover:-translate-y-1"
          >
            <Play className="w-5 h-5 fill-current" />
            <span>LIVE DIGITAL TWIN</span>
          </button>

          <button
            onClick={() => navigate("/ai-tools")}
            className="px-8 py-4 bg-matte-card hover:bg-slate-700 text-slate-300 font-bold rounded-xl border border-slate-700 hover:border-slate-600 transition-all flex items-center justify-center gap-3"
          >
            <Bot className="w-5 h-5 text-pastel-purple" />
            <span>AI MÜHENDİSİ</span>
          </button>
        </div>

        <div className="flex items-center justify-center lg:justify-start gap-8 text-slate-500 text-sm font-medium pt-4">
          <div className="flex items-center gap-2">
            <MapPin className="w-4 h-4 text-pastel-red" /> GLOBAL / REMOTE
          </div>
          <div className="flex items-center gap-2 text-pastel-green">
            <Wifi className="w-4 h-4" /> COMMISSIONING READY
          </div>
        </div>
      </div>

      {/* Sağ Taraf: Kartlar (Matte & Pastel) */}
      <div className="lg:w-1/2 grid gap-clamp-card">

        {/* Card 1 */}
        <div className="card-matte p-clamp-card card-hover-soft group">
          <div className="flex justify-between items-start mb-3">
            <div className="p-2 bg-pastel-blue/10 rounded-lg text-pastel-blue">
              <Activity size={24} />
            </div>
            <ArrowRight className="text-slate-600 group-hover:text-pastel-blue transition-colors" />
          </div>
          <h3 className="text-xl font-bold text-slate-200 mb-1 group-hover:text-white transition-colors">Mission Critical SCADA</h3>
          <p className="text-slate-400 text-sm">
            7/24 kesintisiz çalışan, yedekli (redundant) ve güvenli izleme sistemleri mimarisi.
          </p>
        </div>

        {/* Card 2 */}
        <div className="card-matte p-clamp-card card-hover-soft group">
          <div className="flex justify-between items-start mb-3">
            <div className="p-2 bg-pastel-purple/10 rounded-lg text-pastel-purple">
              <Cpu size={24} />
            </div>
            <ArrowRight className="text-slate-600 group-hover:text-pastel-purple transition-colors" />
          </div>
          <h3 className="text-xl font-bold text-slate-200 mb-1 group-hover:text-white transition-colors">PLC & Fieldbus Entegrasyonu</h3>
          <p className="text-slate-400 text-sm">
            Siemens S7, Beckhoff TwinCAT, Modbus TCP/IP ve Profinet ağ topolojileri.
          </p>
        </div>

        {/* Card 3 */}
        <div className="card-matte p-clamp-card card-hover-soft group">
          <div className="flex justify-between items-start mb-3">
            <div className="p-2 bg-pastel-green/10 rounded-lg text-pastel-green">
              <Database size={24} />
            </div>
            <ArrowRight className="text-slate-600 group-hover:text-pastel-green transition-colors" />
          </div>
          <h3 className="text-xl font-bold text-slate-200 mb-1 group-hover:text-white transition-colors">OEE & Validasyon</h3>
          <p className="text-slate-400 text-sm">
            Veriye dayalı üretim optimizasyonu ve GAMP5 standartlarında validasyon süreçleri.
          </p>
        </div>

      </div>
    </div>
  );
}
