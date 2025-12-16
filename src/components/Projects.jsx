import React from "react";
import { ArrowRight, Layers, Cpu, ShieldCheck } from "lucide-react";
import projectsData from "../constants/projects.json";

export default function Projects() {
  return (
    <div className="max-w-7xl mx-auto py-12 px-6">
      <div className="text-center mb-16">
        <h2 className="text-4xl font-extrabold text-slate-800 mb-4 tracking-tight">
          Tamamlanmış Endüstriyel Projeler
        </h2>
        <p className="text-lg text-slate-500 max-w-2xl mx-auto">
          Gerçek üretim sahalarında devreye alınmış (Commissioned), validasyon süreçlerinden geçmiş <strong>PLC, SCADA ve IIoT</strong> çözümleri.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {projectsData.map((p) => (
          <article
            key={p.id}
            className="group bg-white rounded-2xl shadow-sm hover:shadow-xl hover:shadow-blue-100/50 transition-all duration-300 border border-slate-100 flex flex-col overflow-hidden h-full"
            itemScope
            itemType="https://schema.org/CreativeWork"
          >
            {/* Header / Type Badge */}
            <div className="h-2 opacity-100 bg-gradient-to-r from-blue-500 to-indigo-600 w-full" />

            <div className="p-8 flex flex-col flex-grow">
              <header className="mb-6">
                <div className="flex justify-between items-start mb-3">
                  <span className="text-[11px] font-bold text-blue-600 bg-blue-50 px-3 py-1 rounded-full uppercase tracking-wider border border-blue-100">
                    {p.category}
                  </span>
                  {p.type.includes("Safety") ? <ShieldCheck size={20} className="text-green-500" /> : <Cpu size={20} className="text-slate-300" />}
                </div>

                <h3 className="text-xl font-bold text-slate-800 group-hover:text-blue-700 transition-colors leading-snug" itemProp="name">
                  {p.title}
                </h3>
              </header>

              <div className="space-y-4 mb-8 flex-grow">
                <p className="text-slate-600 text-sm leading-relaxed" itemProp="description">
                  {p.summary}
                </p>

                <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
                  <p className="text-xs text-slate-500 mb-2 font-semibold uppercase tracking-wide">Proje Özeti:</p>
                  <ul className="text-xs text-slate-600 space-y-2">
                    <li className="flex gap-2"><span className="font-bold text-slate-700 min-w-[60px]">Challenge:</span> {p.challenge}</li>
                    <li className="flex gap-2"><span className="font-bold text-slate-700 min-w-[60px]">Solution:</span> {p.solution}</li>
                    <li className="flex gap-2"><span className="font-bold text-green-600 min-w-[60px]">Impact:</span> {p.impact}</li>
                  </ul>
                </div>
              </div>

              <footer className="mt-auto">
                <div className="flex flex-wrap gap-2 mb-6">
                  {p.techStack.map(tech => (
                    <span key={tech} className="text-[10px] bg-slate-100 text-slate-600 px-2 py-1 rounded border border-slate-200 font-mono" itemProp="keywords">
                      {tech}
                    </span>
                  ))}
                </div>

                <button className="w-full py-3 text-sm font-bold text-white bg-slate-900 rounded-xl group-hover:bg-blue-600 transition-colors flex items-center justify-center gap-2">
                  Teknik Detayları İncele <ArrowRight size={16} />
                </button>
              </footer>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}
