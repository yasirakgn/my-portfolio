// src/App.js
import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import SimulationPage from "./components/SimulationPage";
import ContactForm from "./components/ContactForm";

function HomeTr() {
  return (
    <div className="bg-gray-900 text-gray-100 min-h-screen p-4 sm:p-6 font-sans">
      <Navbar />
      <div className="max-w-3xl mx-auto text-center mt-16">
        <h1 className="text-4xl font-bold mb-4">Yağser Akgün</h1>
        <h2 className="text-2xl mb-2">Otomasyon & Yazılım Mühendisi</h2>
        <p className="text-gray-300">
          Endüstriyel otomasyon, SCADA, PLC, HMI ve web tabanlı yazılım
          projelerinde uzmanlaşmış bir mühendisin kişisel portföyü.
        </p>
        <a
          href="/en"
          className="inline-block mt-6 px-4 py-2 bg-blue-600 rounded-lg hover:bg-blue-700 transition"
        >
          English Version →
        </a>
      </div>
    </div>
  );
}

function HomeEn() {
  return (
    <div className="bg-gray-900 text-gray-100 min-h-screen p-4 sm:p-6 font-sans">
      <Navbar />
      <div className="max-w-3xl mx-auto text-center mt-16">
        <h1 className="text-4xl font-bold mb-4">Yagser Akgun</h1>
        <h2 className="text-2xl mb-2">Automation & Software Engineer</h2>
        <p className="text-gray-300">
          Personal portfolio showcasing industrial automation, SCADA, PLC, HMI
          and web-based software projects.
        </p>
        <a
          href="/"
          className="inline-block mt-6 px-4 py-2 bg-blue-600 rounded-lg hover:bg-blue-700 transition"
        >
          ← Türkçe Versiyon
        </a>
      </div>
    </div>
  );
}

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomeTr />} />
        <Route path="/en" element={<HomeEn />} />
        <Route path="/contact" element={<ContactForm />} />
      </Routes>
    </Router>
  );
}
