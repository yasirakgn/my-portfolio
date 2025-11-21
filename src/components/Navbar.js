import React from "react";
import { Home, Briefcase, Cpu, Mail, Activity, Bot, Sparkles } from "lucide-react";

export default function Navbar({ setPage, currentPage }) {
  const menuItems = [
    { id: "home", label: "SİSTEM ÖZETİ", icon: Home },
    { id: "simulation", label: "CANLI SİMÜLASYON", icon: Activity },
    { id: "ai_tools", label: "YAGSER_AI", icon: Bot, highlight: true },
    { id: "projects", label: "PROJE MODÜLLERİ", icon: Briefcase },
    { id: "skills", label: "TEKNİK VERİLER", icon: Cpu },
    { id: "contact", label: "İLETİŞİM AĞI", icon: Mail },
  ];

  return (
    <div className="sticky top-0 z-40 mb-6">
      {/* Üst Dekoratif Çizgi */}
      <div className="h-1 w-full bg-gradient-to-r from-cyan-900 via-cyan-500 to-cyan-900 animate-pulse shadow-[0_0_10px_rgba(6,182,212,0.8)]"></div>
      
      <nav className="bg-gray-900/95 backdrop-blur-md border-b border-gray-700 shadow-2xl p-3">
        <div className="container mx-auto flex flex-wrap justify-between items-center gap-4">
          {/* Logo / Marka Alanı */}
          <div className="flex items-center gap-3 text-cyan-400 font-mono font-bold text-lg tracking-wider border border-cyan-500/30 px-4 py-2 rounded bg-cyan-900/10 relative overflow-hidden group cursor-default select-none">
            <div className="absolute inset-0 bg-cyan-500/10 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000"></div>
            <div className="flex items-center relative">
              <span className="relative flex h-3 w-3 mr-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
              </span>
              YAGSER_OS v1.0
            </div>
          </div>

          {/* Menü Butonları */}
          <div className="flex flex-wrap justify-center gap-2">
            {menuItems.map((item) => {
              const Icon = item.icon;
              const isActive = currentPage === item.id;
              const isHighlight = item.highlight;
              
              return (
                <button
                  key={item.id}
                  onClick={() => setPage(item.id)}
                  className={`flex items-center gap-2 px-3 py-2 rounded-sm font-mono text-xs md:text-sm font-bold transition-all duration-200 border relative overflow-hidden
                    ${isActive 
                      ? 'bg-cyan-950 text-cyan-300 border-cyan-500 shadow-[0_0_15px_rgba(6,182,212,0.2)]' 
                      : isHighlight 
                        ? 'bg-purple-900/30 text-purple-300 border-purple-500/50 hover:bg-purple-900/50 hover:border-purple-400 hover:text-white'
                        : 'bg-gray-800 text-gray-400 border-gray-700 hover:bg-gray-750 hover:text-gray-200 hover:border-gray-500'
                    }`}
                >
                  {isActive && <div className="absolute left-0 top-0 bottom-0 w-1 bg-cyan-500"></div>}
                  <Icon size={16} className={isActive ? "animate-pulse" : isHighlight ? "text-purple-400" : ""} />
                  {item.label}
                  {isHighlight && <Sparkles size={12} className="absolute top-1 right-1 text-yellow-400 animate-spin-slow" />}
                </button>
              );
            })}
          </div>
        </div>
      </nav>
    </div>
  );
}