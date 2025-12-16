import { useRef, useCallback } from "react";
import {
    INPUT_CONVEYOR_Y,
    MAIN_OUTPUT_CONVEYOR_Y,
    BRANCH_OFFSET,
    ROBOT_BASE_X,
    ROBOT_BASE_Y,
    INPUT_PICKUP_X,
    CONVEYOR_SPEED_PPS, // New time-based speed
    ROBOT_MOVE_DECAY,   // New smoothing constant
    DIVERTER_X,
    BIN_X,
    PART_WIDTH,
    PART_HEIGHT,
    BIN_WIDTH,
    PartInfo
} from "../../constants/simulationConstants";

// --- Interfaces ---
export interface RobotPos {
    x: number;
    y: number;
}

export interface SimulationPart extends PartInfo {
    x: number;
    y: number;
    width: number;
    height: number;
    held: boolean;
    id: number;
    counted: boolean;
    isMoving?: boolean;
    conveyorPhase?: 'MAIN' | 'DIVERTER_MOVE' | 'BRANCH';
    conveyorId?: 'A' | 'B';
    targetY?: number;
    startY?: number;
    diverterProgress?: number;
}

export const usePLCAnimation = () => {
    // --- Physics Refs ---
    const robotPosRef = useRef<RobotPos>({ x: ROBOT_BASE_X, y: ROBOT_BASE_Y });
    const targetRef = useRef<RobotPos>({ x: ROBOT_BASE_X, y: ROBOT_BASE_Y });

    // Nullable refs need explicit null initialization type
    const robotPartRef = useRef<SimulationPart | null>(null);
    const outputPartsRef = useRef<SimulationPart[]>([]);
    const inputPartRef = useRef<SimulationPart | null>(null);

    // --- Movement Logic ---
    const moveRobotTo = useCallback((x: number, y: number) => {
        targetRef.current = { x, y };
    }, []);

    const resetPositions = useCallback(() => {
        robotPosRef.current = { x: ROBOT_BASE_X, y: ROBOT_BASE_Y };
        targetRef.current = { x: ROBOT_BASE_X, y: ROBOT_BASE_Y };
        robotPartRef.current = null;
        outputPartsRef.current = [];
        inputPartRef.current = null;
    }, []);

    const updateConveyorMovement = useCallback((dt: number, onFinished: (p: SimulationPart) => void) => {
        const nextOutputParts: SimulationPart[] = [];
        const moveDist = CONVEYOR_SPEED_PPS * dt;

        // Input conveyor
        if (inputPartRef.current && inputPartRef.current.x < INPUT_PICKUP_X) {
            inputPartRef.current.x += moveDist * 0.5; // Input is slower? Keeping original * 0.5 ratio
        }

        // Output conveyor
        outputPartsRef.current.forEach(p => {
            if (!p.isMoving) { nextOutputParts.push(p); return; }

            if (p.conveyorPhase === 'MAIN') {
                p.x += moveDist;
                if (p.x >= DIVERTER_X - PART_WIDTH / 2) {
                    p.conveyorPhase = 'DIVERTER_MOVE';
                    p.startY = p.y;
                    p.diverterProgress = 0;
                }
            } else if (p.conveyorPhase === 'DIVERTER_MOVE') {
                const diverterProgress = p.diverterProgress || 0;
                const startY = p.startY || p.y;
                const targetY = p.targetY || p.y;

                // Original: progress += 0.05 per frame
                // 0.05 * 60 = 3.0 units per second
                const DIVERTER_SPEED = 3.0; // progress per second

                p.diverterProgress = diverterProgress + (DIVERTER_SPEED * dt);
                p.x += moveDist * 0.5;
                p.y = startY + (targetY - startY) * Math.min(p.diverterProgress, 1);

                if (p.diverterProgress >= 1) {
                    p.conveyorPhase = 'BRANCH';
                    p.y = targetY;
                }
            } else if (p.conveyorPhase === 'BRANCH') {
                p.x += moveDist;
                if (p.x >= BIN_X) {
                    p.isMoving = false;
                    p.x = BIN_X + (BIN_WIDTH / 2) - (PART_WIDTH / 2);
                    if (!p.counted) {
                        p.counted = true;
                        onFinished(p);
                    }
                }
            }
            nextOutputParts.push(p);
        });

        outputPartsRef.current = nextOutputParts;
    }, []);

    const updateRobotAnimation = useCallback((dt: number) => {
        // Time-based smoothing (Exponential Decay)
        // pos = lerp(pos, target, 1 - exp(-k * dt))
        const k = ROBOT_MOVE_DECAY;
        const alpha = 1 - Math.exp(-k * dt);

        robotPosRef.current.x += (targetRef.current.x - robotPosRef.current.x) * alpha;
        robotPosRef.current.y += (targetRef.current.y - robotPosRef.current.y) * alpha;
    }, []);

    return {
        robotPosRef,
        targetRef,
        robotPartRef,
        outputPartsRef,
        inputPartRef,
        actions: {
            moveRobotTo,
            updateConveyorMovement,
            updateRobotAnimation,
            resetPositions
        }
    };
};
