<!DOCTYPE html>
<html lang="tr">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Kompleks Otomasyon Kontrol Merkezi</title>
    <script src="https://cdn.tailwindcss.com"></script>
    <style>
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap');
        body {
            font-family: 'Inter', sans-serif;
            overflow: hidden;
        }
        input[type=range]::-webkit-slider-thumb {
            -webkit-appearance: none;
            height: 24px;
            width: 24px;
            border-radius: 50%;
            background: #60A5FA;
            cursor: pointer;
            margin-top: -8px;
            box-shadow: 0 0 10px rgba(96, 165, 250, 0.7);
        }
    </style>
</head>
<body class="bg-gray-900 text-gray-100 flex items-center justify-center min-h-screen">

    <div class="w-full max-w-8xl h-screen flex flex-col p-4 sm:p-6 gap-6">
        <header class="text-center bg-gray-800/50 backdrop-blur-sm shadow-2xl rounded-xl p-4 border-b-2 border-indigo-600">
            <h1 class="text-3xl sm:text-4xl font-extrabold text-indigo-400 flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="mr-3 text-cyan-400 animate-pulse"><path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"></path></svg>
                KOMPLEKS OTOMASYON KONTROL MERKEZİ
            </h1>
        </header>

        <div class="flex-grow flex flex-col lg:flex-row gap-6 min-h-0">
            <!-- Sol Panel -->
            <div class="w-full lg:w-[400px] flex-shrink-0 bg-gray-800/50 backdrop-blur-sm p-5 rounded-xl shadow-2xl border border-gray-700 flex flex-col gap-4 overflow-y-auto">
                <div>
                    <h2 class="text-lg font-bold text-indigo-300 pb-2 mb-3 border-b border-gray-700 flex items-center justify-between">
                        <div class="flex items-center">
                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="mr-2"><path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"></path></svg> 
                            SİSTEM KONTROLÜ
                        </div>
                        <div class="flex items-center gap-2">
                            <span class="text-xs font-mono">DURUM:</span>
                            <div id="statusLight" class="w-4 h-4 rounded-full bg-yellow-500 shadow-[0_0_10px_yellow]"></div>
                        </div>
                    </h2>
                    <div class="flex gap-3">
                        <button id="startButton" class="flex-1 py-3 rounded-lg font-bold text-lg transition-all duration-300 flex items-center justify-center space-x-2 bg-green-600 text-white shadow-lg shadow-green-900/50 hover:bg-green-500">
                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="5 3 19 12 5 21 5 3"></polygon></svg><span>BAŞLAT</span>
                        </button>
                        <button id="stopButton" class="flex-1 py-3 rounded-lg font-bold text-lg transition-all duration-300 flex items-center justify-center space-x-2 bg-gray-600 text-gray-400 cursor-not-allowed shadow-inner" disabled>
                           <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><rect x="9" y="9" width="6" height="6"></rect></svg><span>DURDUR</span>
                        </button>
                    </div>
                     <button id="resetButton" class="w-full mt-3 py-3 rounded-lg font-bold transition-all duration-300 bg-gray-600 text-gray-100 shadow-md hover:bg-gray-500 flex items-center justify-center space-x-2">
                        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 12a9 9 0 0 0-9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"></path><path d="M3 3v5h5"></path><path d="M3 12a9 9 0 0 0 9 9 9.75 9.75 0 0 0 6.74-2.74L21 16"></path><path d="M21 21v-5h-5"></path></svg><span>SIFIRLA</span>
                    </button>
                </div>

                <div>
                    <h2 class="text-lg font-bold text-indigo-300 pb-2 mb-2 border-b border-gray-700 flex items-center">
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="mr-2"><path d="m12 12-2-2 2-2 2 2-2 2Z"></path><path d="M12 12v6"></path><path d="M12 6V3"></path><path d="M12 21v-3"></path><path d="M20.4 16.4-19 15"></path><path d="m5 9 1.4-1.4"></path><path d="m19 9-1.4-1.4"></path><path d="M5 15l1.4 1.4"></path><path d="M20.4 7.6 19 9"></path></svg> SİMÜLASYON HIZI
                    </h2>
                     <div class="flex items-center gap-4 px-2">
                         <span class="text-sm text-gray-400">Yavaş</span>
                         <input id="speedControl" type="range" min="0.5" max="3" value="1.5" step="0.1" class="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer">
                         <span class="text-sm text-gray-400">Hızlı</span>
                     </div>
                     <p class="text-center font-mono text-cyan-400 mt-1">Hız: <span id="speedValue">1.5</span>x</p>
                </div>

                 <div>
                    <h2 class="text-lg font-bold text-indigo-300 pb-2 mb-3 border-b border-gray-700 flex items-center">
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="mr-2"><path d="M3 3v18h18"></path><path d="m19 9-5 5-4-4-3 3"></path></svg> VERİMLİLİK RAPORU
                    </h2>
                     <div class="grid grid-cols-2 gap-3">
                         <div class="p-3 bg-gray-700/50 rounded-lg text-center"><p class="text-xs text-gray-400">VERİMLİLİK</p><p id="yieldRate" class="text-2xl font-bold text-cyan-400">-%</p></div>
                         <div class="p-3 bg-gray-700/50 rounded-lg text-center"><p class="text-xs text-gray-400">TOPLAM ÜRÜN</p><p id="totalParts" class="text-2xl font-bold text-white">0</p></div>
                         <div class="p-3 bg-gray-700/50 rounded-lg text-center"><p class="text-xs text-gray-400">SAĞLAM</p><p id="goodParts" class="text-2xl font-bold text-green-400">0</p></div>
                         <div class="p-3 bg-gray-700/50 rounded-lg text-center"><p class="text-xs text-gray-400">HATALI</p><p id="defectiveParts" class="text-2xl font-bold text-red-400">0</p></div>
                     </div>
                 </div>

                 <div>
                    <h2 class="text-lg font-bold text-indigo-300 pb-2 mb-3 border-b border-gray-700 flex items-center">
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="mr-2"><rect x="1.7" y="5.7" width="20.6" height="12.6" rx="2"></rect><path d="m5.7 5.7-2 6.3"></path><path d="m18.3 5.7 2 6.3"></path><path d="M12 5.7v12.6"></path></svg> ÜRETİM PLANI
                    </h2>
                    <textarea id="partQueueText" rows="3" class="w-full font-mono text-sm p-2 bg-gray-900 text-yellow-300 rounded-md border border-gray-600 focus:ring-indigo-500 focus:border-indigo-500"></textarea>
                </div>
            </div>

            <!-- Sağ Panel -->
            <div class="flex-grow bg-gray-800 p-4 rounded-xl shadow-2xl border border-gray-700 flex flex-col min-h-0">
                <div id="container" class="w-full h-full border-2 border-gray-700 shadow-inner rounded-lg overflow-hidden bg-gray-900 flex items-center justify-center relative">
                    <canvas id="simulationCanvas" style="display: block;"></canvas>
                    <p id="message" class="absolute bottom-4 left-4 right-4 p-3 text-center rounded-lg font-semibold bg-indigo-900/80 backdrop-blur-sm text-indigo-200 border border-indigo-500/50 shadow-lg">
                        Üretim planını düzenleyin ve BAŞLAT'a basın.
                    </p>
                </div>
            </div>
        </div>
    </div>

    <script>
    // --- SABİTLER ---
    const ORIGINAL_HEIGHT = 500, ORIGINAL_WIDTH = 900;
    const PART_WIDTH = 30, PART_HEIGHT = 30, BIN_WIDTH = 50;
    let conveyorSpeed = 1.5;

    const ROBOT_BASE_X = 150, ROBOT_BASE_Y = 350;
    const INPUT_CONVEYOR_Y = 450, MAIN_CONVEYOR_Y = 250, REJECT_CONVEYOR_Y = 150;
    const BRANCH_A_Y = 100, BRANCH_B_Y = 400;

    const INPUT_CONVEYOR_START_X = ROBOT_BASE_X + 50; 
    const INPUT_PICKUP_X = 250, OUTPUT_DROP_X = 350;
    const QC_SCAN_X = 450, LIFT_X = 600, SENSOR_X = 750, BIN_X = SENSOR_X + 100;
    const SCRAP_BIN_X = QC_SCAN_X;
    
    const DEFECT_CHANCE = 0.15; // %15 Hata olasılığı

    const COLOR_MAP = { "MAVI": { color: "#3B82F6", type: "TYPE_A", name: "Mavi" }, "KIRMIZI": { color: "#EF4444", type: "TYPE_B", name: "Kırmızı" }, "YESIL": { color: "#22C55E", type: "TYPE_A", name: "Yeşil" }, "SARI": { color: "#F59E0B", type: "TYPE_B", name: "Sarı" }, "MOR": { color: "#A855F7", type: "TYPE_A", name: "Mor" } };
    const DEFAULT_PART_QUEUE_TEXT = "Mavi, Kırmızı, Yeşil, Mavi, Sarı, Kırmızı, Mor, Kırmızı, Yeşil, Mavi";

    // --- DOM Elementleri ---
    const canvas = document.getElementById('simulationCanvas'), ctx = canvas.getContext('2d');
    const container = document.getElementById('container');
    const startButton = document.getElementById('startButton'), stopButton = document.getElementById('stopButton'), resetButton = document.getElementById('resetButton');
    const speedControl = document.getElementById('speedControl'), speedValue = document.getElementById('speedValue');
    const partQueueTextElement = document.getElementById('partQueueText');
    const yieldRateEl = document.getElementById('yieldRate'), totalPartsEl = document.getElementById('totalParts'), goodPartsEl = document.getElementById('goodParts'), defectivePartsEl = document.getElementById('defectiveParts');
    const messageElement = document.getElementById('message'), statusLight = document.getElementById('statusLight');

    // --- Simülasyon Değişkenleri ---
    let isRunning = false, step = 0;
    let scaleFactor = 1, animationOffset = 0;
    let robotPos = { x: ROBOT_BASE_X, y: ROBOT_BASE_Y }, targetPos = { x: ROBOT_BASE_X, y: ROBOT_BASE_Y };
    let robotPart = null, outputParts = [], inputPart = null, partRecipe = [];
    let lift = { y: MAIN_CONVEYOR_Y, targetY: MAIN_CONVEYOR_Y, status: 'idle', part: null };
    let particles = [], qcScanner = { pos: 0, dir: 1 };
    let partStats = { total: 0, good: 0, defective: 0 };
    
    // --- Utility & Ses Motoru ---
    const distance = (a, b) => Math.sqrt((a.x - b.x) ** 2 + (a.y - b.y) ** 2);
    const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    function playSound(type) {
        if (audioCtx.state === 'suspended') audioCtx.resume();
        const osc = audioCtx.createOscillator(), gain = audioCtx.createGain();
        osc.connect(gain); gain.connect(audioCtx.destination);
        gain.gain.setValueAtTime(0.1, audioCtx.currentTime);
        if (type === 'reject') {
            osc.type = 'square'; osc.frequency.setValueAtTime(100, audioCtx.currentTime);
            gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.3);
        } else if (type === 'scan') {
            osc.type = 'sawtooth'; osc.frequency.setValueAtTime(1500, audioCtx.currentTime);
            osc.frequency.exponentialRampToValueAtTime(500, audioCtx.currentTime + 0.2);
            gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.2);
        } else if (type === 'binned') {
             osc.type = 'sine'; osc.frequency.setValueAtTime(600, audioCtx.currentTime);
             gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.2);
        }
        osc.start(); osc.stop(audioCtx.currentTime + 0.3);
    }
    
    // --- UI Güncelleme ---
    function updateUI() {
        totalPartsEl.textContent = partStats.total;
        goodPartsEl.textContent = partStats.good;
        defectivePartsEl.textContent = partStats.defective;
        yieldRateEl.textContent = partStats.total > 0 ? `${((partStats.good / partStats.total) * 100).toFixed(1)}%` : `-%`;
        
        startButton.disabled = isRunning;
        stopButton.disabled = !isRunning;
        startButton.className = `flex-1 py-3 rounded-lg font-bold text-lg transition-all duration-300 flex items-center justify-center space-x-2 ${isRunning ? 'bg-gray-600 text-gray-400 cursor-not-allowed shadow-inner' : 'bg-green-600 text-white shadow-lg shadow-green-900/50 hover:bg-green-500'}`;
        stopButton.className = `flex-1 py-3 rounded-lg font-bold text-lg transition-all duration-300 flex items-center justify-center space-x-2 ${!isRunning ? 'bg-gray-600 text-gray-400 cursor-not-allowed shadow-inner' : 'bg-red-600 text-white shadow-lg shadow-red-900/50 hover:bg-red-500'}`;
        
        if (isRunning) { statusLight.className = 'w-4 h-4 rounded-full bg-green-500 shadow-[0_0_10px_#22c55e] animate-pulse'; }
        else if (partStats.total > 0 && partRecipe.length === 0 && outputParts.length === 0 && !lift.part && !inputPart && !robotPart) { statusLight.className = 'w-4 h-4 rounded-full bg-blue-500 shadow-[0_0_10px_#3b82f6]'; }
        else if (!stopButton.disabled) { statusLight.className = 'w-4 h-4 rounded-full bg-red-500 shadow-[0_0_10px_#ef4444]'; }
        else { statusLight.className = 'w-4 h-4 rounded-full bg-yellow-500 shadow-[0_0_10px_#f59e0b]'; }
    }
    function showMessage(msg, isError = false) {
        messageElement.textContent = msg;
        messageElement.className = `absolute bottom-4 left-4 right-4 p-3 text-center rounded-lg font-semibold backdrop-blur-sm shadow-lg transition-all duration-300 ${isError ? 'bg-red-800/80 text-red-200 border border-red-500/50' : 'bg-indigo-900/80 text-indigo-200 border border-indigo-500/50'}`;
    }
    
    // --- Efekt ve Parçacık Yönetimi ---
    function createParticle(x, y, color) {
        for(let i=0; i<10; i++) {
            particles.push({
                x, y,
                vx: (Math.random() - 0.5) * 3,
                vy: (Math.random() - 0.5) * 3 - 2,
                life: 30,
                color
            });
        }
    }
    
    function updateAndDrawParticles() {
        particles = particles.filter(p => p.life > 0);
        particles.forEach(p => {
            p.x += p.vx;
            p.y += p.vy;
            p.vy += 0.1; // Gravity
            p.life--;
            ctx.globalAlpha = p.life / 30;
            ctx.fillStyle = p.color;
            ctx.beginPath();
            ctx.arc(p.x, p.y, 2, 0, Math.PI * 2);
            ctx.fill();
        });
        ctx.globalAlpha = 1;
    }

    // --- Çizim Fonksiyonları ---
    function drawScene() {
        ctx.fillStyle = "#111827"; ctx.fillRect(0, 0, ORIGINAL_WIDTH, ORIGINAL_HEIGHT);
        ctx.strokeStyle = "rgba(255, 255, 255, 0.05)";
        for(let i=0; i<ORIGINAL_WIDTH; i+=50) { ctx.beginPath(); ctx.moveTo(i,0); ctx.lineTo(i,ORIGINAL_HEIGHT); ctx.stroke(); }
        for(let i=0; i<ORIGINAL_HEIGHT; i+=50) { ctx.beginPath(); ctx.moveTo(0,i); ctx.lineTo(ORIGINAL_WIDTH,i); ctx.stroke(); }

        const drawConveyorLine = (startX, y, endX) => {
            ctx.fillStyle = "#4B5563";
            ctx.fillRect(startX, y + 20, endX - startX, 5);
            ctx.fillStyle = "#374151";
            ctx.fillRect(startX, y, endX - startX, 20);
            const segmentLength = 40;
            for (let i = startX; i < endX; i += segmentLength) {
                const rollerX = i + (animationOffset * 0.5) % segmentLength;
                ctx.fillStyle = "#2D3748";
                ctx.fillRect(rollerX, y, 2, 20);
            }
        };
        drawConveyorLine(0, INPUT_CONVEYOR_Y, INPUT_PICKUP_X + 50);
        drawConveyorLine(OUTPUT_DROP_X - 50, MAIN_CONVEYOR_Y, LIFT_X);
        drawConveyorLine(QC_SCAN_X, REJECT_CONVEYOR_Y, QC_SCAN_X + 150);
        drawConveyorLine(LIFT_X, BRANCH_A_Y, BIN_X + BIN_WIDTH);
        drawConveyorLine(LIFT_X, BRANCH_B_Y, BIN_X + BIN_WIDTH);
    }
    function drawQCStation() {
        const x = QC_SCAN_X - 20;
        ctx.fillStyle = "#374151"; ctx.fillRect(x, MAIN_CONVEYOR_Y - 50, 40, 50);
        ctx.fillStyle = "#111827"; ctx.fillRect(x+5, MAIN_CONVEYOR_Y - 45, 30, 30);
        qcScanner.pos += qcScanner.dir * conveyorSpeed * 0.5;
        if(qcScanner.pos > 30 || qcScanner.pos < 0) qcScanner.dir *= -1;
        ctx.fillStyle = "#EF4444"; ctx.shadowColor = "#EF4444"; ctx.shadowBlur = 10;
        ctx.fillRect(x+5, MAIN_CONVEYOR_Y - 45 + qcScanner.pos, 30, 2);
        ctx.shadowBlur = 0;
    }
    function drawParts() {
        const drawPart = (p) => {
            ctx.save(); ctx.translate(p.x, p.y);
            ctx.fillStyle = p.color; ctx.fillRect(0,0,p.width,p.height);
            if(p.isDefective) {
                ctx.strokeStyle = "rgba(0,0,0,0.7)"; ctx.lineWidth=3;
                ctx.beginPath(); ctx.moveTo(2,2); ctx.lineTo(p.width-2, p.height-2); ctx.stroke();
                ctx.moveTo(p.width-2,2); ctx.lineTo(2, p.height-2); ctx.stroke();
            }
            ctx.fillStyle = "rgba(255,255,255,0.4)"; ctx.fillRect(2,2,p.width-4, 4);
            ctx.restore();
        };
        [inputPart, robotPart, lift.part, ...outputParts].forEach(p => { if(p) { if(p === robotPart) { p.x = robotPos.x - p.width/2; p.y = robotPos.y - p.height/2 - 15; } drawPart(p); } });
    }
    function drawRobot() {
        const currentPos = robotPos;
        ctx.fillStyle = "#2D3748";
        ctx.beginPath();
        ctx.arc(ROBOT_BASE_X, ROBOT_BASE_Y, 30, Math.PI, 0);
        ctx.fill();
        ctx.fillRect(ROBOT_BASE_X - 40, ROBOT_BASE_Y, 80, 20);

        const armLength1 = 70, armLength2 = 60, totalArmLength = armLength1 + armLength2;
        const dx = currentPos.x - ROBOT_BASE_X, dy = currentPos.y - ROBOT_BASE_Y;
        const distToTarget = distance(currentPos, {x: ROBOT_BASE_X, y: ROBOT_BASE_Y});
        let elbowX, elbowY, angle1 = 0, angle2 = 0;

        if (distToTarget < 1) {
             elbowX = ROBOT_BASE_X; elbowY = ROBOT_BASE_Y - armLength1;
             angle1 = -Math.PI / 2; angle2 = Math.PI;
        } else if (distToTarget >= totalArmLength) {
            angle1 = Math.atan2(dy, dx);
            elbowX = ROBOT_BASE_X + Math.cos(angle1) * armLength1;
            elbowY = ROBOT_BASE_Y + Math.sin(angle1) * armLength1;
        } else {
            const cosAngle2 = (distToTarget**2 - armLength1**2 - armLength2**2) / (2 * armLength1 * armLength2);
            angle2 = Math.acos(Math.max(-1, Math.min(1, cosAngle2)));
            const baseAngle = Math.atan2(dy, dx);
            const angleOffset = Math.acos((armLength1**2 + distToTarget**2 - armLength2**2) / (2 * armLength1 * distToTarget));
            angle1 = baseAngle - angleOffset;
            elbowX = ROBOT_BASE_X + Math.cos(angle1) * armLength1;
            elbowY = ROBOT_BASE_Y + Math.sin(angle1) * armLength1;
        }
        const angle3 = angle1 + angle2;

        const segmentWidth = 18, segmentColor = "#4A5568", jointColor = "#60A5FA";
        const drawSegment = (x, y, angle, length) => {
            ctx.save();
            ctx.translate(x, y);
            ctx.rotate(angle);
            const grad = ctx.createLinearGradient(0, -segmentWidth/2, 0, segmentWidth/2);
            grad.addColorStop(0, "#718096");
            grad.addColorStop(0.5, segmentColor);
            grad.addColorStop(1, "#2D3748");
            ctx.fillStyle = grad;
            ctx.beginPath();
            ctx.rect(0, -segmentWidth/2, length, segmentWidth);
            ctx.fill();
            ctx.strokeStyle = "#2D3748";
            ctx.stroke();
            ctx.restore();
        };
        drawSegment(ROBOT_BASE_X, ROBOT_BASE_Y, angle1, armLength1);
        drawSegment(elbowX, elbowY, angle3, armLength2);

        [ [ROBOT_BASE_X, ROBOT_BASE_Y, 15], [elbowX, elbowY, 12] ].forEach(([x,y,r]) => {
            ctx.fillStyle = jointColor;
            ctx.beginPath(); ctx.arc(x, y, r, 0, Math.PI * 2); ctx.fill();
        });
        
        ctx.fillStyle = robotPart && robotPart.held ? "#F87171" : "#4ADE80";
        ctx.beginPath(); ctx.arc(currentPos.x, currentPos.y, 15, 0, Math.PI * 2); ctx.fill();
    }
    function drawBins() {
        [ [BIN_X, BRANCH_A_Y, "Kutu A"], [BIN_X, BRANCH_B_Y, "Kutu B"], [SCRAP_BIN_X, REJECT_CONVEYOR_Y, "Hurda"] ].forEach(([x, y, label]) => {
            const binTopY = y + 20;
            ctx.fillStyle = "rgba(0,0,0,0.4)"; ctx.beginPath();
            ctx.moveTo(x, binTopY); ctx.lineTo(x-10, y + 70); ctx.lineTo(x + BIN_WIDTH + 10, y + 70); ctx.lineTo(x+BIN_WIDTH, binTopY);
            ctx.closePath(); ctx.fill();
        });
    }
    
    // HATA DÜZELTMESİ: EKLENDİ
    function drawLift() {
        // Dikey Raylar
        ctx.fillStyle = "#374151";
        ctx.fillRect(LIFT_X - 15, 0, 5, ORIGINAL_HEIGHT);
        ctx.fillRect(LIFT_X + 50, 0, 5, ORIGINAL_HEIGHT);
        
        // Piston/Platform
        ctx.fillStyle = "#718096"; // Piston shaft color
        ctx.fillRect(LIFT_X + 15, lift.y + PART_HEIGHT, 10, ORIGINAL_HEIGHT - lift.y);
        ctx.fillStyle = "#A0AEC0"; // Piston head color
        ctx.fillRect(LIFT_X + 13, lift.y, 14, 10);
        
        // Platform
        ctx.fillStyle = "#60A5FA"; // Accent color for the platform
        ctx.globalAlpha = 0.7;
        ctx.fillRect(LIFT_X - 10, lift.y, 60, PART_HEIGHT + 5);
        ctx.globalAlpha = 1;
        ctx.strokeStyle = "#A855F7"; // A vibrant border
        ctx.lineWidth = 2;
        ctx.strokeRect(LIFT_X - 10, lift.y, 60, PART_HEIGHT + 5);
        ctx.lineWidth = 1; // Reset line width
    }

    function updateLift() {
        if (lift.y !== lift.targetY) {
            lift.status = 'moving';
            const dy = lift.targetY - lift.y;
            lift.y += Math.sign(dy) * Math.min(Math.abs(dy), conveyorSpeed * 1.5);
        } else if (lift.status === 'moving') {
            lift.status = lift.part ? 'pushing' : 'idle';
            if(lift.part) {
                lift.part.y = lift.y;
                lift.part.isMoving = true;
                lift.part.conveyorPhase = 'BRANCH';
                outputParts.push(lift.part);
                lift.part = null;
                lift.targetY = MAIN_CONVEYOR_Y;
            }
        }
        if (lift.part) lift.part.y = lift.y;
    }


    // --- Simülasyon Mantığı ---
    function initializeParts() {
        const text = partQueueTextElement.value;
        partRecipe = text.toUpperCase().split(',').map(s => s.trim()).filter(s => COLOR_MAP[s]).map(s => ({...COLOR_MAP[s]}));
        partStats = { total: 0, good: 0, defective: 0 };
        robotPart = null; outputParts = []; inputPart = null; lift.part = null;
        updateUI();
    }

    const spawnNewPart = () => {
        if (partRecipe.length > 0) {
            const nextPart = partRecipe.shift();
            inputPart = {
                x: INPUT_CONVEYOR_START_X, y: INPUT_CONVEYOR_Y,
                width: PART_WIDTH, height: PART_HEIGHT, ...nextPart,
                isDefective: Math.random() < DEFECT_CHANCE,
                conveyorPhase: 'INPUT'
            };
            partStats.total++;
        }
    };
    
    function updateConveyorMovement() {
        if (inputPart && inputPart.x < INPUT_PICKUP_X) inputPart.x += conveyorSpeed * 0.5;

        outputParts = outputParts.filter(p => {
            if (!p.isMoving) return true;
            p.x += conveyorSpeed;
            if (p.conveyorPhase === 'MAIN' && p.x >= QC_SCAN_X) {
                p.isMoving = false;
                p.conveyorPhase = 'QC_SCAN';
                playSound('scan');
                setTimeout(() => {
                    if (p.isDefective) {
                        p.conveyorPhase = 'REJECTING';
                        partStats.defective++;
                        playSound('reject');
                    } else {
                        p.isMoving = true;
                        p.conveyorPhase = 'POST_QC';
                        partStats.good++;
                    }
                }, 500 / conveyorSpeed);
            } else if (p.conveyorPhase === 'REJECTING') {
                p.y -= conveyorSpeed;
                if(p.y < REJECT_CONVEYOR_Y) {
                    p.y = REJECT_CONVEYOR_Y;
                    p.isMoving = true;
                    p.conveyorPhase = 'REJECT_CONVEYOR';
                }
            } else if (p.conveyorPhase === 'REJECT_CONVEYOR' && p.x >= SCRAP_BIN_X + BIN_WIDTH) {
                return false; // Remove part
            } else if (p.conveyorPhase === 'POST_QC' && p.x >= LIFT_X && lift.status === 'idle' && !lift.part) {
                p.isMoving = false;
                lift.part = p;
                lift.targetY = p.type === 'TYPE_A' ? BRANCH_A_Y : BRANCH_B_Y;
                return false;
            } else if (p.conveyorPhase === 'BRANCH' && p.x >= BIN_X) {
                p.isMoving = false;
                if (!p.counted) { p.counted = true; playSound('binned'); createParticle(p.x, p.y, p.color); }
            }
            return true;
        });
    }

    const plcSteps = {
        0: () => {
            if (!robotPart && !inputPart && partRecipe.length > 0) spawnNewPart();
            if (inputPart && inputPart.x >= INPUT_PICKUP_X) step = 10;
            else if (partRecipe.length === 0 && outputParts.length === 0 && !lift.part && !inputPart && !robotPart) {
                showMessage("Üretim tamamlandı!"); isRunning = false;
            }
        },
        10: () => { if (!inputPart) { step = 0; return; } targetPos = {x: inputPart.x + PART_WIDTH / 2, y: inputPart.y + PART_HEIGHT / 2}; if (distance(robotPos, targetPos) < 5) step = 20; },
        20: () => { if (inputPart) { robotPart = { ...inputPart, held: true }; inputPart = null; setTimeout(() => step = 30, 200 / conveyorSpeed); } else { step = 0; } },
        30: () => { targetPos = {x: OUTPUT_DROP_X, y: MAIN_CONVEYOR_Y + PART_HEIGHT/2}; if (distance(robotPos, targetPos) < 5) step = 40; },
        40: () => { if (robotPart) { outputParts.push({ ...robotPart, held: false, x: OUTPUT_DROP_X - PART_WIDTH / 2, y: MAIN_CONVEYOR_Y, isMoving: true, conveyorPhase: 'MAIN' }); robotPart = null; setTimeout(() => step = 50, 300 / conveyorSpeed); } else { step = 0; } },
        50: () => { targetPos = {x: ROBOT_BASE_X, y: ROBOT_BASE_Y}; if (distance(robotPos, targetPos) < 5) { step = 0; } }
    };

    // --- Ana Döngü & Olay Dinleyicileri ---
    function animate() {
        robotPos.x += (targetPos.x - robotPos.x) * 0.1;
        robotPos.y += (targetPos.y - robotPos.y) * 0.1;
        animationOffset = (animationOffset + conveyorSpeed) % 60;
        
        ctx.save();
        ctx.scale(scaleFactor, scaleFactor);
        
        drawScene();
        drawQCStation();
        drawLift(); // HATA DÜZELTMESİ: ÇAĞRI EKLENDİ
        if (isRunning) { 
            updateConveyorMovement(); 
            updateLift(); 
        }
        drawParts();
        drawRobot();
        drawBins();
        updateAndDrawParticles();
        
        if (isRunning) plcSteps[step]();
        
        ctx.restore();
        updateUI();

        requestAnimationFrame(animate);
    }
    
    function resizeCanvas() {
        const canvasWrapper = canvas.parentElement;
        const scale = Math.min(canvasWrapper.clientWidth / ORIGINAL_WIDTH, canvasWrapper.clientHeight / ORIGINAL_HEIGHT);
        canvas.width = ORIGINAL_WIDTH * scale;
        canvas.height = ORIGINAL_HEIGHT * scale;
        scaleFactor = scale;
    }

    startButton.addEventListener('click', () => {
        if (partRecipe.length === 0) initializeParts();
        if (partRecipe.length === 0) { showMessage("🔴 Geçerli bir üretim planı girin!", true); return; }
        if (!isRunning) { isRunning = true; showMessage("Simülasyon BAŞLADI."); }
    });
    stopButton.addEventListener('click', () => { if (isRunning) { isRunning = false; showMessage("🔴 Simülasyon DURDURULDU.", true); } });
    resetButton.addEventListener('click', () => {
        isRunning = false; step = 0;
        partQueueTextElement.value = DEFAULT_PART_QUEUE_TEXT;
        initializeParts();
        robotPos = { x: ROBOT_BASE_X, y: ROBOT_BASE_Y };
        targetPos = { x: ROBOT_BASE_X, y: ROBOT_BASE_Y };
        lift = { y: MAIN_CONVEYOR_Y, targetY: MAIN_CONVEYOR_Y, status: 'idle', part: null };
        showMessage("Sistem SIFIRLANDI.");
    });
    speedControl.addEventListener('input', (e) => { conveyorSpeed = parseFloat(e.target.value); speedValue.textContent = conveyorSpeed.toFixed(1); });
    partQueueTextElement.addEventListener('input', () => { if(!isRunning) initializeParts(); });
    window.addEventListener('resize', resizeCanvas);

    // --- Başlangıç ---
    partQueueTextElement.value = DEFAULT_PART_QUEUE_TEXT;
    initializeParts();
    resizeCanvas();
    animate();

    </script>
</body>
</html>

