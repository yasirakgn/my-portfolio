/* eslint-disable no-useless-escape */

import React, { useEffect, useRef, useState, useCallback } from "react";
import { Play, RotateCcw, StopCircle, Gauge, Boxes, Zap, User, CheckCircle, Home, Mail, Send, CheckCircle } from 'lucide-react';

/* -------------------------------------------------------
   NAVBAR
------------------------------------------------------- */
function Navbar({ setPage, currentPage }) {
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

/* -------------------------------------------------------
   SİMÜLASYON SAYFASII
------------------------------------------------------- */
function SimulationPage() {
  // --- SABİTLER ---
  const INPUT_CONVEYOR_Y = 300;
  const MAIN_OUTPUT_CONVEYOR_Y = 150;
  const BRANCH_OFFSET = 60;
  const ROBOT_BASE_X = 150;
  const ROBOT_BASE_Y = 250;
  const INPUT_CONVEYOR_START_X = ROBOT_BASE_X + 50;
  const INPUT_PICKUP_X = 250;
  const OUTPUT_DROP_X = 350;
  const DIVERTER_X = 550;
  const CONVEYOR_SPEED = 2;
  const BRANCH_A_Y = MAIN_OUTPUT_CONVEYOR_Y - BRANCH_OFFSET;
  const BRANCH_B_Y = MAIN_OUTPUT_CONVEYOR_Y + BRANCH_OFFSET;
  const SENSOR_X = 750;
  const BIN_X = SENSOR_X + 150;
  const PART_WIDTH = 30;
  const PART_HEIGHT = 30;
  const BIN_WIDTH = 50;
  const ORIGINAL_WIDTH = 800;
  const ORIGINAL_HEIGHT = 400;
  const COLOR_MAP = {
    "MAVI": { color: "#2563EB", type: "TYPE_A", name: "Mavi" },
    "KIRMIZI": { color: "#DC2626", type: "TYPE_B", name: "Kırmızı" },
    "YESIL": { color: "#10B981", type: "TYPE_A", name: "Yeşil" },
    "SARI": { color: "#F59E0B", type: "TYPE_B", name: "Sarı" },
    "MOR": { color: "#9333EA", type: "TYPE_A", name: "Mor" },
  };
  const DEFAULT_PART_QUEUE_TEXT = "Mavi, Kırmızı, Yeşil, Mavi, Sarı, Kırmızı, Mor";

  const distance = (a, b) => Math.sqrt((a.x - b.x) ** 2 + (a.y - b.y) ** 2);

  const canvasRef = useRef(null);
  const animationRef = useRef(null);
  const containerRef = useRef(null);
  const scaleFactorRef = useRef(1);
  const [isRunning, setIsRunning] = useState(false);
  const [step, setStep] = useState(0);
  const [cycleCount, setCycleCount] = useState(0);
  const [finishedCount, setFinishedCount] = useState(0);
  const [message, setMessage] = useState("Üretim planını düzenleyin ve başlamak için START'a basın.");
  const [partQueueText, setPartQueueText] = useState(DEFAULT_PART_QUEUE_TEXT);
  const robotPosRef = useRef({ x: ROBOT_BASE_X, y: ROBOT_BASE_Y });
  const targetRef = useRef({ x: ROBOT_BASE_X, y: ROBOT_BASE_Y });
  const robotPartRef = useRef(null);
  const outputPartsRef = useRef([]);
  const inputPartRef = useRef(null);
  const partRecipeRef = useRef([]);
  const [validRecipeLength, setValidRecipeLength] = useState(0);

  const initializeParts = useCallback(() => {
    const partsText = partQueueText.toUpperCase().split(',').map(s => s.trim()).filter(s => s.length > 0);
    const fullRecipe = [];
    const invalidParts = [];
    for (const partName of partsText) {
      const partInfo = COLOR_MAP[partName];
      if (partInfo) fullRecipe.push({ ...partInfo });
      else invalidParts.push(partName);
    }
    partRecipeRef.current = fullRecipe;
    setValidRecipeLength(fullRecipe.length);
    if (invalidParts.length > 0) {
      const availableNames = Object.values(COLOR_MAP).map(v => v.name).join(', ');
      setMessage(`🚨 Üretim planında GEÇERSİZ renkler: ${invalidParts.join(', ')}. Sadece: ${availableNames}`);
    } else if (fullRecipe.length > 0) {
      setMessage(`Üretim planı yüklendi: ${fullRecipe.length} parça. Sistem hazır.`);
    } else {
      setMessage("Üretim planı boş veya geçersiz.");
    }
    robotPartRef.current = null;
    outputPartsRef.current = [];
    inputPartRef.current = null;
  }, [partQueueText]);

  useEffect(() => { initializeParts(); }, [initializeParts]);

  const spawnNewPart = useCallback(() => {
    if (partRecipeRef.current.length > 0) {
      const nextPart = partRecipeRef.current.shift();
      inputPartRef.current = {
        x: INPUT_CONVEYOR_START_X,
        y: INPUT_CONVEYOR_Y - PART_HEIGHT,
        width: PART_WIDTH,
        height: PART_HEIGHT,
        color: nextPart.color,
        type: nextPart.type,
        name: nextPart.name,
        held: false,
        id: Date.now() + Math.random(),
        counted: false,
      };
      setMessage(`Yeni parça (${nextPart.name}) giriş konveyöründe.`);
    }
  }, []);

  const moveRobotTo = useCallback((x, y) => { targetRef.current = { x, y }; }, []);

  const plcStepsRef = useRef({
    0: () => {
      if (robotPartRef.current === null && inputPartRef.current === null && partRecipeRef.current.length > 0) spawnNewPart();
      if (inputPartRef.current && inputPartRef.current.x >= INPUT_PICKUP_X) setStep(10);
      else if (partRecipeRef.current.length === 0 && outputPartsRef.current.every(p => !p.isMoving && p.counted)) {
        setMessage("Tüm parçalar işlendi."); setIsRunning(false);
      }
    },
    10: () => {
      if (!inputPartRef.current) return setStep(0);
      moveRobotTo(inputPartRef.current.x + PART_WIDTH / 2, inputPartRef.current.y + PART_HEIGHT / 2);
      if (distance(robotPosRef.current, targetRef.current) < 5) setStep(20);
    },
    20: () => {
      if (inputPartRef.current) {
        robotPartRef.current = { ...inputPartRef.current, held: true };
        inputPartRef.current = null;
        setMessage(`Parça (${robotPartRef.current.name}) kavrandı.`);
        setTimeout(() => setStep(30), 300);
      } else setStep(0);
    },
    30: () => {
      moveRobotTo(OUTPUT_DROP_X, MAIN_OUTPUT_CONVEYOR_Y - PART_HEIGHT / 2);
      if (distance(robotPosRef.current, targetRef.current) < 5) setStep(40);
    },
    40: () => {
      if (robotPartRef.current) {
        const partToDrop = robotPartRef.current;
        const isTypeA = partToDrop.type === 'TYPE_A';
        outputPartsRef.current.push({
          ...partToDrop,
          held: false,
          x: OUTPUT_DROP_X - PART_WIDTH / 2,
          y: MAIN_OUTPUT_CONVEYOR_Y - PART_HEIGHT,
          isMoving: true,
          conveyorPhase: 'MAIN',
          conveyorId: isTypeA ? 'A' : 'B',
          targetY: isTypeA ? (MAIN_OUTPUT_CONVEYOR_Y - BRANCH_OFFSET - PART_HEIGHT) : (MAIN_OUTPUT_CONVEYOR_Y + BRANCH_OFFSET - PART_HEIGHT),
          diverterProgress: 0,
          counted: false,
        });
        robotPartRef.current = null;
        setMessage(`Parça (${partToDrop.name}) ana konveyöre bırakıldı.`);
        setTimeout(() => setStep(50), 500);
      } else setStep(0);
    },
    50: () => {
      moveRobotTo(ROBOT_BASE_X, ROBOT_BASE_Y);
      if (distance(robotPosRef.current, targetRef.current) < 5) {
        setCycleCount(c => c + 1);
        setStep(0);
        setMessage("Döngü tamamlandı. Yeni parça bekleniyor.");
      }
    },
  });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");

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

    const updateConveyorMovement = () => {
      const nextOutputParts = [];
      if (inputPartRef.current && inputPartRef.current.x < INPUT_PICKUP_X) inputPartRef.current.x += CONVEYOR_SPEED * 0.5;

      outputPartsRef.current.forEach(p => {
        if (!p.isMoving) { nextOutputParts.push(p); return; }
        if (p.conveyorPhase === 'MAIN') {
          p.x += CONVEYOR_SPEED;
          if (p.x >= DIVERTER_X - PART_WIDTH / 2) {
            p.conveyorPhase = 'DIVERTER_MOVE'; p.startY = p.y; p.diverterProgress = 0;
          }
        } else if (p.conveyorPhase === 'DIVERTER_MOVE') {
          p.diverterProgress += 0.05;
          p.x += CONVEYOR_SPEED * 0.5;
          p.y = p.startY + (p.targetY - p.startY) * Math.min(p.diverterProgress, 1);
          if (p.diverterProgress >= 1) { p.conveyorPhase = 'BRANCH'; p.y = p.targetY; }
        } else if (p.conveyorPhase === 'BRANCH') {
          p.x += CONVEYOR_SPEED;
          if (p.x >= BIN_X) {
            p.isMoving = false;
            p.x = BIN_X + (BIN_WIDTH / 2) - (PART_WIDTH / 2);
            if (!p.counted) { p.counted = true; setFinishedCount(c => c + 1); setMessage(`📦 Parça (${p.name}) Kutu ${p.conveyorId}'ye yerleştirildi.`); }
          }
        }
        nextOutputParts.push(p);
      });
      outputPartsRef.current = nextOutputParts;
    };

    const animate = () => {
      robotPosRef.current.x += (targetRef.current.x - robotPosRef.current.x) * 0.1;
      robotPosRef.current.y += (targetRef.current.y - robotPosRef.current.y) * 0.1;
      animationRef.current.offset = (animationRef.current.offset + CONVEYOR_SPEED) % 60;

      ctx.clearRect(0, 0, canvas.width, canvas.height);
      const S = scaleFactorRef.current;
      ctx.save(); ctx.scale(S, S);
      drawConveyors();
      if (isRunning) updateConveyorMovement();
      drawParts();
      drawRobot();
      if (isRunning) {
        const currentStepLogic = plcStepsRef.current[step];
        if (currentStepLogic) currentStepLogic();
      }
      ctx.restore();
      animationRef.current.id = requestAnimationFrame(animate);
    };

    animationRef.current = { id: null, offset: 0 };
    animate();

    return () => {
      if (animationRef.current && animationRef.current.id) cancelAnimationFrame(animationRef.current.id);
      window.removeEventListener('resize', resizeCanvas);
    };
  }, [isRunning, step, spawnNewPart, moveRobotTo]);

  const handleStart = () => {
    initializeParts();
    setTimeout(() => {
      if (partRecipeRef.current.length === 0) return setMessage("🔴 HATA: Üretim planı boş veya geçersiz!");
      if (!isRunning) { setIsRunning(true); if (step !== 0) setStep(0); setMessage("Simülasyon BAŞLADI."); }
    }, 50);
  };
  const handleStop = () => { setIsRunning(false); setMessage("🔴 Simülasyon DURDURULDU."); };
  const handleReset = () => {
    setIsRunning(false); setStep(0); setCycleCount(0); setFinishedCount(0);
    setPartQueueText(DEFAULT_PART_QUEUE_TEXT);
    robotPosRef.current = { x: ROBOT_BASE_X, y: ROBOT_BASE_Y };
    targetRef.current = { x: ROBOT_BASE_X, y: ROBOT_BASE_Y };
    setTimeout(() => initializeParts(), 0);
  };

  const StepDisplay = () => {
    let description = "Bilinmeyen Adım";
    if (!isRunning && step === 0 && partRecipeRef.current.length === 0 && finishedCount > 0) description = "Tüm parçalar işlendi.";
    else if (!isRunning && step === 0) description = "Başlatılmayı bekliyor.";
    else {
      const map = { 0:"Başlangıç: Yeni parça bekleniyor.", 10:"Parçaya hareket.", 20:"Parça kavranıyor.", 30:"Bırakma noktasına hareket.", 40:"Parça bırakılıyor.", 50:"Ana pozisyona dönüş." };
      description = map[step] || "Bilinmeyen Adım";
    }
    return (
      <div className="font-mono text-lg text-cyan-300 p-2 bg-gray-800 rounded-md shadow-inner shadow-cyan-900/50">
        <span className="text-gray-400 mr-2">Adım {step}:</span><span>{description}</span>
      </div>
    );
  };

  const StatCard = ({ title, value, colorClass, Icon, iconColor }) => (
    <div className="p-4 bg-gray-700 rounded-xl shadow-xl border-l-4 border-gray-600">
      <div className="flex justify-between items-center">
        <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">{title}</p>
        <Icon className={`w-5 h-5 ${iconColor}`} />
      </div>
      <p className={`text-3xl font-extrabold mt-1 ${colorClass}`}>{value}</p>
    </div>
  );

  return (
    <div className="max-w-6xl mx-auto flex flex-col lg:flex-row gap-6">
      {/* Sol Panel */}
      <div className="flex-1 lg:flex-shrink-0 lg:w-1/3 bg-gray-800 p-5 rounded-xl shadow-2xl border border-gray-700 space-y-5 flex flex-col">
        <h2 className="text-xl font-bold text-indigo-300 pb-2 border-b border-gray-700 flex items-center">
          <Gauge className="w-6 h-6 mr-2 text-indigo-400" /> PERFORMANS
        </h2>
        <div className="grid grid-cols-2 gap-4 mb-2">
          <StatCard title="Döngü Sayısı" value={cycleCount} colorClass="text-white" Icon={RotateCcw} iconColor="text-indigo-400" />
          <StatCard title="Bitmiş Ürün" value={finishedCount} colorClass="text-green-400" Icon={Boxes} iconColor="text-green-400" />
          <div className="col-span-2">
            <StatCard title="Kalan Parça" value={partRecipeRef.current.length} colorClass="text-yellow-400" Icon={User} iconColor="text-yellow-400" />
          </div>
        </div>
        <h2 className="text-xl font-bold text-indigo-300 pb-2 border-b border-gray-700 flex items-center">
          <Zap className="w-6 h-6 mr-2 text-indigo-400" /> PLC Adımı
        </h2>
        <StepDisplay />
        <h2 className="text-xl font-bold text-indigo-300 pb-2 border-b border-gray-700 mt-4 flex items-center">
          <Boxes className="w-6 h-6 mr-2 text-indigo-400" /> ÜRETİM PLANI
        </h2>
        <div className="space-y-2">
          <p className="text-xs text-gray-400 italic">Virgülle ayırarak renkleri girin (Mavi, Kırmızı, Yeşil, Sarı, Mor).</p>
          <textarea
            value={partQueueText}
            onChange={(e) => { setPartQueueText(e.target.value); if (!isRunning) initializeParts(); }}
            rows="4"
            placeholder="Örn: Mavi, Kırmızı, Sarı..."
            className="w-full font-mono text-sm p-2 bg-gray-900 text-yellow-300 rounded-md border border-gray-700 focus:ring-indigo-500 focus:border-indigo-500"
          />
          <div className={`flex items-center text-sm font-semibold p-2 rounded-md ${validRecipeLength > 0 ? 'bg-green-800/50 text-green-300' : 'bg-red-800/50 text-red-300'}`}>
            <CheckCircle className="w-4 h-4 mr-2" />
            Geçerli Parça Sayısı: {validRecipeLength}
          </div>
        </div>
        <h2 className="text-xl font-bold text-indigo-300 pb-2 border-b border-gray-700 mt-4 flex items-center">
          <Zap className="w-6 h-6 mr-2 text-indigo-400" /> Kontroller
        </h2>
        <div className="flex flex-col sm:flex-row gap-3">
          <button
            onClick={handleStart}
            disabled={isRunning || validRecipeLength === 0}
            className={`flex-1 w-full py-4 rounded-lg font-extrabold text-lg transition-all duration-300 flex items-center justify-center space-x-2 
              ${isRunning || validRecipeLength === 0 ? 'bg-gray-600 text-gray-400 cursor-not-allowed shadow-inner' : 'bg-green-600 text-white shadow-lg shadow-green-900/50 hover:bg-green-700 hover:scale-[1.02]'}`}>
            <Play className="w-6 h-6" /> <span>START</span>
          </button>
          <button
            onClick={handleStop}
            disabled={!isRunning}
            className={`flex-1 w-full py-4 rounded-lg font-extrabold text-lg transition-all duration-300 flex items-center justify-center space-x-2 
              ${!isRunning ? 'bg-gray-600 text-gray-400 cursor-not-allowed shadow-inner' : 'bg-red-600 text-white shadow-lg shadow-red-900/50 hover:bg-red-700 hover:scale-[1.02]'}`}>
            <StopCircle className="w-6 h-6" /> <span>DURDUR</span>
          </button>
        </div>
        <button
          onClick={handleReset}
          className="w-full mt-3 py-4 rounded-lg font-bold transition-all duration-300 bg-gray-600 text-gray-100 shadow-md hover:bg-gray-500 hover:scale-[1.01] flex items-center justify-center space-x-2 text-lg">
          <RotateCcw className="w-5 h-5" /> <span>SIFIRLA</span>
        </button>
      </div>

      {/* Sağ Panel */}
      <div ref={containerRef} className="flex-1 bg-gray-800 p-5 rounded-xl shadow-2xl border border-gray-700 space-y-4 flex flex-col">
        <h2 className="text-xl font-bold text-indigo-300 pb-2 border-b border-gray-700">CANVAS SİMÜLASYON</h2>
        <div className="w-full border-4 border-gray-700 shadow-inner rounded-lg overflow-hidden bg-gray-900 flex-grow">
          <canvas ref={canvasRef} style={{ display: 'block', width: '100%', height: '100%', backgroundColor: '#1F2937' }} />
        </div>
        <p className={`p-3 text-center rounded-lg font-semibold ${message.startsWith('🚨') || message.startsWith('🔴') ? 'bg-red-700/50 text-red-300 border border-red-500' : 'bg-indigo-900/50 text-indigo-300'}`}>
          {message}
        </p>
      </div>
    </div>
  );
}

