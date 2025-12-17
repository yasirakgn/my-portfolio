import React from 'react';
import { Play, RotateCcw, Octagon, Layers, Power } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

export default function SimulationControls({ actions, state }) {
    const { t } = useLanguage();

    // HMI Button Component
    const HMIButton = ({ onClick, disabled, color, icon: Icon, label, isBig = false }) => {
        const baseClass = "relative overflow-hidden transition-all duration-100 active:scale-95 flex flex-col items-center justify-center rounded shadow-inner border-b-4 border-r-4 active:border-b-0 active:border-r-0 active:translate-y-1 active:translate-x-1";

        let colorStyles = "";
        if (color === "green") colorStyles = "bg-green-600 border-green-800 text-white hover:bg-green-500 shadow-green-900/50";
        if (color === "red") colorStyles = "bg-red-600 border-red-800 text-white hover:bg-red-500 shadow-red-900/50";
        if (color === "gray") colorStyles = "bg-gray-600 border-gray-800 text-gray-200 hover:bg-gray-500 shadow-gray-900/50";

        if (disabled) colorStyles = "bg-gray-700 border-gray-800 text-gray-500 cursor-not-allowed opacity-60";

        return (
            <button
                onClick={onClick}
                disabled={disabled}
                className={`${baseClass} ${colorStyles} ${isBig ? 'h-24 col-span-2' : 'h-16'}`}
            >
                {/* Gloss Effect */}
                <div className="absolute top-0 left-0 w-full h-1/3 bg-gradient-to-b from-white/20 to-transparent pointer-events-none"></div>

                <Icon size={isBig ? 24 : 18} strokeWidth={2.5} className="mb-1 z-10 drop-shadow-md" />
                <span className="text-[10px] font-black tracking-widest uppercase z-10 drop-shadow-sm">{label}</span>
            </button>
        );
    };

    return (
        <div className="bg-gradient-to-br from-gray-800 to-gray-900 p-4 rounded-xl border border-gray-700 shadow-2xl relative overflow-hidden">
            {/* Panel Screws (Visual) */}
            <div className="absolute top-2 left-2 w-2 h-2 rounded-full bg-gray-600 flex items-center justify-center"><div className="w-1.5 h-0.5 bg-gray-800 rotate-45"></div></div>
            <div className="absolute top-2 right-2 w-2 h-2 rounded-full bg-gray-600 flex items-center justify-center"><div className="w-1.5 h-0.5 bg-gray-800 rotate-45"></div></div>
            <div className="absolute bottom-2 left-2 w-2 h-2 rounded-full bg-gray-600 flex items-center justify-center"><div className="w-1.5 h-0.5 bg-gray-800 rotate-45"></div></div>
            <div className="absolute bottom-2 right-2 w-2 h-2 rounded-full bg-gray-600 flex items-center justify-center"><div className="w-1.5 h-0.5 bg-gray-800 rotate-45"></div></div>

            <div className="flex justify-between items-center mb-4 pl-2 pr-2">
                <div className="flex items-center gap-2">
                    <div className={`w-3 h-3 rounded-full border border-black/50 ${state.isRunning ? 'bg-green-500 shadow-[0_0_10px_rgba(34,197,94,0.8)]' : 'bg-red-900'}`}></div>
                    <h2 className="text-xs font-bold text-gray-400 tracking-wider">PLC_MAIN_OP</h2>
                </div>
                <div className="flex gap-1">
                    <span className="text-[10px] bg-black/40 px-2 py-0.5 rounded text-green-500 font-mono">
                        {state.isRunning ? 'STATUS: RUN' : 'STATUS: HALT'}
                    </span>
                </div>
            </div>

            <div className="space-y-4">
                {/* Main Actions - Grid Layout like a Panel */}
                <div className="grid grid-cols-2 gap-3 bg-gray-950/30 p-3 rounded-lg border border-white/5">
                    <HMIButton
                        onClick={actions.handleStart}
                        disabled={state.isRunning}
                        color="green"
                        icon={Play}
                        label={t("sim.ctrl.start")}
                    />

                    <HMIButton
                        onClick={actions.handleStop}
                        disabled={!state.isRunning}
                        color="red"
                        icon={Octagon}
                        label={t("sim.ctrl.stop")}
                    />

                    <HMIButton
                        onClick={actions.handleReset}
                        // disabled={state.isRunning} // Often reset is allowed via hold, but simple click is fine
                        color="gray"
                        icon={RotateCcw}
                        label={t("sim.ctrl.reset")}
                        isBig={true}
                    />
                </div>

                {/* Queue Input */}
                <div className="space-y-2 bg-gray-950/30 p-3 rounded-lg border border-white/5">
                    <div className="flex items-center justify-between">
                        <label className="text-[9px] uppercase font-bold text-gray-500 tracking-wider flex items-center gap-1">
                            <Layers size={10} />
                            {t("sim.ctrl.queue")}
                        </label>
                        <button
                            onClick={actions.toggleLiveMode}
                            className={`text-[9px] px-2 py-1 rounded font-bold transition-colors ${state.liveMode
                                ? 'bg-blue-600 text-white shadow-[0_0_10px_rgba(37,99,235,0.5)]'
                                : 'bg-gray-700 text-gray-400 hover:bg-gray-600'}`}
                        >
                            {state.liveMode ? t("sim.ctrl.live_on") : t("sim.ctrl.live_off")}
                        </button>
                    </div>
                    <div className="relative">
                        <textarea
                            value={state.partQueueText}
                            onChange={(e) => actions.setPartQueueText(e.target.value)}
                            disabled={state.liveMode}
                            className="w-full h-20 bg-black text-xs font-mono text-green-400 p-2 rounded border border-gray-700 focus:border-green-500 focus:ring-1 focus:ring-green-900 outline-none resize-none disabled:opacity-50 disabled:cursor-not-allowed shadow-inner"
                        />
                        {/* Scanline effect overlay */}
                        <div className="absolute inset-0 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] z-10 pointer-events-none bg-[length:100%_2px,3px_100%] opacity-20"></div>
                    </div>
                </div>
            </div>

            <div className="mt-3 flex justify-center">
                <div className="text-[9px] text-gray-600 font-mono">SN: 8492-AX-2024</div>
            </div>
        </div>
    );
}
