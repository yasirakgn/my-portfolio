import React from "react";
import { NavLink, Link } from "react-router-dom";
import { Terminal, Home, Cpu, Briefcase, Mail, Grid } from "lucide-react";

export default function Navbar() {
  const navItems = [
    { id: "home", label: "Ana Panel", path: "/", icon: Home },
    { id: "simulation", label: "Simülasyon", path: "/simulation", icon: Grid },
    { id: "ai_tools", label: "AI Terminal", path: "/ai-tools", icon: Terminal },
    { id: "projects", label: "Projeler", path: "/projects", icon: Briefcase },
    { id: "skills", label: "Yetenekler", path: "/skills", icon: Cpu },
    { id: "contact", label: "İletişim", path: "/contact", icon: Mail },
  ];

  return (
    <div className="fixed top-0 left-0 right-0 z-navbar flex justify-center w-full bg-matte-dark/95 border-b border-matte-border/50 shadow-sm backdrop-blur-sm">
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
        </div>

        {/* Mobile Menu Button (Placeholder) */}
        <div className="md:hidden">
          <button className="text-slate-400 hover:text-white p-2 border border-slate-700 rounded-lg hover:bg-slate-800 transition-colors">
            <Grid size={24} />
          </button>
        </div>

      </nav>
    </div>
  );
}
