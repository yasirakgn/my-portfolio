import React from 'react';
import { Activity, Zap, CheckCircle, BarChart3, Wifi, WifiOff } from 'lucide-react';

const DEFAULT_METRICS = { availability: 0, performance: 0, quality: 0, oee: 0 };

export default function OEEDashboard({ state, actions }) {
    const { oeeMetrics, liveMode } = state || {};
    const { availability, performance, quality, oee } = oeeMetrics || DEFAULT_METRICS;
    const toggleLiveMode = actions?.toggleLiveMode;

    const MetricCard = ({ title, value, icon: Icon, color }) => (
        <div className="bg-white/5 backdrop-blur-md border border-white/10 p-2 rounded-lg flex flex-col items-center justify-center relative overflow-hidden group hover:bg-white/10 transition-all">
            <div className={`absolute top-0 right-0 p-1 opacity-20 group-hover:opacity-40 transition-opacity ${color}`}>
                <Icon size={24} />
            </div>
            <p className="text-gray-400 text-[10px] uppercase font-semibold mb-0">{title}</p>
            <div className="relative z-10 flex items-end gap-1">
                <span className={`text-lg font-black ${color.replace('text-', 'text-')}`}>{value}%</span>
            </div>
            <div className="w-full h-1 bg-gray-700 mt-1 rounded-full overflow-hidden">
                <div className={`h-full rounded-full transition-all duration-1000 ease-out ${color.replace('text-', 'bg-')}`} style={{ width: `${value}%` }} />
            </div>
        </div>
    );

    return (
        <div className="bg-gray-900/80 backdrop-blur-xl border border-gray-700 p-3 rounded-lg shadow-lg">
            <div className="flex flex-wrap justify-between items-center mb-3 pl-2 border-l-4 border-indigo-500">
                <div>
                    <h2 className="text-sm font-bold text-white flex items-center gap-2">
                        <BarChart3 size={16} className="text-indigo-400" />
                        OEE Dashboard
                    </h2>
                </div>

                {/* Live Mode Toggle */}
                <div className="flex flex-col items-end">
                    <button
                        onClick={toggleLiveMode}
                        className={`
            flex items-center gap-1 px-2 py-1 rounded font-bold text-[10px] tracking-wider uppercase transition-all
            ${liveMode
                                ? 'bg-green-500/20 text-green-400 border border-green-500/50'
                                : 'bg-gray-800 text-gray-500 border border-gray-700 hover:bg-gray-700'
                            }
          `}
                    >
                        {liveMode ? <Wifi size={12} /> : <WifiOff size={12} />}
                        {liveMode ? 'ONLINE' : 'OFFLINE'}
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-4 gap-2">
                {/* Main OEE Score */}
                <div className="bg-gradient-to-br from-indigo-900/50 to-purple-900/50 border border-indigo-500/30 p-2 rounded-lg flex flex-col items-center justify-center relative overflow-hidden">
                    <p className="text-indigo-200 text-[10px] uppercase tracking-widest font-semibold z-10">OEE</p>
                    <div className="text-2xl font-black text-white z-10">{oee}%</div>
                </div>

                <MetricCard title="Avail" value={availability} icon={Activity} color="text-blue-400" />
                <MetricCard title="Perf" value={performance} icon={Zap} color="text-yellow-400" />
                <MetricCard title="Qual" value={quality} icon={CheckCircle} color="text-green-400" />
            </div>
        </div>
    );

}
