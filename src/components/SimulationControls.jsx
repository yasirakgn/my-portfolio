import React from 'react';
import { Play, RotateCcw, StopCircle, Square } from 'lucide-react';

export default function SimulationControls({ actions, state }) {
    return (
        <div className="bg-gray-800 p-3 rounded-lg border border-gray-700 shadow-lg">
            <div className="flex justify-between items-center mb-3">
                <h2 className="text-sm font-bold text-gray-300">KONTROL PANELİ</h2>
                <div className="flex gap-1">
                    <span className={`w-2 h-2 rounded-full ${state.isRunning ? 'bg-green-500 animate-pulse' : 'bg-red-500'}`}></span>
                    <span className="text-xs font-mono text-gray-500">{state.isRunning ? 'RUN' : 'STOP'}</span>
                </div>
            </div>

            <div className="space-y-3">
                {/* Main Actions */}
                <div className="grid grid-cols-3 gap-2">
                    <button
                        onClick={actions.handleStart}
                        disabled={state.isRunning}
                        aria-label="Simülasyonu Başlat"
                        className={`flex flex-col items-center justify-center p-2 rounded transition-all ${state.isRunning
                                ? 'bg-gray-700 text-gray-500 opacity-50 cursor-not-allowed'
                                : 'bg-green-600 hover:bg-green-500 text-white shadow-lg shadow-green-900/20'
                            }`}
                    >
                        <Play size={16} className="mb-1" />
                        <span className="text-[10px] font-bold">BAŞLAT</span>
                    </button>

                    <button
                        onClick={actions.handleStop}
                        disabled={!state.isRunning}
                        aria-label="Simülasyonu Durdur"
                        className={`flex flex-col items-center justify-center p-2 rounded transition-all ${!state.isRunning
                                ? 'bg-gray-700 text-gray-500 opacity-50 cursor-not-allowed'
                                : 'bg-red-600 hover:bg-red-500 text-white shadow-lg shadow-red-900/20'
                            }`}
                    >
                        <Square size={16} className="mb-1" />
                        <span className="text-[10px] font-bold">DURDUR</span>
                    </button>

                    <button
                        onClick={actions.handleReset}
                        aria-label="Simülasyonu Sıfırla"
                        className="flex flex-col items-center justify-center p-2 rounded bg-gray-700 hover:bg-gray-600 text-gray-300 transition-colors"
                    >
                        <RotateCcw size={16} className="mb-1" />
                        <span className="text-[10px] font-bold">SIFIRLA</span>
                    </button>
                </div>

                {/* Queue Input */}
                <div className="space-y-1">
                    <div className="flex items-center justify-between">
                        <label className="text-[10px] uppercase font-bold text-gray-500">Üretim Kuyruğu</label>
                        <button
                            onClick={actions.toggleLiveMode}
                            className={`text-[10px] px-2 py-0.5 rounded border ${state.liveMode ? 'bg-blue-600 border-blue-400 text-white' : 'bg-gray-700 border-gray-600 text-gray-400'}`}
                        >
                            {state.liveMode ? 'CANLI MOD: AÇIK' : 'CANLI MOD: KAPALI'}
                        </button>
                    </div>
                    <textarea
                        value={state.partQueueText}
                        onChange={(e) => actions.setPartQueueText(e.target.value)}
                        disabled={state.liveMode}
                        className="w-full h-16 bg-gray-900 text-xs font-mono text-gray-300 p-2 rounded border border-gray-600 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none resize-none disabled:opacity-50"
                    />
                </div>
            </div>
        </div>
    );
}
