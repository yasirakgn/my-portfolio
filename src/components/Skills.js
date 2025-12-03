import React from "react";
import { Server, Gauge, Code as CodeIcon } from "lucide-react";

export default function Skills() {
  return (
    <div className="max-w-5xl mx-auto">
      <h2 className="text-2xl font-bold text-cyan-400 mb-6 flex items-center font-mono border-b border-gray-700 pb-2">
        <Server className="mr-3"/> SİSTEM PARAMETRELERİ (Yetenekler)
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="bg-gray-800/80 p-6 rounded-xl border border-gray-700 shadow-lg relative overflow-hidden">
          <div className="absolute -right-10 -top-10 text-gray-700 opacity-20 rotate-12">
            <Gauge size={150} />
          </div>
          <h3 className="text-lg font-bold text-white mb-6 flex items-center gap-2">
            <div className="w-2 h-6 bg-orange-500 rounded-sm"></div>
            ENDÜSTRİYEL OTOMASYON
          </h3>
          <ul className="space-y-5 relative z-10">
            {[
              { name: 'Siemens TIA Portal (S7-1200/1500)', lvl: 95 },
              { name: 'SCADA & HMI Tasarımı (WinCC)', lvl: 90 },
              { name: 'Endüstriyel Haberleşme (Profinet/Modbus)', lvl: 85 },
              { name: 'Hareket Kontrol (Servo/Motion)', lvl: 80 }
            ].map(skill => (
               <li key={skill.name}>
                 <div className="flex justify-between text-sm text-gray-300 mb-1 font-mono">
                   <span>{skill.name}</span>
                   <span className="text-orange-400">{skill.lvl}%</span>
                 </div>
                 <div className="w-full h-2 bg-gray-700 rounded-full overflow-hidden border border-gray-600">
                   <div className="h-full bg-gradient-to-r from-orange-600 to-orange-400 relative" style={{ width: `${skill.lvl}%` }}></div>
                 </div>
               </li>
            ))}
          </ul>
        </div>
        <div className="bg-gray-800/80 p-6 rounded-xl border border-gray-700 shadow-lg relative overflow-hidden">
          <div className="absolute -right-10 -top-10 text-gray-700 opacity-20 rotate-12">
            <CodeIcon size={150} />
          </div>
          <h3 className="text-lg font-bold text-white mb-6 flex items-center gap-2">
            <div className="w-2 h-6 bg-blue-500 rounded-sm"></div>
            YAZILIM GELİŞTİRME
          </h3>
          <ul className="space-y-5 relative z-10">
            {[
              { name: 'React.js & Modern Frontend', lvl: 85 },
              { name: 'JavaScript (ES6+) / TypeScript', lvl: 80 },
              { name: 'C# / .NET Core', lvl: 75 },
              { name: 'SQL / Veritabanı Yönetimi', lvl: 70 }
            ].map(skill => (
               <li key={skill.name}>
                 <div className="flex justify-between text-sm text-gray-300 mb-1 font-mono">
                   <span>{skill.name}</span>
                   <span className="text-blue-400">{skill.lvl}%</span>
                 </div>
                 <div className="w-full h-2 bg-gray-700 rounded-full overflow-hidden border border-gray-600">
                   <div className="h-full bg-gradient-to-r from-blue-600 to-blue-400 relative" style={{ width: `${skill.lvl}%` }}></div>
                 </div>
               </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
