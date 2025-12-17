import React, { useState } from "react";
import { NavLink, Link } from "react-router-dom";
import { Terminal, Home, Cpu, Briefcase, Mail, Grid, X, Globe } from "lucide-react";
import { useLanguage } from "../context/LanguageContext";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const { language, setLanguage, t } = useLanguage();

  const navItems = [
    { id: "home", label: t("navbar.home"), path: "/", icon: Home },
    { id: "simulation", label: t("navbar.simulation"), path: "/simulation", icon: Grid },
    { id: "ai_tools", label: t("navbar.ai_tools"), path: "/ai-tools", icon: Terminal },
    { id: "projects", label: t("navbar.projects"), path: "/projects", icon: Briefcase },
    { id: "skills", label: t("navbar.skills"), path: "/skills", icon: Cpu },
    { id: "contact", label: t("navbar.contact"), path: "/contact", icon: Mail },
  ];

  const langs = [
    { code: 'tr', label: 'TR' },
    { code: 'en', label: 'EN' },
    { code: 'de', label: 'DE' },
    { code: 'fr', label: 'FR' },
  ];

  return (
    <div className="fixed top-0 left-0 right-0 z-navbar flex justify-center w-full bg-matte-dark/95 border-b border-matte-border/50 shadow-sm backdrop-blur-sm pointer-events-auto">
      <nav className="max-w-7xl w-full px-4 h-16 flex items-center justify-between">

        {/* Logo Area */}
        <Link
          to="/"
          className="flex items-center gap-3 group"
        >
          <div className="w-9 h-9 rounded-lg bg-indigo-500/20 flex items-center justify-center border border-indigo-500/30 group-hover:bg-indigo-500/30 transition-colors">
            <span className="font-mono font-bold text-pastel-purple">YA</span>
          </div>
          <span className="font-bold text-lg text-slate-200 tracking-wide group-hover:text-white transition-colors">
            Yagser.dev
          </span>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center gap-1">
          {navItems.map((item) => (
            <NavLink
              key={item.id}
              to={item.path}
              className={({ isActive }) => `
                flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300
                ${isActive
                  ? "bg-matte-card text-pastel-blue shadow-sm border border-slate-700/50"
                  : "text-slate-400 hover:text-slate-100 hover:bg-white/5"
                }
                `}
            >
              <item.icon size={18} />
              <span>{item.label}</span>
            </NavLink>
          ))}

          {/* Language Switcher (Desktop) */}
          <div className="h-6 w-px bg-slate-700/50 mx-2" />
          <div className="flex items-center gap-1">
            {langs.map((l) => (
              <button
                key={l.code}
                onClick={() => setLanguage(l.code)}
                className={`text-[10px] font-bold px-1.5 py-1 rounded transition-colors
                  ${language === l.code ? 'bg-indigo-500/20 text-indigo-300' : 'text-slate-500 hover:text-slate-300'}
                `}
              >
                {l.label}
              </button>
            ))}
          </div>
        </div>

        {/* Mobile Menu Button */}
        <div className="md:hidden flex items-center gap-3">
          {/* Mobile Language Toggle (Simple Cycle) */}
          <button
            onClick={() => {
              const idx = langs.findIndex(l => l.code === language);
              const next = langs[(idx + 1) % langs.length];
              setLanguage(next.code);
            }}
            className="text-xs font-mono text-slate-400 border border-slate-700 rounded px-2 py-1"
          >
            {language.toUpperCase()}
          </button>

          <button
            onClick={() => setIsOpen(!isOpen)}
            className="text-slate-400 hover:text-white p-2 border border-slate-700 rounded-lg hover:bg-slate-800 transition-colors"
          >
            {isOpen ? <X size={24} /> : <Grid size={24} />}
          </button>
        </div>
      </nav>

      {/* Mobile Dropdown Menu */}
      {isOpen && (
        <div className="md:hidden absolute top-16 left-0 right-0 bg-matte-dark/95 border-b border-matte-border/50 backdrop-blur-xl p-4 flex flex-col gap-2 shadow-2xl pointer-events-auto">
          {navItems.map((item) => (
            <NavLink
              key={item.id}
              to={item.path}
              onClick={() => setIsOpen(false)}
              className={({ isActive }) => `
                flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all duration-200
                ${isActive
                  ? "bg-matte-card text-pastel-blue border border-slate-700/50"
                  : "text-slate-400 hover:text-slate-100 hover:bg-white/5"
                }
              `}
            >
              <item.icon size={20} />
              <span>{item.label}</span>
            </NavLink>
          ))}
        </div>
      )}
    </div>
  );
}
