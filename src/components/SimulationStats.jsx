import React from 'react';
import { RotateCcw, Boxes, User, CheckCircle, Zap } from 'lucide-react';

const StatCard = ({ title, value, colorClass, Icon, iconColor }) => (
    <div className="p-3 bg-gray-700 rounded-lg shadow-lg border-l-2 border-gray-600">
        <div className="flex justify-between items-center">
            <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider">{title}</p>
            <Icon className={`w-4 h-4 ${iconColor}`} />
        </div>
        <p className={`text-xl font-extrabold mt-0.5 ${colorClass}`}>{value}</p>
    </div>
);

export default function SimulationStats({ state, refs, actions }) {
    const { cycleCount, finishedCount, liveMode, validRecipeLength, partQueueText, step } = state || {};
    const { partRecipeRef } = refs || {};


    const StepDisplay = () => {
        let description = "Bilinmeyen Adım";
        // Not running conditions
        const isQueueEmpty = partRecipeRef?.current && partRecipeRef.current.length === 0;

        if (step === 0 && isQueueEmpty && finishedCount > 0) description = "Tüm parçalar işlendi.";
        else if (step === 0) description = "Başlatılmayı bekliyor.";
        else {
            const map = { 0: "Bekleniyor", 10: "Gidiyor", 20: "Kavrıyor", 30: "Taşıyor", 40: "Bırakıyor", 50: "Dönüyor" };
            description = map[step] || "Bilinmeyen";
        }
        return (
            <div className="font-mono text-xs text-cyan-300 p-1.5 bg-gray-800 rounded border border-gray-700 mt-1">
                <span className="text-gray-500 mr-2">STEP {step}:</span><span>{description}</span>
            </div>
        );
    };

    return (
        <>
            <div className="grid grid-cols-2 gap-2 mb-2">
                <StatCard title="Döngü" value={cycleCount} colorClass="text-white" Icon={RotateCcw} iconColor="text-indigo-400" />
                <StatCard title="Ürün" value={finishedCount} colorClass="text-green-400" Icon={Boxes} iconColor="text-green-400" />
                <div className="col-span-2">
                    <StatCard
                        title="Kalan"
                        value={liveMode ? "∞" : (partRecipeRef?.current ? partRecipeRef.current.length : 0)}
                        colorClass="text-yellow-400"
                        Icon={User}
                        iconColor="text-yellow-400"
                    />
                </div>
            </div>

            <div className="flex items-center gap-2 mt-2">
                <Zap className="w-4 h-4 text-indigo-400" />
                <span className="text-xs font-bold text-indigo-300">PLC ADIMI</span>
            </div>
            <StepDisplay />


        </>
    );
}
