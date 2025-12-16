import React, { useEffect, useRef } from "react";
import {
    INPUT_CONVEYOR_Y,
    MAIN_OUTPUT_CONVEYOR_Y,
    BRANCH_OFFSET,
    INPUT_PICKUP_X,
    OUTPUT_DROP_X,
    DIVERTER_X,
    BIN_X,
    BIN_WIDTH,
    ORIGINAL_WIDTH,
    ORIGINAL_HEIGHT,
    ROBOT_BASE_X,
    ROBOT_BASE_Y,
    SENSOR_X
} from "../constants/simulationConstants";

const distance = (a, b) => Math.sqrt((a.x - b.x) ** 2 + (a.y - b.y) ** 2);

export default function SimulationCanvas({ state, refs, actions }) {
    const canvasRef = useRef(null);
    const containerRef = useRef(null);
    const animationRef = useRef({ id: null, offset: 0 });
    const scaleFactorRef = useRef(1);
    const lastTimeRef = useRef(performance.now());

    const {
        robotPosRef, robotPartRef, outputPartsRef, inputPartRef
    } = refs;

    const { isRunning, message } = state;

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext("2d");

        // --- RESIZE LİSTENER & CLEANUP (FIXED) ---
        const resizeCanvas = () => {
            const container = containerRef.current;
            if (container) {
                const newWidth = container.clientWidth;
                canvas.width = newWidth;
                // Aspect Ratio Koruması
                const newHeight = newWidth * (ORIGINAL_HEIGHT / ORIGINAL_WIDTH);
                canvas.height = newHeight;
                scaleFactorRef.current = newWidth / ORIGINAL_WIDTH;
            }
        };

        resizeCanvas();
        window.addEventListener('resize', resizeCanvas);

        // --- DRAWING LOGIC ---
        const drawConveyors = () => {
            ctx.fillStyle = "#1F2937"; ctx.fillRect(0, 0, ORIGINAL_WIDTH, ORIGINAL_HEIGHT);

            const drawConveyorLine = (startX, y, endX, label) => {
                ctx.fillStyle = "#374151"; ctx.fillRect(startX, y, endX - startX, 25);
                ctx.fillStyle = "#2D3748"; ctx.fillRect(startX, y, endX - startX, 20);
                ctx.fillStyle = "#4B5563"; ctx.fillRect(startX, y + 2, endX - startX, 16);
                ctx.fillStyle = "#9CA3AF";
                const segmentLength = 40;
                for (let i = startX; i < endX; i += segmentLength) {
                    const rollerX = i + (animationRef.current.offset * 0.5) % segmentLength;
                    ctx.beginPath(); ctx.arc(rollerX, y + 10, 3, 0, Math.PI * 2); ctx.fill();
                    ctx.fillStyle = "#2D3748";
                    ctx.beginPath(); ctx.arc(rollerX - 1, y + 10 - 1, 2, 0, Math.PI * 2); ctx.fill();
                    ctx.fillStyle = "#9CA3AF";
                }
                ctx.strokeStyle = "#111827"; ctx.lineWidth = 1; ctx.strokeRect(startX, y, endX - startX, 20);
                if (label) { ctx.fillStyle = "#9CA3AF"; ctx.textAlign = "left"; ctx.font = "12px Inter"; ctx.fillText(label, startX + 5, y - 5); }
            };

            drawConveyorLine(0, INPUT_CONVEYOR_Y, INPUT_PICKUP_X + 50, "Giriş Konveyörü");
            drawConveyorLine(OUTPUT_DROP_X - 50, MAIN_OUTPUT_CONVEYOR_Y, DIVERTER_X + 20, "Ana Konveyör");
            drawConveyorLine(DIVERTER_X, MAIN_OUTPUT_CONVEYOR_Y - BRANCH_OFFSET, BIN_X + BIN_WIDTH, "Konveyör A");
            drawConveyorLine(DIVERTER_X, MAIN_OUTPUT_CONVEYOR_Y + BRANCH_OFFSET, BIN_X + BIN_WIDTH, "Konveyör B");

            // Diverter
            ctx.fillStyle = "#4B5563"; ctx.fillRect(DIVERTER_X - 12, MAIN_OUTPUT_CONVEYOR_Y - 55, 24, 75);
            ctx.fillStyle = "#374151"; ctx.fillRect(DIVERTER_X - 10, MAIN_OUTPUT_CONVEYOR_Y - 50, 20, 70);
            ctx.save();
            ctx.translate(DIVERTER_X, MAIN_OUTPUT_CONVEYOR_Y + 10);
            let angle = 0;
            const activePart = outputPartsRef.current.find(p => p.conveyorPhase === 'DIVERTER_MOVE');
            if (activePart) {
                const targetAngle = activePart.type === 'TYPE_A' ? -Math.PI / 6 : Math.PI / 6;
                angle = targetAngle * Math.min(activePart.diverterProgress * 2, 1);
            }
            ctx.rotate(angle);
            ctx.fillStyle = "#C0C0C0"; ctx.fillRect(-5, -5, 60, 10);
            ctx.fillStyle = "#4B5563"; ctx.beginPath(); ctx.arc(60, 0, 5, 0, Math.PI * 2); ctx.fill();
            ctx.restore();
            ctx.fillStyle = "#E5E7EB"; ctx.textAlign = "center"; ctx.font = "12px Inter"; ctx.fillText("Yönlendirici", DIVERTER_X, MAIN_OUTPUT_CONVEYOR_Y - 65);

            // Bins
            const drawBin = (x, y, color, label) => {
                const binTopY = y + 20;
                ctx.fillStyle = "#1F2937"; ctx.fillRect(x, binTopY, BIN_WIDTH, 85);
                ctx.fillStyle = color; ctx.fillRect(x + 2, binTopY + 2, BIN_WIDTH - 4, 81);
                ctx.fillStyle = "#9CA3AF"; ctx.fillRect(x - 2, binTopY - 2, BIN_WIDTH + 4, 4);
                ctx.strokeStyle = "#FFF"; ctx.lineWidth = 1; ctx.strokeRect(x, binTopY, BIN_WIDTH, 85);
                ctx.fillStyle = "#FFF"; ctx.textAlign = "center"; ctx.font = "12px Inter Bold"; ctx.fillText(label, x + BIN_WIDTH / 2, y + 55);
            };
            drawBin(BIN_X, MAIN_OUTPUT_CONVEYOR_Y - BRANCH_OFFSET, "#2563EB", "Kutu A");
            drawBin(BIN_X, MAIN_OUTPUT_CONVEYOR_Y + BRANCH_OFFSET, "#DC2626", "Kutu B");

            // Sensors
            const drawSensor = (x, y, label) => {
                ctx.fillStyle = "#374151"; ctx.fillRect(x - 5, y - 20, 20, 10);
                ctx.fillStyle = "#10B981"; ctx.beginPath(); ctx.arc(x + 5, y - 15, 4, 0, Math.PI * 2); ctx.fill();
                ctx.fillStyle = "#E5E7EB"; ctx.textAlign = "center"; ctx.font = "10px Inter"; ctx.fillText(label, x + 5, y - 25);
            };
            drawSensor(SENSOR_X, MAIN_OUTPUT_CONVEYOR_Y - BRANCH_OFFSET, "Sensör A");
            drawSensor(SENSOR_X, MAIN_OUTPUT_CONVEYOR_Y + BRANCH_OFFSET, "Sensör B");
        };

        const drawParts = () => {
            const drawPart = (p) => {
                ctx.fillStyle = p.color;
                ctx.shadowColor = 'rgba(0, 0, 0, 0.4)'; ctx.shadowBlur = 5; ctx.shadowOffsetX = 2; ctx.shadowOffsetY = 2;
                ctx.fillRect(p.x, p.y, p.width, p.height);
                ctx.shadowBlur = 0; ctx.shadowOffsetX = 0; ctx.shadowOffsetY = 0;
                ctx.strokeStyle = "#000"; ctx.strokeRect(p.x, p.y, p.width, p.height);
            };
            if (inputPartRef.current) drawPart(inputPartRef.current);
            const rp = robotPartRef.current;
            if (rp) { rp.x = robotPosRef.current.x - rp.width / 2; rp.y = robotPosRef.current.y - rp.height / 2 - 15; drawPart(rp); }
            outputPartsRef.current.forEach(drawPart);
        };

        const drawRobot = () => {
            const currentPos = robotPosRef.current;
            const dx = currentPos.x - ROBOT_BASE_X;
            const dy = currentPos.y - ROBOT_BASE_Y;
            const dist = distance(currentPos, { x: ROBOT_BASE_X, y: ROBOT_BASE_Y });
            const midX = ROBOT_BASE_X + dx * 0.5, midY = ROBOT_BASE_Y + dy * 0.5;
            const perpX = -dy / dist, perpY = dx / dist;
            const offsetMagnitude = Math.min(dist / 3, 50) + 10;
            const elbowX = midX + perpX * offsetMagnitude, elbowY = midY + perpY * offsetMagnitude;

            ctx.fillStyle = "#1F2937"; ctx.fillRect(ROBOT_BASE_X - 25, ROBOT_BASE_Y - 10, 50, 60);
            ctx.fillRect(ROBOT_BASE_X - 35, ROBOT_BASE_Y + 50, 70, 10);
            ctx.strokeStyle = "#6B7280"; ctx.strokeRect(ROBOT_BASE_X - 25, ROBOT_BASE_Y - 10, 50, 60);
            ctx.shadowColor = 'rgba(0, 0, 0, 0.5)'; ctx.shadowBlur = 5; ctx.shadowOffsetX = 3; ctx.shadowOffsetY = 3;
            ctx.strokeStyle = "#60A5FA"; ctx.lineWidth = 12; ctx.lineCap = 'round';
            ctx.beginPath(); ctx.moveTo(ROBOT_BASE_X, ROBOT_BASE_Y); ctx.lineTo(elbowX, elbowY); ctx.stroke();
            ctx.beginPath(); ctx.moveTo(elbowX, elbowY); ctx.lineTo(currentPos.x, currentPos.y); ctx.stroke();
            ctx.shadowBlur = 0; ctx.shadowOffsetX = 0; ctx.shadowOffsetY = 0;
            ctx.fillStyle = "#000"; ctx.beginPath(); ctx.arc(ROBOT_BASE_X, ROBOT_BASE_Y, 14, 0, Math.PI * 2); ctx.fill();
            ctx.fillStyle = "#C0C0C0"; ctx.beginPath(); ctx.arc(elbowX, elbowY, 10, 0, Math.PI * 2); ctx.fill();

            const held = !!(robotPartRef.current && robotPartRef.current.held);
            ctx.fillStyle = held ? "#EF4444" : "#10B981";
            ctx.shadowColor = held ? 'rgba(239, 68, 68, 0.8)' : 'rgba(16, 185, 129, 0.8)';
            ctx.shadowBlur = 10; ctx.beginPath(); ctx.arc(currentPos.x, currentPos.y, 16, 0, Math.PI * 2); ctx.fill();
            ctx.shadowBlur = 0;
            ctx.strokeStyle = "#1F2937"; ctx.lineWidth = 5;
            ctx.beginPath(); ctx.moveTo(currentPos.x + 12, currentPos.y); ctx.lineTo(currentPos.x + 20, currentPos.y - 18); ctx.stroke();
            ctx.beginPath(); ctx.moveTo(currentPos.x - 12, currentPos.y); ctx.lineTo(currentPos.x - 20, currentPos.y - 18); ctx.stroke();
        };



        // ... (rest of code)

        const animate = (time) => {
            // Delta Time Calculation
            const now = time || performance.now();
            const rawDt = (now - lastTimeRef.current) / 1000;
            const dt = Math.min(rawDt, 0.1); // Cap at 100ms prevents jumps
            lastTimeRef.current = now;

            // Using dt for physics
            actions.updateRobotAnimation(dt);

            const speed = 2; // Animation constant
            animationRef.current.offset = (animationRef.current.offset + speed) % 60; // Visuals only

            ctx.clearRect(0, 0, canvas.width, canvas.height);
            const S = scaleFactorRef.current;
            ctx.save(); ctx.scale(S, S);

            drawConveyors();

            if (isRunning) {
                actions.updateConveyorMovement(dt);
                actions.runPLCStep(); // FSM still tick-based, fine
            }

            drawParts();
            drawRobot();

            ctx.restore();
            animationRef.current.id = requestAnimationFrame(animate);
        };

        // Start Animation Loop
        lastTimeRef.current = performance.now();
        animationRef.current.id = requestAnimationFrame(animate);

        return () => {
            // --- CLEANUP ---
            window.removeEventListener('resize', resizeCanvas);
            if (animationRef.current.id) cancelAnimationFrame(animationRef.current.id);
        };
    }, [isRunning, actions, refs]);
    // Dependency array note: 'refs' are usually stable objects, but checking just in case. 
    // We want to avoid re-binding the loop too often, but we need isRunning for logic inside.

    return (
        <div ref={containerRef} className="w-full h-full relative bg-gray-900 group">
            {/* Header Overlay - Absolute Positioned to save space */}
            <div className="absolute top-0 left-0 w-full p-2 flex justify-between items-center pointer-events-none z-10 bg-gradient-to-b from-gray-900/80 to-transparent">
                <h2 className="text-sm font-bold text-indigo-300 px-2">CANVAS SİMÜLASYON</h2>
                <div className={`px-2 py-0.5 rounded text-xs font-mono font-bold border ${message.startsWith('🚨') ? 'bg-red-900/80 border-red-500 text-red-200' : 'bg-gray-800/80 border-gray-600 text-gray-300'}`}>
                    {message.slice(0, 50)}...
                </div>
            </div>

            <canvas
                ref={canvasRef}
                role="img"
                aria-label="Endüstriyel Robotik Kol Simülasyonu"
                className="block w-full h-full object-contain"
                style={{ backgroundColor: '#1F2937' }}
            />

            <div role="status" aria-live="polite" className="sr-only">
                {message}
            </div>
        </div>
    );
}
