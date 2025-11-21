import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Navbar from "./components/Navbar";
import SimulationPage from "./components/SimulationPage";
import ContactForm from "./components/ContactForm";
import AiTerminal from "./components/AiTerminal";
import { 
  Briefcase, Cpu, Activity, Play, Terminal, 
  Server, Database, Gauge, Bot, Sparkles, Code as CodeIcon
} from "lucide-react";

// --- DASHBOARD & HOME COMPONENTS (Inline for Simplicity) ---

const DashboardHome = ({ setPage }) => (
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

const Projects = () => (
  <div className="max-w-6xl mx-auto">
    <h2 className="text-2xl font-bold text-cyan-400 mb-6 flex items-center font-mono border-b border-gray-700 pb-2">
      <Briefcase className="mr-3" /> AKTİF PROJE MODÜLLERİ
    </h2>
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {[
        { id: 1, title: "SCADA Su Arıtma", type: "PLC + HMI", desc: "Siemens S7-1200 ile tam otomatik su arıtma tesisi kontrolü ve WinCC arayüzü." },
        { id: 2, title: "React Dashboard", type: "Web App", desc: "Endüstriyel verilerin gerçek zamanlı izlendiği, MQTT tabanlı web paneli." },
        { id: 3, title: "Servo Motor Kontrol", type: "Motion", desc: "Çok eksenli servo motorların senkronizasyonu ve pozisyonlama yazılımı." },
        { id: 4, title: "Veri Toplama (IoT)", type: "IoT + Cloud", desc: "Saha sensörlerinden toplanan verilerin Azure bulut sistemine aktarımı." },
        { id: 5, title: "Depo Otomasyonu", type: "Lojistik", desc: "Otomatik yönlendirmeli araçlar (AGV) için trafik yönetim algoritması." },
        { id: 6, title: "Enerji İzleme", type: "Analiz", desc: "Fabrika genelindeki enerji tüketiminin analizi ve raporlanması." }
      ].map((p) => (
        <div key={p.id} className="group bg-gray-800 border border-gray-700 rounded-lg overflow-hidden hover:border-cyan-500 transition-all duration-300 hover:shadow-[0_0_20px_rgba(6,182,212,0.15)] flex flex-col">
          <div className="h-32 bg-gray-700/30 flex items-center justify-center border-b border-gray-700 group-hover:bg-gray-700/50 transition-colors relative">
            <Terminal className="w-12 h-12 text-gray-500 group-hover:text-cyan-400 transition-colors" />
            <span className="absolute top-2 right-2 text-[10px] font-mono bg-black/50 px-2 py-1 rounded text-gray-400 border border-gray-600">ID: {p.id.toString().padStart(3, '0')}</span>
          </div>
          <div className="p-5 flex-grow flex flex-col">
            <h3 className="text-lg font-bold text-white mb-2 group-hover:text-cyan-300 font-mono">{p.title}</h3>
            <p className="text-gray-400 text-sm mb-4 flex-grow leading-relaxed">
              {p.desc}
            </p>
            <div className="flex items-center justify-between mt-auto pt-4 border-t border-gray-700/50">
              <span className="text-xs font-bold text-cyan-600 bg-cyan-900/20 px-2 py-1 rounded border border-cyan-900/30">{p.type}</span>
              <button className="text-xs text-gray-400 hover:text-white flex items-center gap-1 transition-colors">
                Detaylar <div className="w-1 h-1 bg-gray-400 rounded-full"></div>
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  </div>
);

const Skills = () => (
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

// --- MAIN APP ---

export default function App() {
  const [page, setPage] = useState("home");
  const [log, setLog] = useState("System Initialized. Welcome User.");

  useEffect(() => {
    const time = new Date().toLocaleTimeString('tr-TR');
    setLog(`[${time}] Navigation Event: Module changed to ${page.toUpperCase()}`);
  }, [page]);

  return (
    <div className="bg-gray-900 text-gray-100 min-h-screen font-sans selection:bg-cyan-500 selection:text-white flex flex-col relative overflow-hidden">
      
      {/* Arka Plan Efekti (Grid + Scanline) */}
      <div className="fixed inset-0 z-0 opacity-10 pointer-events-none" 
           style={{backgroundImage: 'linear-gradient(#374151 1px, transparent 1px), linear-gradient(90deg, #374151 1px, transparent 1px)', backgroundSize: '40px 40px'}}>
      </div>
      <div className="scanline"></div>

      <div className="relative z-10 flex-grow flex flex-col">
        <Navbar setPage={setPage} currentPage={page} />
        
        <main className="flex-grow container mx-auto px-4 pb-24">
          <AnimatePresence mode="wait">
            <motion.div
              key={page}
              initial={{ opacity: 0, y: 10, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -10, scale: 0.98 }}
              transition={{ duration: 0.2 }}
              className="w-full h-full"
            >
              {page === "home" && <DashboardHome setPage={setPage} />}
              {page === "simulation" && <SimulationPage />}
              {page === "ai_tools" && <AiTerminal />}
              {page === "projects" && <Projects />}
              {page === "skills" && <Skills />}
              {page === "contact" && <ContactForm />}
            </motion.div>
          </AnimatePresence>
        </main>

        {/* Event Log Footer */}
        <footer className="fixed bottom-0 left-0 w-full bg-black/90 border-t-2 border-gray-800 text-[10px] md:text-xs font-mono p-2 flex justify-between items-center text-gray-400 backdrop-blur-sm z-50 shadow-[0_-5px_20px_rgba(0,0,0,0.5)]">
          <div className="flex items-center gap-4 pl-2">
            <span className="text-green-500 flex items-center gap-2 font-bold">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse shadow-[0_0_5px_#22c55e]"></div> 
              SYSTEM ONLINE
            </span>
            <span className="hidden md:inline opacity-50">| CPU: 12% | MEM: 3.4GB | NET: 1Gbps |</span>
          </div>
          <div className="text-cyan-500 font-bold pr-4 animate-pulse">
            {`>> ${log}_`}
          </div>
        </footer>
      </div>
    </div>
  );
}