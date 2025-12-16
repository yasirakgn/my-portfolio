import React from "react";
import { Gauge } from 'lucide-react';
import { usePLCLogic } from "../hooks/usePLCLogic";
import OEEDashboard from "./OEEDashboard";
import SimulationStats from "./SimulationStats";
import SimulationControls from "./SimulationControls";
import SimulationCanvas from "./SimulationCanvas";

export default function SimulationPage() {
  const {
    state,
    refs,
    actions
  } = usePLCLogic();

  return (
    <div className="h-[calc(100vh-6rem)] w-full bg-gray-900 text-white overflow-hidden flex flex-col pt-24 lg:pt-0 lg:flex-row">
      {/* Mobile Scroll Wrapper / Desktop Fixed Container */}
      {/* Mobile Scroll Wrapper / Desktop Fixed Container */}
      <div className="flex-1 flex flex-col lg:flex-row h-full w-full overflow-hidden p-2 gap-2 lg:p-3 lg:gap-3">

        {/* LEFT SIDEBAR (Controls & Data) - Scrollable if content overflows vertical height */}
        <div className="w-full lg:w-[320px] flex flex-col gap-2 h-auto lg:h-full overflow-y-auto pr-1 custom-scrollbar">
          {/* Controls */}
          <SimulationControls
            state={state}
            actions={actions}
            refs={refs}
          />

          {/* Compact Stats & Dashboard */}
          <div className="flex flex-col gap-2">
            <OEEDashboard state={state} actions={actions} />
            <SimulationStats state={state} refs={refs} actions={actions} />
          </div>
        </div>

        {/* RIGHT MAIN (Canvas) - Fixed / No Scroll */}
        <div className="flex-1 min-h-[400px] lg:h-full bg-gray-800 rounded-lg border border-gray-700 overflow-hidden shadow-2xl relative">
          <SimulationCanvas
            state={state}
            refs={refs}
            actions={actions}
          />
        </div>
      </div>
    </div>
  );
}