/* -------------------------------------------------------
   İLETİŞİM SAYFASI: /api/contact’a POST
------------------------------------------------------- */
function ContactForm() {
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [status, setStatus] = useState("");

  const onChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    setStatus("Gönderiliyor...");

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      if (res.ok) {
        setStatus("✅ Mesaj başarıyla gönderildi!");
        setForm({ name: "", email: "", message: "" });
      } else {
        const text = await res.text();
        setStatus("❌ Hata: " + text);
      }
    } catch (err) {
      setStatus("❌ Sunucu hatası: " + err.message);
    }
  };

  return (
    <div className="max-w-xl mx-auto bg-gray-800 p-6 rounded-xl shadow-xl border border-gray-700">
      <h2 className="text-2xl font-bold text-indigo-400 mb-4 flex items-center justify-center gap-2">
        <Mail className="w-6 h-6 text-cyan-400" />
        İletişim Formu
      </h2>

      <form onSubmit={onSubmit} className="space-y-4">
        <input
          type="text"
          name="name"
          placeholder="Adınız"
          value={form.name}
          onChange={onChange}
          required
          className="w-full p-3 rounded-md bg-gray-900 text-gray-100 border border-gray-700"
        />

        <input
          type="email"
          name="email"
          placeholder="E-posta (opsiyonel)"
          value={form.email}
          onChange={onChange}
          className="w-full p-3 rounded-md bg-gray-900 text-gray-100 border border-gray-700"
        />

        <textarea
          name="message"
          placeholder="Mesajınız"
          value={form.message}
          onChange={onChange}
          required
          rows="5"
          className="w-full p-3 rounded-md bg-gray-900 text-gray-100 border border-gray-700"
        />

        <button
          type="submit"
          className="w-full py-3 bg-cyan-600 hover:bg-cyan-700 transition rounded-lg font-bold text-lg text-white flex justify-center items-center gap-2"
        >
          <Send className="w-5 h-5" /> Gönder
        </button>
      </form>

      {status && (
        <p className="mt-4 text-center text-sm text-gray-300 bg-gray-700/50 p-2 rounded-md">
          {status}
        </p>
      )}
    </div>
  );
}

