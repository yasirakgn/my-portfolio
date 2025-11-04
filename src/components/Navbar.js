import React from "react";
import { Home, Mail } from "lucide-react";

export default function Navbar({ setPage, currentPage }) {
  const linkClasses = (pageName) =>
    `flex items-center gap-2 px-4 py-2 rounded-lg text-lg font-bold transition-colors duration-300 ${
      currentPage === pageName
        ? 'text-cyan-400 bg-gray-700/50 ring-1 ring-cyan-500/50 shadow-md'
        : 'text-indigo-300 hover:text-cyan-400 hover:bg-gray-700/30'
    }`;

  return (
    <nav className="bg-gray-800/80 backdrop-blur-sm shadow-lg rounded-xl p-4 border-b-2 border-indigo-600 mb-6">
      <div className="container mx-auto flex justify-center items-center gap-6">
        <button onClick={() => setPage('home')} className={linkClasses('home')}>
          <Home size={20} /> Ana Sayfa (Simülasyon)
        </button>
        <button onClick={() => setPage('contact')} className={linkClasses('contact')}>
          <Mail size={20} /> İletişim
        </button>
      </div>
    </nav>
  );
}
