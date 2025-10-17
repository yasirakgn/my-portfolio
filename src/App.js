import React, { useEffect, useRef, useState, useCallback } from "react";
import { Play, RotateCcw, StopCircle, Gauge, Boxes, Zap, User } from 'lucide-react';

// --- SIMULASYON SABITLERI ---
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

// Orijinal mantıksal boyutlar (çizim koordinatları bu boyuta göre ayarlanmıştır)
const ORIGINAL_WIDTH = 800; 
const ORIGINAL_HEIGHT = 400; 

// Varsayılan Üretim Planı
const DEFAULT_PART_QUEUE_JSON = JSON.stringify([
    { "type": "BLUE" },
    { "type": "RED" },
    { "type": "BLUE" },
    { "type": "BLUE" },
    { "type": "RED" }
], null, 2);


// Utility Functions
const distance = (a, b) => Math.sqrt((a.x - b.x) ** 2 + (a.y - b.y) ** 2);

// Component
const App = () => {
    const canvasRef = useRef(null);
    const animationRef = useRef(null);
    const containerRef = useRef(null); 
    const scaleFactorRef = useRef(1); // Ölçeklendirme faktörü ref'i

    // Simulation State
    const [isRunning, setIsRunning] = useState(false);
    const [step, setStep] = useState(0);
    const [cycleCount, setCycleCount] = useState(0);
    const [finishedCount, setFinishedCount] = useState(0);
    const [message, setMessage] = useState("Üretim planını düzenleyin ve başlamak için START'a basın.");
    
    // Kullanıcı tarafından düzenlenebilir üretim planı
    const [partQueueJson, setPartQueueJson] = useState(DEFAULT_PART_QUEUE_JSON);

    // Simulation Refs
    const robotPosRef = useRef({ x: ROBOT_BASE_X, y: ROBOT_BASE_Y });
    const targetRef = useRef({ x: ROBOT_BASE_X, y: ROBOT_BASE_Y });
    const robotPartRef = useRef(null); 
    const outputPartsRef = useRef([]); 
    const inputPartRef = useRef(null); 
    const partRecipeRef = useRef([]); 

    // Parça Listesini Başlatma (Artık JSON'dan okuyor)
    const initializeParts = useCallback(() => {
        try {
            const parsedQueue = JSON.parse(partQueueJson);
            if (!Array.isArray(parsedQueue)) {
                throw new Error("JSON bir dizi (array) olmalıdır.");
            }
            
            // Kullanıcının tanımladığı planı tam parça nesnelerine dönüştür
            const fullRecipe = parsedQueue.map(p => {
                if (!p.type || (p.type !== 'BLUE' && p.type !== 'RED')) {
                    throw new Error(`Geçersiz parça türü: '${p.type}'. Sadece 'BLUE' veya 'RED' kullanılabilir.`);
                }
                return {
                    color: p.type === 'BLUE' ? "#2563EB" : "#DC2626",
                    type: p.type
                };
            });
            
            partRecipeRef.current = fullRecipe;
            setMessage(`Üretim planı yüklendi: ${fullRecipe.length} parça. Sistem hazır.`);

        } catch (e) {
            partRecipeRef.current = [];
            setMessage(`🔴 HATA: Üretim planı JSON formatı geçersiz! ${e.message}`);
        }

        robotPartRef.current = null;
        outputPartsRef.current = [];
        inputPartRef.current = null;
    }, [partQueueJson]);

    // JSON değiştiğinde veya başlangıçta üretim planını yükle
    useEffect(() => {
        initializeParts();
    }, [initializeParts]);

    // Yeni Parça Üretme Mantığı
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
                held: false,
                id: Date.now() + Math.random(),
                counted: false, 
            };
            setMessage(`Yeni parça (${nextPart.type}) giriş konveyöründe. Robot bekliyor.`);
        }
    }, []);

    // Robot Hareket Mantığı
    const moveRobotTo = useCallback((x, y) => {
        targetRef.current = { x, y };
    }, []);

    // PLC Step Logic Definition
    const plcStepsRef = useRef({
        0: () => {
            if (robotPartRef.current === null && inputPartRef.current === null && partRecipeRef.current.length > 0) {
                spawnNewPart(); 
            }
            if (inputPartRef.current && inputPartRef.current.x >= INPUT_PICKUP_X) {
                setStep(10);
            } else if (partRecipeRef.current.length === 0 && outputPartsRef.current.every(p => !p.isMoving && p.counted)) {
                setMessage("Tüm parçalar işlendi. Yeni bir plan oluşturun veya SIFIRLA yapın.");
                setIsRunning(false);
            }
        },
        10: () => {
            if (!inputPartRef.current) return setStep(0); 
            moveRobotTo(inputPartRef.current.x + PART_WIDTH / 2, inputPartRef.current.y + PART_HEIGHT / 2);
            if (distance(robotPosRef.current, targetRef.current) < 5) {
                setStep(20);
            }
        },
        20: () => {
            if (inputPartRef.current) {
                robotPartRef.current = { ...inputPartRef.current, held: true };
                inputPartRef.current = null; 
                setMessage(`Parça (${robotPartRef.current.type}) kavrandı. Ana Konveyöre ilerliyor.`);
                setTimeout(() => setStep(30), 300);
            }
        },
        30: () => {
            moveRobotTo(OUTPUT_DROP_X, MAIN_OUTPUT_CONVEYOR_Y - PART_HEIGHT / 2); 
            if (distance(robotPosRef.current, targetRef.current) < 5) {
                setStep(40);
            }
        },
        40: () => {
            if (robotPartRef.current) {
                outputPartsRef.current.push({
                    ...robotPartRef.current,
                    held: false,
                    x: OUTPUT_DROP_X - PART_WIDTH / 2,
                    y: MAIN_OUTPUT_CONVEYOR_Y - PART_HEIGHT,
                    isMoving: true,
                    conveyorPhase: 'MAIN', 
                    conveyorId: null,
                    targetY: null,
                    diverterProgress: 0,
                    counted: false, 
                });

                robotPartRef.current = null;
                setMessage(`Parça Ana Konveyör üzerine bırakıldı. Yönlendirme bekleniyor.`);
                setTimeout(() => setStep(50), 500);
            }
        },
        50: () => {
            moveRobotTo(ROBOT_BASE_X, ROBOT_BASE_Y);
            if (distance(robotPosRef.current, targetRef.current) < 5) {
                setCycleCount(c => c + 1);
                setStep(0); 
                setMessage("Döngü tamamlandı. Yeni parça bekleniyor (Adım 0).");
            }
        },
    });

    // Main Simulation Loop and Canvas Logic
    useEffect(() => {
        const canvas = canvasRef.current;
        const ctx = canvas.getContext("2d");
        
        // --- RESPONSIF CANVAS BOYUTLANDIRMA MANTIGI (GÜNCELLENDİ) ---
        const resizeCanvas = () => {
            const container = containerRef.current;
            if (container) {
                const newWidth = container.clientWidth;
                
                // Genişliği konteynere tam sığdır
                canvas.width = newWidth; 
                
                // Orijinal 2:1 en boy oranını koru (400/800)
                const newHeight = newWidth * (ORIGINAL_HEIGHT / ORIGINAL_WIDTH); 
                canvas.height = newHeight;
                
                // Ölçeklendirme faktörünü hesapla ve sakla
                scaleFactorRef.current = newWidth / ORIGINAL_WIDTH;
            }
        };
        
        resizeCanvas();
        window.addEventListener('resize', resizeCanvas);


        // --- Çizim Fonksiyonları ---
        const drawConveyors = () => {
            // Background fill, ORIGINAL_WIDTH ve ORIGINAL_HEIGHT kullanılarak çizilir.
            ctx.fillStyle = "#1F2937"; 
            ctx.fillRect(0, 0, ORIGINAL_WIDTH, ORIGINAL_HEIGHT); 

            const drawConveyorLine = (startX, y, endX, label) => {
                ctx.fillStyle = "#374151"; 
                ctx.fillRect(startX, y, endX - startX, 25); 
                ctx.fillStyle = "#2D3748"; 
                ctx.fillRect(startX, y, endX - startX, 20);
                ctx.fillStyle = "#4B5563";
                ctx.fillRect(startX, y + 2, endX - startX, 16);
                
                // Rulolar
                ctx.fillStyle = "#9CA3AF"; 
                const segmentLength = 40;
                for (let i = startX; i < endX; i += segmentLength) {
                    // Animasyon ofsetini CONVEYOR_SPEED ile hesapla
                    const rollerX = i + (animationRef.current.offset * 0.5) % segmentLength; 
                    ctx.beginPath();
                    ctx.arc(rollerX, y + 10, 3, 0, Math.PI * 2);
                    ctx.fill();
                    ctx.fillStyle = "#2D3748"; 
                    ctx.beginPath();
                    ctx.arc(rollerX - 1, y + 10 - 1, 2, 0, Math.PI * 2);
                    ctx.fill();
                }

                ctx.strokeStyle = "#111827";
                ctx.lineWidth = 1;
                ctx.strokeRect(startX, y, endX - startX, 20);

                if (label) {
                    ctx.fillStyle = "#9CA3AF";
                    ctx.textAlign = "left";
                    ctx.font = "12px Inter";
                    ctx.fillText(label, startX, y - 5);
                }
            };
            
            drawConveyorLine(0, INPUT_CONVEYOR_Y, INPUT_PICKUP_X + 50, "Giriş Konveyörü");
            drawConveyorLine(OUTPUT_DROP_X - 50, MAIN_OUTPUT_CONVEYOR_Y, DIVERTER_X + 20, "Ana Konveyör");
            drawConveyorLine(DIVERTER_X, BRANCH_A_Y, BIN_X + BIN_WIDTH, "Konveyör A (Mavi)");
            drawConveyorLine(DIVERTER_X, BRANCH_B_Y, BIN_X + BIN_WIDTH, "Konveyör B (Kırmızı)");

            // Yönlendirici (Diverter) Çizimi
            ctx.fillStyle = "#4B5563"; 
            ctx.fillRect(DIVERTER_X - 12, MAIN_OUTPUT_CONVEYOR_Y - 55, 24, 75);
            ctx.fillStyle = "#374151";
            ctx.fillRect(DIVERTER_X - 10, MAIN_OUTPUT_CONVEYOR_Y - 50, 20, 70);
            
            ctx.save();
            ctx.translate(DIVERTER_X, MAIN_OUTPUT_CONVEYOR_Y + 10); 

            let angle = 0; 
            const activePart = outputPartsRef.current.find(p => p.conveyorPhase === 'DIVERTER_MOVE');
            if (activePart) {
                const targetAngle = activePart.type === 'BLUE' ? -Math.PI / 6 : Math.PI / 6; 
                angle = targetAngle * Math.min(activePart.diverterProgress * 2, 1); 
            }

            ctx.rotate(angle);
            
            ctx.fillStyle = "#C0C0C0";
            ctx.fillRect(-5, -5, 60, 10); 

            ctx.fillStyle = "#4B5563";
            ctx.beginPath();
            ctx.arc(60, 5, 5, 0, Math.PI * 2);
            ctx.fill();

            ctx.restore();
            
            ctx.fillStyle = "#E5E7EB";
            ctx.textAlign = "center";
            ctx.font = "12px Inter";
            ctx.fillText("Yönlendirici (Diverter)", DIVERTER_X, MAIN_OUTPUT_CONVEYOR_Y - 65);


            // Bitmiş Ürün Kutuları (Finished Goods Bins)
            const drawBin = (x, y, color, label) => {
                const binTopY = y + 20;
                
                ctx.fillStyle = "#1F2937"; 
                ctx.fillRect(x, binTopY, BIN_WIDTH, 85);

                ctx.fillStyle = color; 
                ctx.fillRect(x + 2, binTopY + 2, BIN_WIDTH - 4, 81);
                
                ctx.fillStyle = "#9CA3AF";
                ctx.fillRect(x - 2, binTopY - 2, BIN_WIDTH + 4, 4);

                ctx.strokeStyle = "#FFF";
                ctx.lineWidth = 1;
                ctx.strokeRect(x, binTopY, BIN_WIDTH, 85);
                
                ctx.fillStyle = "#FFF";
                ctx.textAlign = "center";
                ctx.font = "14px Inter Bold";
                ctx.fillText(label, x + BIN_WIDTH / 2, y + 55);
            };

            drawBin(BIN_X, BRANCH_A_Y, "#2563EB", "MAVİ");
            drawBin(BIN_X, BRANCH_B_Y, "#B91C1C", "KIRMIZI");


            // Sensörler
            const drawSensor = (x, y, label) => {
                ctx.fillStyle = "#10B981"; 
                ctx.shadowColor = 'rgba(16, 185, 129, 0.9)';
                ctx.shadowBlur = 8;
                
                ctx.fillStyle = "#374151";
                ctx.fillRect(x - 5, y - 20, 20, 10);

                ctx.fillStyle = "#10B981"; 
                ctx.beginPath();
                ctx.arc(x + 5, y - 15, 4, 0, Math.PI * 2);
                ctx.fill();

                ctx.shadowBlur = 0;

                ctx.fillStyle = "#E5E7EB";
                ctx.textAlign = "center";
                ctx.font = "10px Inter";
                ctx.fillText(label, x + 5, y - 25);
            };

            drawSensor(SENSOR_X, BRANCH_A_Y, "Sensör A");
            drawSensor(SENSOR_X, BRANCH_B_Y, "Sensör B");
        };

        const drawParts = () => {
            const drawPart = (p) => {
                ctx.fillStyle = p.color;
                
                ctx.shadowColor = 'rgba(0, 0, 0, 0.4)';
                ctx.shadowBlur = 5;
                ctx.shadowOffsetX = 2;
                ctx.shadowOffsetY = 2;

                ctx.fillRect(p.x, p.y, p.width, p.height);
                
                ctx.shadowBlur = 0;
                ctx.shadowOffsetX = 0;
                ctx.shadowOffsetY = 0;

                ctx.strokeStyle = "#000";
                ctx.strokeRect(p.x, p.y, p.width, p.height);
            }

            if (inputPartRef.current) {
                drawPart(inputPartRef.current);
            }

            const rp = robotPartRef.current;
            if (rp) {
                rp.x = robotPosRef.current.x - rp.width / 2;
                rp.y = robotPosRef.current.y - rp.height / 2 - 15;
                drawPart(rp);
            }

            outputPartsRef.current.forEach(p => {
                drawPart(p);
            });
        };

        const drawRobot = () => {
            const currentPos = robotPosRef.current;

            const dx = currentPos.x - ROBOT_BASE_X;
            const dy = currentPos.y - ROBOT_BASE_Y;
            const dist = distance(currentPos, { x: ROBOT_BASE_X, y: ROBOT_BASE_Y });

            let elbowX, elbowY;
            const midX = ROBOT_BASE_X + dx * 0.5;
            const midY = ROBOT_BASE_Y + dy * 0.5;
            const perpX = -dy / dist;
            const perpY = dx / dist;
            const offsetMagnitude = Math.min(dist / 3, 50) + 10;
            elbowX = midX + perpX * offsetMagnitude;
            elbowY = midY + perpY * offsetMagnitude;

            // Robot Base
            ctx.fillStyle = "#1F2937"; 
            ctx.fillRect(ROBOT_BASE_X - 25, ROBOT_BASE_Y - 10, 50, 60);
            ctx.fillRect(ROBOT_BASE_X - 35, ROBOT_BASE_Y + 50, 70, 10);
            ctx.strokeStyle = "#6B7280";
            ctx.strokeRect(ROBOT_BASE_X - 25, ROBOT_BASE_Y - 10, 50, 60);

            // Kol Segmentleri
            ctx.shadowColor = 'rgba(0, 0, 0, 0.5)';
            ctx.shadowBlur = 5;
            ctx.shadowOffsetX = 3;
            ctx.shadowOffsetY = 3;

            ctx.strokeStyle = "#60A5FA"; 
            ctx.lineWidth = 12;
            ctx.lineCap = 'round';

            ctx.beginPath();
            ctx.moveTo(ROBOT_BASE_X, ROBOT_BASE_Y);
            ctx.lineTo(elbowX, elbowY);
            ctx.stroke();

            ctx.beginPath();
            ctx.moveTo(elbowX, elbowY);
            ctx.lineTo(currentPos.x, currentPos.y);
            ctx.stroke();

            ctx.shadowBlur = 0;
            ctx.shadowOffsetX = 0;
            ctx.shadowOffsetY = 0;

            // Eklemler
            ctx.fillStyle = "#000";
            ctx.beginPath();
            ctx.arc(ROBOT_BASE_X, ROBOT_BASE_Y, 14, 0, Math.PI * 2);
            ctx.fill();
            ctx.fillStyle = "#C0C0C0";
            ctx.beginPath();
            ctx.arc(elbowX, elbowY, 10, 0, Math.PI * 2);
            ctx.fill();

            // End Effector (Tutucu)
            ctx.fillStyle = robotPartRef.current && robotPartRef.current.held ? "#EF4444" : "#10B981"; 
            ctx.shadowColor = robotPartRef.current && robotPartRef.current.held ? 'rgba(239, 68, 68, 0.8)' : 'rgba(16, 185, 129, 0.8)';
            ctx.shadowBlur = 10;
            ctx.beginPath();
            ctx.arc(currentPos.x, currentPos.y, 16, 0, Math.PI * 2);
            ctx.fill();
            ctx.shadowBlur = 0;
            
            // Tutucu "Parmaklar"
            ctx.strokeStyle = "#1F2937";
            ctx.lineWidth = 5;
            ctx.beginPath();
            ctx.moveTo(currentPos.x + 12, currentPos.y);
            ctx.lineTo(currentPos.x + 20, currentPos.y - 18);
            ctx.stroke();
            ctx.beginPath();
            ctx.moveTo(currentPos.x - 12, currentPos.y);
            ctx.lineTo(currentPos.x - 20, currentPos.y - 18);
            ctx.stroke();
        };

        // Konveyör ve Parça Hareketi Mantığı
        const updateConveyorMovement = () => {
            const nextOutputParts = [];

            if (inputPartRef.current && inputPartRef.current.x < INPUT_PICKUP_X) {
                inputPartRef.current.x += CONVEYOR_SPEED * 0.5;
            }

            outputPartsRef.current.forEach(p => {
                if (!p.isMoving) {
                    nextOutputParts.push(p);
                    return;
                }

                if (p.conveyorPhase === 'MAIN') {
                    p.x += CONVEYOR_SPEED;
                    if (p.x >= DIVERTER_X - PART_WIDTH / 2) {
                        p.conveyorPhase = 'DIVERTER_MOVE';
                        p.startY = p.y;
                        p.targetY = p.type === 'BLUE' ? BRANCH_A_Y - PART_HEIGHT : BRANCH_B_Y - PART_HEIGHT;
                        p.conveyorId = p.type === 'BLUE' ? 'A' : 'B';
                        p.diverterProgress = 0;
                        setMessage(`Diverter aktif! Parça ${p.conveyorId} koluna yönlendiriliyor.`);
                    }
                }
                else if (p.conveyorPhase === 'DIVERTER_MOVE') {
                    p.diverterProgress += 0.05; 
                    p.x += CONVEYOR_SPEED * 0.5; 
                    p.y = p.startY + (p.targetY - p.startY) * Math.min(p.diverterProgress, 1);

                    if (p.diverterProgress >= 1) {
                        p.conveyorPhase = 'BRANCH';
                        p.y = p.targetY; 
                    }
                }
                else if (p.conveyorPhase === 'BRANCH') {
                    p.x += CONVEYOR_SPEED;

                    if (p.x >= SENSOR_X && !p.passedSensor) {
                        p.passedSensor = true;
                        setMessage(`✅ Sensör ${p.conveyorId} Parçayı algıladı. Kutulama bekleniyor.`);
                    }

                    if (p.x >= BIN_X) {
                        p.isMoving = false; 
                        p.x = BIN_X + (BIN_WIDTH / 2) - (PART_WIDTH / 2); 
                        p.y = p.type === 'BLUE' ? BRANCH_A_Y - PART_HEIGHT : BRANCH_B_Y - PART_HEIGHT;
                        
                        if (!p.counted) {
                            p.counted = true;
                            setFinishedCount(c => c + 1);
                            setMessage(`📦 Parça (${p.type}) Bitmiş Ürün Kutusu'na yerleştirildi.`);
                        }
                    }
                }
                nextOutputParts.push(p);
            });
            outputPartsRef.current = nextOutputParts;
        };


        const animate = () => {
            // Robot hareketini yumuşat
            robotPosRef.current.x += (targetRef.current.x - robotPosRef.current.x) * 0.1;
            robotPosRef.current.y += (targetRef.current.y - robotPosRef.current.y) * 0.1;

            animationRef.current.offset = (animationRef.current.offset + CONVEYOR_SPEED) % 60;

            // Clear the physical canvas area
            ctx.clearRect(0, 0, canvas.width, canvas.height); 
            
            // Yüksek çözünürlüklü çizimler için ölçeklendirme uygula
            const S = scaleFactorRef.current;
            ctx.save(); // Mevcut durumu kaydet
            ctx.scale(S, S); // Ölçeklendirmeyi uygula

            // Drawing logic (uses 800x400 coordinates)
            drawConveyors();

            if (isRunning) {
                updateConveyorMovement(); 
            }

            drawParts();
            drawRobot();

            if (isRunning) {
                const currentStepLogic = plcStepsRef.current[step];
                if (currentStepLogic) {
                    currentStepLogic();
                }
            }

            ctx.restore(); // Ölçeklendirmeyi geri al

            animationRef.current.id = requestAnimationFrame(animate);
        };
        
        animationRef.current = { id: null, offset: 0 };
        animate();

        return () => {
            cancelAnimationFrame(animationRef.current.id);
            window.removeEventListener('resize', resizeCanvas); 
        };
    }, [isRunning, step, spawnNewPart]);

    // Controller Functions
    const handleStart = () => {
        if (!isRunning) {
            setIsRunning(true);
            if (inputPartRef.current === null && partRecipeRef.current.length > 0) spawnNewPart(); 
            if (step !== 0) setStep(0);
            setMessage("Simülasyon BAŞLADI. Robot Adım 0'da çalışıyor.");
        }
    };

    const handleStop = () => {
        setIsRunning(false);
        setMessage("🔴 ACİL DURDURMA aktif. Robot durduruldu.");
    };

    const handleReset = () => {
        handleStop();
        setStep(0);
        setCycleCount(0);
        setFinishedCount(0);
        // Üretim planını varsayılana döndür
        setPartQueueJson(DEFAULT_PART_QUEUE_JSON); 
        // initializeParts, useEffect tarafından otomatik olarak çağrılacak
        robotPosRef.current = { x: ROBOT_BASE_X, y: ROBOT_BASE_Y };
        targetRef.current = { x: ROBOT_BASE_X, y: ROBOT_BASE_Y };
        setMessage("Sistem SIFIRLANDI. Üretim planı yeniden yüklendi. Başlamak için START'a basın.");
    };

    // Custom Step Rendering
    const StepDisplay = () => {
        let description = "Beklemede (Hata?)";

        if(step === 0) description = "Başlangıç: Parça üretimi veya bekleme.";
        else if(step === 10) description = "Kavrama noktasına hareket.";
        else if(step === 20) description = "Parçayı kavra (Gripper Kapat).";
        else if(step === 30) description = "Ana Konveyör bırakma noktasına hareket.";
        else if(step === 40) description = "Parçayı bırak ve Ana Konveyöre gönder.";
        else if(step === 50) description = "Ana pozisyona geri dön.";

        return (
            <div
                className="font-mono text-lg text-cyan-300 p-2 bg-gray-800 rounded-md shadow-inner shadow-cyan-900/50 transition-all duration-500 w-full"
            >
                <span className="text-gray-400 mr-2">Adım {step}:</span>
                <span>{description}</span>
            </div>
        );
    };

    // İstatistik Kartı Bileşeni
    const StatCard = ({ title, value, colorClass, Icon, iconColor }) => (
        <div className="p-4 bg-gray-700 rounded-xl shadow-xl border-l-4 border-gray-600 transition-all duration-300 hover:scale-[1.02] transform">
            <div className="flex justify-between items-center">
                <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">{title}</p>
                <Icon className={`w-5 h-5 ${iconColor}`} />
            </div>
            <p className={`text-3xl font-extrabold mt-1 ${colorClass}`}>{value}</p>
        </div>
    );


    return (
        <div 
            className="w-full min-h-screen bg-gray-900 p-4 sm:p-8 font-sans text-gray-100"
        >
            {/* Başlık */}
            <header className="text-center p-4 bg-gray-800 shadow-2xl rounded-xl mb-6 border-b-4 border-indigo-600">
                <h1 
                    className="text-4xl sm:text-5xl font-extrabold text-indigo-400 flex items-center justify-center mb-1"
                >
                    <Zap className="w-12 h-12 mr-3 text-cyan-400" />
                    OTOMASYON KONTROL MERKEZİ
                </h1>
                <p 
                    className="text-md sm:text-lg text-gray-400 mt-2 font-light"
                >
                    Robotik Ayırma ve Yönlendirme Hattı Simülasyonu
                </p>
            </header>

            <div 
                className="max-w-6xl mx-auto flex flex-col lg:flex-row gap-6"
            >
                {/* Sol Panel: Kontrol ve Veri Alanı */}
                <div 
                    className="flex-1 lg:flex-shrink-0 lg:w-1/3 bg-gray-800 p-5 rounded-xl shadow-2xl border border-gray-700 space-y-5 flex flex-col"
                >
                    <h2 
                        className="text-xl font-bold text-indigo-300 pb-2 border-b border-gray-700 flex items-center" 
                    >
                        <Gauge className="w-6 h-6 mr-2 text-indigo-400" /> CANLI PERFORMANS VERİSİ
                    </h2>

                    {/* İstatistik Kartları */}
                    <div className="grid grid-cols-2 gap-4 mb-2">
                        <StatCard 
                            title="Toplam Döngü" 
                            value={cycleCount} 
                            colorClass="text-white" 
                            Icon={RotateCcw} 
                            iconColor="text-indigo-400"
                        />
                        <StatCard 
                            title="Bitmiş Ürün" 
                            value={finishedCount} 
                            colorClass="text-green-400" 
                            Icon={Boxes} 
                            iconColor="text-green-400"
                        />
                         <div className="col-span-2">
                            <StatCard 
                                title="Kalan Parça Kuyruğu" 
                                value={partRecipeRef.current.length} 
                                colorClass="text-yellow-400" 
                                Icon={User} 
                                iconColor="text-yellow-400"
                            />
                        </div>
                    </div>

                    {/* YENİ BÖLÜM: Üretim Planı */}
                    <h2 className="text-xl font-bold text-indigo-300 pb-2 border-b border-gray-700 mt-4 flex items-center">
                        <Boxes className="w-6 h-6 mr-2 text-indigo-400" /> ÜRETİM PLANI
                    </h2>
                    <div className="space-y-2">
                        <p className="text-xs text-gray-400 italic">
                            Üretilecek parçaların sırasını JSON formatında tanımlayın. Sadece "BLUE" ve "RED" türlerini kullanın.
                        </p>
                        <textarea
                            value={partQueueJson}
                            onChange={(e) => setPartQueueJson(e.target.value)}
                            rows="8"
                            className="w-full font-mono text-sm p-2 bg-gray-900 text-yellow-300 rounded-md border border-gray-700 focus:ring-indigo-500 focus:border-indigo-500"
                        />
                    </div>

                    <h2 
                        className="text-xl font-bold text-indigo-300 pb-2 border-b border-gray-700 mt-4 flex items-center" 
                    >
                        <Zap className="w-6 h-6 mr-2 text-indigo-400" /> Hat Kontrolleri
                    </h2>

                    {/* Kontrol Butonları */}
                    <div className="flex flex-col sm:flex-row gap-3">
                        <button
                            onClick={handleStart}
                            disabled={isRunning}
                            className={`flex-1 w-full py-4 rounded-lg font-extrabold text-lg transition-all duration-300 flex items-center justify-center space-x-2 
                                ${isRunning ? 'bg-gray-600 text-gray-400 cursor-not-allowed shadow-inner' : 'bg-green-600 text-white shadow-lg shadow-green-900/50 hover:bg-green-700 hover:scale-[1.02]'}`}
                        >
                            <Play className="w-6 h-6" />
                            <span>START</span>
                        </button>
                        <button
                            onClick={handleStop}
                            disabled={!isRunning}
                            className={`flex-1 w-full py-4 rounded-lg font-extrabold text-lg transition-all duration-300 flex items-center justify-center space-x-2 
                                ${!isRunning ? 'bg-gray-600 text-gray-400 cursor-not-allowed shadow-inner' : 'bg-red-600 text-white shadow-lg shadow-red-900/50 hover:bg-red-700 hover:scale-[1.02]'}`}
                        >
                            <StopCircle className="w-6 h-6" />
                            <span>DURDUR</span>
                        </button>
                    </div>

                    <button
                        onClick={handleReset}
                        className="w-full mt-3 py-4 rounded-lg font-bold transition-all duration-300 bg-gray-600 text-gray-100 shadow-md hover:bg-gray-500 hover:scale-[1.01] flex items-center justify-center space-x-2 text-lg"
                    >
                        <RotateCcw className="w-5 h-5" />
                        <span>SİSTEMİ SIFIRLA</span>
                    </button>
                </div>

                {/* Sağ Panel: Simülasyon Görüntüleme Alanı */}
                <div 
                    ref={containerRef} 
                    className="flex-1 bg-gray-800 p-5 rounded-xl shadow-2xl border border-gray-700 space-y-4 flex flex-col"
                >
                    <h2 
                        className="text-xl font-bold text-indigo-300 pb-2 border-b border-gray-700"
                    >
                        CANVAS SİMÜLASYON GÖRÜNTÜSÜ
                    </h2>
                    {/* Canvas'ı çevreleyen Box */}
                    <div 
                        className="w-full border-4 border-gray-700 shadow-inner rounded-lg overflow-hidden bg-gray-900"
                    >
                        <canvas 
                            ref={canvasRef} 
                            style={{ display: 'block', width: '100%', height: 'auto', backgroundColor: '#1F2937' }} 
                        />
                    </div>
                    <p className="text-xs text-gray-400 mt-3 text-center">
                        <span className="text-indigo-400 font-bold">Not:</span> Canvas artık bulunduğu konteynerin genişliğine göre **otomatik olarak ölçeklenir** ve en boy oranını (2:1) korur.
                    </p>
                </div>

            </div>
        </div>
    );
};

export default App;

