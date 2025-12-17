import React, { lazy, Suspense } from "react";
import { useNavigate } from "react-router-dom";
import BentoCard from "./ui/BentoCard";
import { useLanguage } from "../context/LanguageContext";
import {
  Cpu,
  Bot,
  Terminal,
  Code,
  Zap,
  Globe,
  Database,
  ArrowUpRight
} from "lucide-react";

// Lazy load heavy simulation to keep initial render fast
const SimulationCanvas = lazy(() => import("./SimulationCanvas"));

export default function DashboardHome() {
  const navigate = useNavigate();
  const { t } = useLanguage();

  return (
    <div className="max-w-screen-2xl mx-auto p-6">

      {/* Header / Intro */}
      <div className="mb-10 mt-2">
        <h1 className="text-3xl font-bold text-white tracking-tight leading-relaxed">
          {t("dashboard.title")} <span className="text-slate-500 text-lg font-normal ml-2 align-middle">v3.1</span>
        </h1>
        <p className="text-slate-400 text-sm mt-1">{t("dashboard.status")}</p>
      </div>

      {/* BENTO GRID LAYOUT */}
      <div className="grid grid-cols-1 md:grid-cols-4 auto-rows-[180px] gap-6">

        {/* 1. HERO: Simulation (2x2) */}
        <BentoCard
          className="col-span-1 md:col-span-2 row-span-2 group/sim relative overflow-hidden"
          title={t("dashboard.card.sim.title")}
          icon={Cpu}
        >
          <div className="absolute inset-0 z-0 opacity-40 group-hover/sim:opacity-60 transition-opacity">
            <Suspense fallback={<div className="w-full h-full bg-slate-900 animate-pulse" />}>
              <SimulationCanvas isPreview={true} />
            </Suspense>
          </div>
          <div className="relative z-10 h-full flex flex-col justify-end pointer-events-none">
            <p className="text-slate-300 max-w-sm drop-shadow-md">
              {t("dashboard.card.sim.desc")}
            </p>
            <button
              onClick={() => navigate("/simulation")}
              className="mt-4 w-max pointer-events-auto flex items-center gap-2 px-4 py-2 bg-pastel-blue/20 hover:bg-pastel-blue/30 text-pastel-blue border border-pastel-blue/50 rounded-lg backdrop-blur-md transition-all text-sm font-bold"
            >
              {t("dashboard.card.sim.btn")} <ArrowUpRight size={16} />
            </button>
          </div>
        </BentoCard>

        {/* 2. AI Assistant (2x1) */}
        <BentoCard
          className="col-span-1 md:col-span-2 row-span-1"
          title={t("dashboard.card.ai.title")}
          icon={Bot}
          delay={0.1}
        >
          <div className="flex h-full items-center justify-between gap-6">
            <div className="space-y-2">
              <h4 className="text-2xl font-bold text-white">{t("dashboard.card.ai.subtitle")}</h4>
              <p className="text-slate-400 text-sm">{t("dashboard.card.ai.desc")}</p>
            </div>
            <button
              onClick={() => navigate("/ai-tools")}
              className="h-12 w-12 flex items-center justify-center rounded-full bg-matte-card border border-white/10 hover:bg-pastel-purple/20 hover:border-pastel-purple hover:text-pastel-purple transition-all"
            >
              <Terminal size={20} />
            </button>
          </div>
        </BentoCard>

        {/* 3. Tech Stack (1x2) */}
        <BentoCard
          className="col-span-1 row-span-2"
          title={t("dashboard.card.stack.title")}
          icon={Code}
          delay={0.2}
        >
          <div className="space-y-4">
            <StackItem label="React 19" value="Core" color="bg-blue-500" />
            <StackItem label="Vite" value="Build" color="bg-purple-500" />
            <StackItem label="Tailwind" value="UI" color="bg-cyan-500" />
            <div className="h-px bg-white/10 my-4" />
            <StackItem label="Siemens" value="PLC" color="bg-green-500" />
            <StackItem label="Beckhoff" value="Motion" color="bg-red-500" />
          </div>
        </BentoCard>

        {/* 4. Projects (1x1) */}
        <BentoCard
          className="col-span-1 row-span-1"
          title={t("dashboard.card.projects.title")}
          icon={Database}
          delay={0.3}
        >
          <div
            onClick={() => navigate("/projects")}
            className="h-full flex flex-col justify-center cursor-pointer group/proj"
          >
            <h4 className="text-3xl font-bold text-slate-200 group-hover/proj:text-white">3</h4>
            <p className="text-slate-400 text-xs uppercase tracking-widest mt-1">{t("dashboard.card.projects.desc")}</p>
          </div>
        </BentoCard>

        {/* 5. Contact (1x1) */}
        <BentoCard
          className="col-span-1 row-span-1 bg-gradient-to-br from-indigo-900/40 to-matte-dark"
          title={t("dashboard.card.contact.title")}
          icon={Globe}
          delay={0.4}
        >
          <div
            onClick={() => navigate("/contact")}
            className="h-full flex items-center gap-3 cursor-pointer"
          >
            <div className="relative">
              <div className="w-3 h-3 bg-green-500 rounded-full" />
              <div className="absolute inset-0 bg-green-500 rounded-full animate-ping opacity-75" />
            </div>
            <div>
              <p className="text-white font-bold">{t("dashboard.card.contact.status")}</p>
              <p className="text-xs text-slate-400">{t("dashboard.card.contact.location")}</p>
            </div>
          </div>
        </BentoCard>

      </div>
    </div>
  );
}

// Mini Component for Stack List
function StackItem({ label, value, color }) {
  return (
    <div className="flex items-center justify-between text-sm">
      <span className="text-slate-300">{label}</span>
      <div className="flex items-center gap-2">
        <span className="text-slate-500 text-xs">{value}</span>
        <div className={`w-1.5 h-1.5 rounded-full ${color}`} />
      </div>
    </div>
  );
}
