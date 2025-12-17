import React, { useEffect, useRef } from "react";
import { useLanguage } from "../context/LanguageContext";
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

export default function SimulationCanvas({ state, refs, actions, isPreview = false }) {
    const { t } = useLanguage();
    const canvasRef = useRef(null);
    const containerRef = useRef(null);
    const animationRef = useRef({ id: null, offset: 0 });
    const scaleFactorRef = useRef(1);
    const lastTimeRef = useRef(performance.now());

    // --- FALLBACK FOR PREVIEW MODE ---
    const internalRefs = useRef({
        robotPosRef: { current: { x: 400, y: 300 } },
        robotPartRef: { current: null },
        outputPartsRef: { current: [] },
        inputPartRef: { current: null },
    });

    const safeRefs = refs || internalRefs.current;

    // Destructure safely
    const {
        robotPosRef, robotPartRef, outputPartsRef, inputPartRef
    } = safeRefs;

    const safeState = state || { isRunning: true, message: { key: "sim.msg.offline_mode" } }; // Default safe message
    const safeActions = actions || {
        updateRobotAnimation: (dt) => { },
        updateConveyorMovement: (dt) => { },
        runPLCStep: () => { }
    };

    const { isRunning, message } = safeState;

    // Helper to resolve message object or string to translated text
    const resolveMessage = (msg) => {
        if (!msg) return "";
        if (typeof msg === 'string') return msg; // Legacy/Fallback support
        if (msg.key) {
            const translatedParams = {};
            if (msg.params) {
                Object.keys(msg.params).forEach(k => {
                    const val = msg.params[k];
                    // Recursively translate values if they look like keys (e.g. sim.color.*)
                    if (typeof val === 'string' && val.startsWith('sim.')) {
                        translatedParams[k] = t(val);
                    } else {
                        translatedParams[k] = val;
                    }
                });
            }
            return t(msg.key, translatedParams);
        }
        return "";
    };

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext("2d");

        // --- RESIZE LISTENER ---
        const resizeCanvas = () => {
            const container = containerRef.current;
            if (container) {
                const newWidth = container.clientWidth;
                canvas.width = newWidth;
                const newHeight = newWidth * (ORIGINAL_HEIGHT / ORIGINAL_WIDTH);
                canvas.height = newHeight;
                scaleFactorRef.current = newWidth / ORIGINAL_WIDTH;
            }
        };

        resizeCanvas();
        window.addEventListener('resize', resizeCanvas);

        // --- INDUSTRIAL DRAWING HELPERS (DEFINED INSIDE EFFECT TO ACCESS CTX/CONSTANTS) ---

        const drawConveyorBelt = (x, y, length, label) => {
            const width = 40;
            // Frame
            ctx.fillStyle = '#374151'; // Gray-700
            ctx.fillRect(x, y - width / 2, length, width);

            // Rails
            ctx.fillStyle = '#1F2937'; // Gray-800
            ctx.fillRect(x, y - width / 2 - 4, length, 4);
            ctx.fillRect(x, y + width / 2, length, 4);

            // Rollers
            ctx.fillStyle = '#6B7280';
            const rollerSpacing = 20;
            const offset = animationRef.current.offset % rollerSpacing;
            for (let i = 0; i < length; i += rollerSpacing) {
                const rx = x + i + offset;
                if (rx < x + length) {
                    ctx.fillRect(rx, y - width / 2 + 2, 4, width - 4);
                }
            }

            // Legs (Industrial Stand)
            ctx.fillStyle = '#6B7280';
            for (let i = 20; i < length; i += 100) {
                ctx.fillRect(x + i, y + width / 2 + 4, 10, 50); // Vertical Leg
                ctx.fillRect(x + i - 10, y + width / 2 + 54, 30, 4); // Foot
            }

            if (label) {
                ctx.fillStyle = '#9CA3AF';
                ctx.font = '10px sans-serif';
                ctx.fillText(label, x + 5, y + width / 2 + 20);
            }
        };

        const drawIndustrialSensor = (x, y, active, label) => {
            // Stand
            ctx.fillStyle = '#4B5563';
            ctx.fillRect(x - 5, y + 25, 10, 40); // Post to floor

            // Sensor Head
            ctx.fillStyle = '#111827';
            ctx.fillRect(x - 8, y + 10, 16, 16);

            // Status Light
            ctx.fillStyle = active ? '#EF4444' : '#10B981'; // Red=Detect, Green=Ready
            ctx.beginPath();
            ctx.arc(x, y + 18, 4, 0, Math.PI * 2);
            ctx.fill();

            // Laser Beam
            if (active) {
                ctx.strokeStyle = '#EF4444';
                ctx.lineWidth = 2;
                ctx.beginPath();
                ctx.moveTo(x, y + 10);
                ctx.lineTo(x, y - 20); // Across belt
                ctx.stroke();
            } else {
                ctx.strokeStyle = 'rgba(16, 185, 129, 0.2)';
                ctx.lineWidth = 1;
                ctx.setLineDash([2, 2]);
                ctx.beginPath();
                ctx.moveTo(x, y + 10);
                ctx.lineTo(x, y - 20);
                ctx.stroke();
                ctx.setLineDash([]);
            }

            ctx.fillStyle = '#9CA3AF';
            ctx.font = '9px monospace';
            ctx.fillText(label, x - 15, y + 70);
        };

        const drawBoxingStation = (x, y) => {
            // Station Housing
            ctx.fillStyle = '#1F2937';
            ctx.fillRect(x, y - 40, 60, 80);

            // Output Chute / Box area
            ctx.fillStyle = '#D1D5DB'; // Box Color
            ctx.beginPath();
            ctx.moveTo(x + 10, y + 10);
            ctx.lineTo(x + 50, y + 10);
            ctx.lineTo(x + 50, y + 40);
            ctx.lineTo(x + 10, y + 40);
            ctx.fill();

            // Flaps
            ctx.strokeStyle = '#9CA3AF';
            ctx.lineWidth = 1;
            ctx.strokeRect(x + 10, y + 10, 40, 30);
            ctx.beginPath(); ctx.moveTo(x + 10, y + 25); ctx.lineTo(x + 50, y + 25); ctx.stroke();

            // Label
            ctx.fillStyle = '#FFF';
            ctx.font = '16px Arial';
            ctx.fillText("📦", x + 15, y - 10);
        };

        const drawRobotArm = () => {
            const currentPos = robotPosRef.current;

            // Base
            ctx.fillStyle = '#374151';
            ctx.beginPath(); ctx.arc(ROBOT_BASE_X, ROBOT_BASE_Y, 25, 0, Math.PI * 2); ctx.fill();
            ctx.strokeStyle = '#4B5563'; ctx.lineWidth = 4; ctx.stroke();

            // IK Logic (Elbow) for LIFT Visualization
            const dx = currentPos.x - ROBOT_BASE_X;
            const dy = currentPos.y - ROBOT_BASE_Y;
            const dist = Math.sqrt(dx * dx + dy * dy);
            const midX = ROBOT_BASE_X + dx * 0.5;
            const midY = ROBOT_BASE_Y + dy * 0.5;
            const perpX = -dy / dist;
            const perpY = dx / dist;
            const offset = Math.min(dist / 2.5, 80) + 20; // High arc for "Lift"
            const elbowX = midX + perpX * offset;
            const elbowY = midY + perpY * offset;

            // Arm Segments
            ctx.lineCap = 'round';
            ctx.strokeStyle = '#9CA3AF'; ctx.lineWidth = 14;
            ctx.beginPath(); ctx.moveTo(ROBOT_BASE_X, ROBOT_BASE_Y); ctx.lineTo(elbowX, elbowY); ctx.stroke();

            ctx.strokeStyle = '#6B7280'; ctx.lineWidth = 10;
            ctx.beginPath(); ctx.moveTo(elbowX, elbowY); ctx.lineTo(currentPos.x, currentPos.y); ctx.stroke();

            // Joints
            ctx.fillStyle = '#111827';
            ctx.beginPath(); ctx.arc(ROBOT_BASE_X, ROBOT_BASE_Y, 10, 0, Math.PI * 2); ctx.fill();
            ctx.beginPath(); ctx.arc(elbowX, elbowY, 12, 0, Math.PI * 2); ctx.fill();

            // Gripper
            const isHolding = !!robotPartRef.current;
            ctx.fillStyle = isHolding ? '#10B981' : '#EF4444';
            ctx.beginPath(); ctx.arc(currentPos.x, currentPos.y, 15, 0, Math.PI * 2); ctx.fill();
        };

        const drawDiverterGate = () => {
            ctx.save();
            ctx.translate(DIVERTER_X, MAIN_OUTPUT_CONVEYOR_Y);

            // Check for active diversion
            let angle = 0;
            const activePart = outputPartsRef.current.find(p => p.conveyorPhase === 'DIVERTER_MOVE');
            if (activePart) {
                // Rotate -45 for Top (Type A?), +45 for Bottom (Type B?)
                // Logic: Type A -> Bin A (Top, Y reduced) -> Angle Negative?
                // Let's check logic: isTypeA ? Top ...
                // Actually, visualization: Top is negative Y.
                const targetAngle = activePart.targetY < MAIN_OUTPUT_CONVEYOR_Y ? -Math.PI / 4 : Math.PI / 4;
                angle = targetAngle * Math.min(activePart.diverterProgress * 2, 1);
            }

            ctx.rotate(angle);

            ctx.fillStyle = '#F59E0B';
            ctx.beginPath();
            ctx.moveTo(-15, -35); // Long wedge
            ctx.lineTo(15, 0);    // Pivot
            ctx.lineTo(-15, 35);
            ctx.fill();

            // Pivot Point
            ctx.fillStyle = '#78350F';
            ctx.beginPath(); ctx.arc(10, 0, 4, 0, Math.PI * 2); ctx.fill();

            ctx.restore();

            // Label
            ctx.fillStyle = '#D97706';
            ctx.font = '10px sans-serif';
            ctx.fillText(t("sim.label.diverter"), DIVERTER_X - 20, MAIN_OUTPUT_CONVEYOR_Y - 45);
        };


        // --- MAIN RENDER LOOP ---
        const animate = (time) => {
            // Delta Time
            const now = time || performance.now();
            const rawDt = (now - lastTimeRef.current) / 1000;
            const dt = Math.min(rawDt, 0.1);
            lastTimeRef.current = now;

            // Physics Update
            safeActions.updateRobotAnimation(dt);
            if (isRunning) {
                if (!isPreview) {
                    safeActions.updateConveyorMovement(dt);
                    safeActions.runPLCStep();
                }
                const speed = 60; // pps visual
                animationRef.current.offset += speed * dt;
            }

            // Draw Setup
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            const S = scaleFactorRef.current;
            ctx.save(); ctx.scale(S, S);

            // Background
            ctx.fillStyle = '#111827'; ctx.fillRect(0, 0, ORIGINAL_WIDTH, ORIGINAL_HEIGHT);

            // Grid
            ctx.strokeStyle = '#1F2937'; ctx.lineWidth = 1;
            for (let i = 0; i < ORIGINAL_WIDTH; i += 100) { ctx.beginPath(); ctx.moveTo(i, 0); ctx.lineTo(i, ORIGINAL_HEIGHT); ctx.stroke(); }

            // 1. CONVEYORS (Physical Plant)
            // Input
            drawConveyorBelt(0, INPUT_CONVEYOR_Y, INPUT_PICKUP_X + 60, t("sim.label.input"));

            // Main Out (Robot Drop -> Diverter)
            drawConveyorBelt(OUTPUT_DROP_X - 60, MAIN_OUTPUT_CONVEYOR_Y, DIVERTER_X - OUTPUT_DROP_X + 100, t("sim.label.main"));

            // Branches
            drawConveyorBelt(DIVERTER_X - 20, MAIN_OUTPUT_CONVEYOR_Y - BRANCH_OFFSET, BIN_X - DIVERTER_X + 20, t("sim.label.conv_a"));
            drawConveyorBelt(DIVERTER_X - 20, MAIN_OUTPUT_CONVEYOR_Y + BRANCH_OFFSET, BIN_X - DIVERTER_X + 20, t("sim.label.conv_b"));

            // 2. STATIONS (Fixed)
            // Input Sensor
            const isInputActive = inputPartRef.current && inputPartRef.current.x >= INPUT_PICKUP_X - 10;
            drawIndustrialSensor(INPUT_PICKUP_X, INPUT_CONVEYOR_Y, isInputActive, "Color Scan");

            // Branch Sensors
            drawIndustrialSensor(SENSOR_X, MAIN_OUTPUT_CONVEYOR_Y - BRANCH_OFFSET, safeState.sensorA, t("sim.label.sensor_a"));
            drawIndustrialSensor(SENSOR_X, MAIN_OUTPUT_CONVEYOR_Y + BRANCH_OFFSET, safeState.sensorB, t("sim.label.sensor_b"));

            // Boxing Stations (Downstream)
            drawBoxingStation(BIN_X, MAIN_OUTPUT_CONVEYOR_Y - BRANCH_OFFSET);
            drawBoxingStation(BIN_X, MAIN_OUTPUT_CONVEYOR_Y + BRANCH_OFFSET);

            // Bins (Visual Catchers under lines)
            ctx.fillStyle = 'rgba(59, 130, 246, 0.1)'; ctx.fillRect(BIN_X, MAIN_OUTPUT_CONVEYOR_Y - BRANCH_OFFSET + 20, BIN_WIDTH, 40);
            ctx.fillStyle = 'rgba(239, 68, 68, 0.1)'; ctx.fillRect(BIN_X, MAIN_OUTPUT_CONVEYOR_Y + BRANCH_OFFSET + 20, BIN_WIDTH, 40);

            // 3. ACTUATORS (Dynamic)
            drawRobotArm();
            drawDiverterGate();

            // 4. PARTS
            const drawPart = (p) => {
                // Assuming PART_WIDTH and PART_HEIGHT are defined elsewhere or passed
                const PART_WIDTH = 20;
                const PART_HEIGHT = 20;
                const COLOR_MAP = {
                    'TYPE_A': { color: '#2563EB', name: 'sim.part.type_a' }, // Blue
                    'TYPE_B': { color: '#DC2626', name: 'sim.part.type_b' }, // Red
                    'TYPE_C': { color: '#FBBF24', name: 'sim.part.type_c' }, // Yellow
                };

                const partInfo = COLOR_MAP[p.type] || { color: '#888', name: 'Unknown' };
                ctx.fillStyle = partInfo.color;
                ctx.fillRect(p.x, p.y, PART_WIDTH, PART_HEIGHT);
                ctx.strokeStyle = '#FFF'; ctx.strokeRect(p.x, p.y, PART_WIDTH, PART_HEIGHT);
                // Label
                ctx.fillStyle = 'white'; ctx.font = '9px Arial'; ctx.textAlign = 'center';
                // Try dynamic translation, fallback to part name key
                ctx.fillText(t(partInfo.name), p.x + PART_WIDTH / 2, p.y + PART_HEIGHT / 2 + 3);
            };

            if (inputPartRef.current) drawPart(inputPartRef.current);
            if (robotPartRef.current) {
                // Attach to robot gripper if held
                if (robotPartRef.current.held) {
                    // Assuming PART_WIDTH and PART_HEIGHT are defined elsewhere or passed
                    const PART_WIDTH = 20;
                    const PART_HEIGHT = 20;
                    robotPartRef.current.x = robotPosRef.current.x - PART_WIDTH / 2;
                    robotPartRef.current.y = robotPosRef.current.y - PART_HEIGHT / 2 + 5;
                }
                drawPart(robotPartRef.current);
            }
            outputPartsRef.current.forEach(drawPart);

            // 5. OVERLAY (Header/Status) 
            // Drawn by HTML overlay in return, but we can add canvas debug if needed.

            ctx.restore();
            animationRef.current.id = requestAnimationFrame(animate);
        };

        lastTimeRef.current = performance.now();
        animationRef.current.id = requestAnimationFrame(animate);

        return () => {
            window.removeEventListener('resize', resizeCanvas);
            if (animationRef.current.id) cancelAnimationFrame(animationRef.current.id);
        };

    }, [isRunning, safeActions, safeRefs, isPreview, t]); // Dependencies


    const displayMsg = resolveMessage(message);
    const isError = displayMsg && (displayMsg.includes('🚨') || displayMsg.includes('🔴'));

    return (
        <div ref={containerRef} className="w-full h-full relative bg-gray-900 group">
            {/* Header Overlay - Absolute Positioned to save space */}
            <div className="absolute top-0 left-0 w-full p-2 flex justify-between items-center pointer-events-none z-10 bg-gradient-to-b from-gray-900/80 to-transparent">
                <h2 className="text-sm font-bold text-indigo-300 px-2">{t("sim.label.header")}</h2>
                <div className={`px-2 py-0.5 rounded text-xs font-mono font-bold border ${isError ? 'bg-red-900/80 border-red-500 text-red-200' : 'bg-gray-800/80 border-gray-600 text-gray-300'}`}>
                    {displayMsg}
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
                {displayMsg}
            </div>
        </div>
    );
}
