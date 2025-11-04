import React, { useState } from "react";
import Navbar from "./components/Navbar";
import SimulationPage from "./components/SimulationPage";
import ContactForm from "./components/ContactForm";

export default function App() {
  const [page, setPage] = useState("home");

  return (
    <div className="bg-gray-900 text-gray-100 min-h-screen p-4 sm:p-6 font-sans">
      <Navbar setPage={setPage} currentPage={page} />
      {page === "home" && <SimulationPage />}
      {page === "contact" && <ContactForm />}
    </div>
  );
}