// ---------------------------
// ANA UYGULAMA
// ---------------------------
export default function App() {
  const [page, setPage] = useState("contact");

  return (
    <div className="bg-gray-900 text-gray-100 min-h-screen p-6 font-sans">
      <header className="text-center mb-8">
        <h1 className="text-4xl font-extrabold text-indigo-400 mb-2">
          Portföy İletişim Sayfası
        </h1>
        <p className="text-gray-400">
          Brevo API entegrasyonu ile iletişim formu
        </p>
      </header>

      {page === "contact" && <ContactForm />}

      <footer className="mt-10 text-center text-gray-500 text-sm">
        <CheckCircle className="inline w-4 h-4 text-green-400 mr-1" />
        Powered by Brevo API & React
      </footer>
    </div>
  );
}

/* -------------------------------------------------------
   APP (sayfa yönlendirme)
------------------------------------------------------- */
export default function App() {
  const [page, setPage] = useState('home');
  return (
    <div className="bg-gray-900 text-gray-100 min-h-screen p-4 sm:p-6 font-sans">
      <header className="text-center p-4 bg-gray-800 shadow-2xl rounded-xl mb-6 border-b-4 border-indigo-600">
        <h1 className="text-4xl sm:text-5xl font-extrabold text-indigo-400 flex items-center justify-center mb-1">
          <Zap className="w-12 h-12 mr-3 text-cyan-400 animate-pulse" />
          OTOMASYON KONTROL MERKEZİ
        </h1>
        <p className="text-md sm:text-lg text-gray-400 mt-2 font-light">Robotik Ayırma ve Yönlendirme Simülasyonu</p>
      </header>
      <Navbar setPage={setPage} currentPage={page} />
      <main>
        {page === 'home' && <SimulationPage />}
        {page === 'contact' && <ContactPage />}
      </main>
    </div>
  );
}
