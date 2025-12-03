import React from "react";
import { Gauge, Code as CodeIcon, CheckCircle2 } from "lucide-react";

export default function Skills() {
  return (
    <div className="max-w-5xl mx-auto py-8">
      <div className="text-center mb-12">
        <h2 className="text-3xl font-extrabold text-slate-800 mb-2">Teknik Yetkinlikler</h2>
        <p className="text-slate-500">Projelerimde kullandığım teknolojiler ve uzmanlık seviyelerim.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">

        {/* Otomasyon Kartı */}
        <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100 hover:shadow-xl transition-shadow relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-8 opacity-5 transform group-hover:scale-110 transition-transform duration-500">
            <Gauge size={180} />
          </div>

          <div className="relative z-10">
            <div className="w-12 h-12 bg-orange-100 text-orange-600 rounded-xl flex items-center justify-center mb-6">
               <Gauge size={24} />
            </div>
            <h3 className="text-xl font-bold text-slate-800 mb-6">Endüstriyel Otomasyon</h3>

            <ul className="space-y-6">
              {[
                { name: 'Siemens TIA Portal (S7-1200/1500)', lvl: 95 },
                { name: 'SCADA & HMI Tasarımı (WinCC)', lvl: 90 },
                { name: 'Endüstriyel Haberleşme (Profinet/Modbus)', lvl: 85 },
                { name: 'Hareket Kontrol (Servo/Motion)', lvl: 80 }
              ].map(skill => (
                <li key={skill.name}>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-slate-700 font-medium flex items-center gap-2">
                      <CheckCircle2 size={16} className="text-orange-500" />
                      {skill.name}
                    </span>
                    <span className="text-sm font-bold text-orange-500">{skill.lvl}%</span>
                  </div>
                  <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-orange-500 rounded-full transition-all duration-1000 ease-out"
                      style={{ width: `${skill.lvl}%` }}
                    ></div>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Yazılım Kartı */}
        <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100 hover:shadow-xl transition-shadow relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-8 opacity-5 transform group-hover:scale-110 transition-transform duration-500">
            <CodeIcon size={180} />
          </div>

          <div className="relative z-10">
             <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-xl flex items-center justify-center mb-6">
               <CodeIcon size={24} />
             </div>
             <h3 className="text-xl font-bold text-slate-800 mb-6">Yazılım Geliştirme</h3>

             <ul className="space-y-6">
              {[
                { name: 'React.js & Modern Frontend', lvl: 85 },
                { name: 'JavaScript (ES6+) / TypeScript', lvl: 80 },
                { name: 'C# / .NET Core', lvl: 75 },
                { name: 'SQL / Veritabanı Yönetimi', lvl: 70 }
              ].map(skill => (
                <li key={skill.name}>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-slate-700 font-medium flex items-center gap-2">
                      <CheckCircle2 size={16} className="text-blue-500" />
                      {skill.name}
                    </span>
                    <span className="text-sm font-bold text-blue-500">{skill.lvl}%</span>
                  </div>
                  <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-blue-500 rounded-full transition-all duration-1000 ease-out"
                      style={{ width: `${skill.lvl}%` }}
                    ></div>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>

      </div>
    </div>
  );
}
