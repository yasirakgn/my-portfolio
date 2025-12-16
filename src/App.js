import React, { useState } from "react";
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

  return (
    <div className="bg-slate-50 text-slate-800 min-h-screen font-sans flex flex-col relative overflow-hidden transition-colors duration-500">
      
      {/* Soft Background Gradient */}
      <div className="fixed inset-0 z-0 bg-gradient-to-br from-indigo-50 via-white to-purple-50 pointer-events-none"></div>

      <div className="relative z-10 flex-grow flex flex-col">
        <Navbar setPage={setPage} currentPage={page} />
        
        <main className="flex-grow container mx-auto px-4 pb-12 pt-4">
          <AnimatePresence mode="wait">
            <motion.div
              key={page}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.3, ease: "easeOut" }}
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

        {/* Minimal Footer */}
        <footer className="w-full text-center py-6 text-sm text-slate-400">
          <p>© 2025 Yagser Akgun. All rights reserved.</p>
        </footer>
      </div>
    </div>
  );
}
