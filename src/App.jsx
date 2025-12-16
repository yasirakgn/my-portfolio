import React, { Suspense, lazy, useEffect } from "react";
import { Routes, Route, useLocation, Navigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import Navbar from "./components/Navbar";
import AmbientGlow from "./components/AmbientGlow";

// Lazy Component Imports
const DashboardHome = lazy(() => import("./components/DashboardHome"));
const SimulationPage = lazy(() => import("./components/SimulationPage"));
const ContactForm = lazy(() => import("./components/ContactForm"));
const AiTerminal = lazy(() => import("./components/AiTerminal"));
const Projects = lazy(() => import("./components/Projects"));
const Skills = lazy(() => import("./components/Skills"));

// --- Loading Component ---
const LoadingCallback = () => (
  <div className="flex items-center justify-center h-[50vh] text-slate-400 animate-pulse">
    Loading...
  </div>
);

// --- Page Transition Wrapper ---
const PageWrapper = ({ children, title }) => {
  useEffect(() => {
    if (title) {
      document.title = `${title} | Yagser Akgun`;
    }
  }, [title]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -15 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
      className="w-full h-full"
    >
      {children}
    </motion.div>
  );
};

// --- MAIN APP ---
export default function App() {
  const location = useLocation();

  return (
    <div className="min-h-screen font-sans flex flex-col relative overflow-hidden text-slate-100">
      {/* Background is handled by index.css body style now */}
      <AmbientGlow />

      <div className="relative z-10 flex-grow flex flex-col">
        <Navbar />

        <main className="flex-grow container mx-auto px-4 pb-12 pt-24">
          <Suspense fallback={<LoadingCallback />}>
            <AnimatePresence mode="wait">
              <Routes location={location} key={location.pathname}>
                <Route
                  path="/"
                  element={
                    <PageWrapper title="Ana Sayfa">
                      <DashboardHome />
                    </PageWrapper>
                  }
                />
                <Route
                  path="/simulation"
                  element={
                    <PageWrapper title="Simülasyon">
                      <SimulationPage />
                    </PageWrapper>
                  }
                />
                <Route
                  path="/ai-tools"
                  element={
                    <PageWrapper title="Yagser AI">
                      <AiTerminal />
                    </PageWrapper>
                  }
                />
                <Route
                  path="/projects"
                  element={
                    <PageWrapper title="Projeler">
                      <Projects />
                    </PageWrapper>
                  }
                />
                <Route
                  path="/skills"
                  element={
                    <PageWrapper title="Yetenekler">
                      <Skills />
                    </PageWrapper>
                  }
                />
                <Route
                  path="/contact"
                  element={
                    <PageWrapper title="İletişim">
                      <ContactForm />
                    </PageWrapper>
                  }
                />
                {/* Fallback to Home */}
                <Route path="*" element={<Navigate to="/" replace />} />
              </Routes>
            </AnimatePresence>
          </Suspense>
        </main>

        {/* Minimal Footer */}
        <footer className="w-full text-center py-6 text-sm text-slate-400">
          <p>© 2025 Yagser Akgun. All rights reserved.</p>
        </footer>
      </div>
    </div>
  );
}
