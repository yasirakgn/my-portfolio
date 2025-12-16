import React from "react";
import { Home, Briefcase, Cpu, Mail, Activity, Bot, Sparkles } from "lucide-react";

export default function Navbar({ setPage, currentPage }) {
  const menuItems = [
    { id: "home", label: "Ana Sayfa", icon: Home },
    { id: "simulation", label: "Simülasyon", icon: Activity },
    { id: "ai_tools", label: "Yagser AI", icon: Bot, highlight: true },
    { id: "projects", label: "Projeler", icon: Briefcase },
    { id: "skills", label: "Yetenekler", icon: Cpu },
    { id: "contact", label: "İletişim", icon: Mail },
  ];

  return (
    <div className="sticky top-0 z-40 mb-2">
      <nav className="bg-white/80 backdrop-blur-xl border-b border-slate-200 shadow-sm p-4">
        <div className="container mx-auto flex flex-wrap justify-between items-center gap-4">

          {/* Logo */}
          <div
            onClick={() => setPage('home')}
            className="flex items-center gap-2 cursor-pointer group"
          >
            <div className="w-10 h-10 bg-blue-600 text-white flex items-center justify-center rounded-xl font-bold text-xl shadow-lg shadow-blue-200 group-hover:scale-105 transition-transform">
              Y
            </div>
            <span className="font-bold text-slate-800 text-lg tracking-tight">
              Yagser Akgün
            </span>
          </div>

          {/* Menü */}
          <div className="flex flex-wrap justify-center gap-1">
            {menuItems.map((item) => {
              const Icon = item.icon;
              const isActive = currentPage === item.id;
              const isHighlight = item.highlight;
              
              return (
                <button
                  key={item.id}
                  onClick={() => setPage(item.id)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all duration-200
                    ${isActive 
                      ? 'bg-slate-800 text-white shadow-md'
                      : isHighlight 
                        ? 'text-purple-600 bg-purple-50 hover:bg-purple-100'
                        : 'text-slate-500 hover:bg-slate-100 hover:text-slate-900'
                    }`}
                >
                  <Icon size={16} className={isHighlight ? "text-purple-600" : ""} />
                  {item.label}
                  {isHighlight && <Sparkles size={12} className="text-yellow-500" />}
                </button>
              );
            })}
          </div>
        </div>
      </nav>
    </div>
  );
}
