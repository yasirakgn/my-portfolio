import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Navbar from "./components/Navbar";
import SimulationPage from "./components/SimulationPage";
import ContactForm from "./components/ContactForm";
import AiTerminal from "./components/AiTerminal";
import DashboardHome from "./components/DashboardHome";
import Projects from "./components/Projects";
import Skills from "./components/Skills";

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
