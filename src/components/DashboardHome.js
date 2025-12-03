import React from "react";
import {
  Play, Terminal, Activity, Cpu, Database, Bot, Sparkles
} from "lucide-react";

export default function DashboardHome({ setPage }) {
  return (
    <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8 pt-4">
      {/* Sol Taraf: Profil & Boot Log */}
      <div className="lg:col-span-7 space-y-8">
        <div className="bg-gray-800/50 border-l-4 border-cyan-500 p-8 rounded-r-xl shadow-lg backdrop-blur-sm relative overflow-hidden">
          <div className="absolute top-0 right-0 p-4 opacity-10">
            <Terminal size={120} />
          </div>
          <h1 className="text-4xl md:text-6xl font-black text-white mb-4 font-mono tracking-tighter">
            <span className="text-cyan-400 animate-pulse">{`>>`}</span> YAGSER AKGÜN
          </h1>
          <p className="text-xl text-gray-300 font-light tracking-wide mb-8 border-b border-gray-700 pb-4 inline-block">
            Automation & Software Engineer
          </p>

          {/* Fake Boot Sequence */}
          <div className="font-mono text-xs md:text-sm text-green-400 bg-black/80 p-4 rounded border border-gray-700 mb-8 shadow-inner font-bold h-48 overflow-y-auto">
            <p className="mb-1"><span className="text-gray-500">[SYSTEM]</span> Initializing YAGSER_OS kernel...</p>
            <p className="mb-1"><span className="text-gray-500">[OK]</span> Loading PLC modules (S7-1200, S7-1500)</p>
            <p className="mb-1"><span className="text-gray-500">[OK]</span> Mounting SCADA interface...</p>
            <p className="mb-1"><span className="text-gray-500">[OK]</span> Connecting to React.js frontend...</p>
            <p className="mb-1"><span className="text-gray-500">[OK]</span> Establishing database connection...</p>
            <p className="mb-1"><span className="text-gray-500">[INFO]</span> User detected. Access granted.</p>
            <p className="animate-pulse mt-2 text-cyan-300">{`> Ready for input_`}</p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4">
            <button
              onClick={() => setPage('simulation')}
              className="flex-1 bg-cyan-700 hover:bg-cyan-600 text-white font-bold py-4 px-6 rounded shadow-[0_0_15px_rgba(8,145,178,0.5)] transition-all flex items-center justify-center gap-2 group"
            >
              <Play className="w-5 h-5 group-hover:rotate-90 transition-transform" />
              SİMÜLASYONU BAŞLAT
            </button>
            <button
              onClick={() => setPage('ai_tools')}
              className="flex-1 bg-purple-700 hover:bg-purple-600 text-white font-bold py-4 px-6 rounded shadow-[0_0_15px_rgba(147,51,234,0.5)] transition-all flex items-center justify-center gap-2 group border border-purple-500"
            >
              <Bot className="w-5 h-5" />
              AI ASİSTANI'NI DENE
              <Sparkles className="w-4 h-4 text-yellow-300 group-hover:animate-ping" />
            </button>
          </div>
        </div>
      </div>

      {/* Sağ Taraf: Sistem Durumu */}
      <div className="lg:col-span-5 space-y-4">
        <div className="grid grid-cols-1 gap-4">
          <div className="bg-gray-800 p-5 rounded-lg border-t-4 border-green-500 shadow-md flex items-center justify-between">
            <div>
              <div className="text-xs text-gray-400 font-mono mb-1">OPERASYON DURUMU</div>
              <div className="text-2xl font-bold text-white flex items-center gap-2">
                ONLINE <div className="w-3 h-3 bg-green-500 rounded-full animate-ping"></div>
              </div>
            </div>
            <Activity className="text-green-500 opacity-50" size={32} />
          </div>

          <div className="bg-gray-800 p-5 rounded-lg border-t-4 border-blue-500 shadow-md flex items-center justify-between">
            <div>
              <div className="text-xs text-gray-400 font-mono mb-1">ANA UZMANLIK</div>
              <div className="text-xl font-bold text-white">PLC & WEB ENTEGRASYONU</div>
            </div>
            <Cpu className="text-blue-500 opacity-50" size={32} />
          </div>

          <div className="bg-gray-800 p-5 rounded-lg border-t-4 border-purple-500 shadow-md flex items-center justify-between">
            <div>
              <div className="text-xs text-gray-400 font-mono mb-1">AKTİF KONUM</div>
              <div className="text-xl font-bold text-white">İSTANBUL / TÜRKİYE</div>
            </div>
            <Database className="text-purple-500 opacity-50" size={32} />
          </div>
        </div>

        <div className="bg-gray-900 border border-gray-700 p-4 rounded text-xs font-mono text-gray-500">
          <p>Sistem Versiyonu: v2.5.0 (AI Updated)</p>
          <p>Son Güncelleme: 21.11.2025</p>
          <p>Uptime: 99.9%</p>
          <div className="w-full bg-gray-800 h-1 mt-2 rounded-full overflow-hidden">
            <div className="bg-gray-600 h-full w-[85%] animate-pulse"></div>
          </div>
        </div>
      </div>
    </div>
  );
}
