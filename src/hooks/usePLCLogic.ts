import React, { useCallback } from "react";
import { usePLCState } from "./plc/usePLCState";
import { usePLCAnimation, SimulationPart } from "./plc/usePLCAnimation";
import { PLC_ACTIONS } from "./plcReducer";
import {
    INPUT_CONVEYOR_Y,
    MAIN_OUTPUT_CONVEYOR_Y,
    BRANCH_OFFSET,
    ROBOT_BASE_X,
    ROBOT_BASE_Y,
    INPUT_CONVEYOR_START_X,
    INPUT_PICKUP_X,
    OUTPUT_DROP_X,
    PART_WIDTH,
    PART_HEIGHT,
    COLOR_MAP,
    PartInfo,
    PartType
} from "../constants/simulationConstants";

const distance = (a: { x: number, y: number }, b: { x: number, y: number }) => Math.sqrt((a.x - b.x) ** 2 + (a.y - b.y) ** 2);

export const usePLCLogic = () => {
    // 1. Brain (State & Logic)
    const { state, dispatch, partRecipeRef, actions: stateActions } = usePLCState();

    // 2. Body (Physics & Animation)
    const {
        robotPosRef,
        targetRef,
        moveQueueRef,
        robotPartRef,
        outputPartsRef,
        inputPartRef,
        actions: animActions
    } = usePLCAnimation();

    // 3. Controller Logic (The Glue)

    // Bridge: Handle part reaching bin (Physics -> State)
    const handlePartFinished = useCallback((p: SimulationPart) => {
        dispatch({ type: PLC_ACTIONS.INCREMENT_FINISHED });
        dispatch({ type: PLC_ACTIONS.SET_MESSAGE, payload: { key: "sim.msg.part_placed", params: { name: p.name, bin: p.conveyorId } } });
    }, [dispatch]);

    const updateConveyorMovement = useCallback((dt: number) => {
        animActions.updateConveyorMovement(dt, handlePartFinished);
    }, [animActions, handlePartFinished]);

    const updateRobotAnimation = useCallback((dt: number) => {
        animActions.updateRobotAnimation(dt);
    }, [animActions]);

    const spawnNewPart = useCallback(() => {
        if (state.liveMode || partRecipeRef.current.length > 0) {
            let nextPart: PartInfo;
            if (state.liveMode) {
                const colors = Object.values(COLOR_MAP);
                nextPart = colors[Math.floor(Math.random() * colors.length)];
            } else {
                const shifted = partRecipeRef.current.shift();
                if (!shifted) return;
                nextPart = shifted;
            }

            inputPartRef.current = {
                x: INPUT_CONVEYOR_START_X,
                y: INPUT_CONVEYOR_Y - PART_HEIGHT,
                width: PART_WIDTH,
                height: PART_HEIGHT,
                color: nextPart.color,
                type: nextPart.type as PartType,
                name: nextPart.name,
                held: false,
                id: Date.now() + Math.random(),
                counted: false,
            };
            dispatch({ type: PLC_ACTIONS.SET_MESSAGE, payload: { key: "sim.msg.new_part", params: { name: nextPart.name } } });
        }
    }, [state.liveMode, partRecipeRef, inputPartRef, dispatch]);

    // FSM Controller Logic
    const runPLCStep = useCallback(() => {
        const steps: Record<number, () => void> = {
            0: () => {
                const shouldSpawn = state.liveMode
                    ? (robotPartRef.current === null && inputPartRef.current === null)
                    : (robotPartRef.current === null && inputPartRef.current === null && partRecipeRef.current.length > 0);

                if (shouldSpawn) spawnNewPart();

                if (inputPartRef.current && inputPartRef.current.x >= INPUT_PICKUP_X) {
                    dispatch({ type: PLC_ACTIONS.NEXT_STEP, payload: 10 });
                } else if (
                    !state.liveMode &&
                    partRecipeRef.current.length === 0 &&
                    outputPartsRef.current.every(p => !p.isMoving && p.counted) &&
                    !inputPartRef.current &&
                    !robotPartRef.current
                ) {
                    dispatch({ type: PLC_ACTIONS.SET_MESSAGE, payload: { key: "sim.msg.all_processed" } });
                    dispatch({ type: PLC_ACTIONS.STOP });
                }
            },
            10: () => {
                if (!inputPartRef.current) return dispatch({ type: PLC_ACTIONS.NEXT_STEP, payload: 0 });
                animActions.moveRobotTo(inputPartRef.current.x + PART_WIDTH / 2, inputPartRef.current.y + PART_HEIGHT / 2);
                if (distance(robotPosRef.current, targetRef.current) < 5) dispatch({ type: PLC_ACTIONS.NEXT_STEP, payload: 20 });
            },
            20: () => {
                if (inputPartRef.current) {
                    const grippedPart = { ...inputPartRef.current, held: true };
                    robotPartRef.current = grippedPart;
                    inputPartRef.current = null;
                    dispatch({ type: PLC_ACTIONS.SET_MESSAGE, payload: { key: "sim.msg.part_gripped", params: { name: grippedPart.name } } });
                    setTimeout(() => dispatch({ type: PLC_ACTIONS.NEXT_STEP, payload: 30 }), 300);
                } else dispatch({ type: PLC_ACTIONS.NEXT_STEP, payload: 0 });
            },
            30: () => {
                // Deadlock Fix: Check if we are already animating (queue has items)
                // or if we are already targeting the drop point.

                const isTargetingDrop = distance(targetRef.current, { x: OUTPUT_DROP_X, y: MAIN_OUTPUT_CONVEYOR_Y - PART_HEIGHT / 2 }) < 1;
                const isAnimating = moveQueueRef.current.length > 0;

                if (!isTargetingDrop && !isAnimating) {
                    // We haven't issued the final move sequence yet
                    // Issue the Lift Sequence
                    const SAFE_LIFT_Y = MAIN_OUTPUT_CONVEYOR_Y - 80; // High clearance

                    // 1. Lift UP
                    // 2. Traverse to Drop X
                    // 3. Lower to Drop Y
                    animActions.queueMove([
                        { x: INPUT_PICKUP_X, y: SAFE_LIFT_Y },
                        { x: OUTPUT_DROP_X, y: SAFE_LIFT_Y },
                        { x: OUTPUT_DROP_X, y: MAIN_OUTPUT_CONVEYOR_Y - PART_HEIGHT / 2 }
                    ]);
                }

                // Transition Condition: Reached Final Target
                if (distance(robotPosRef.current, { x: OUTPUT_DROP_X, y: MAIN_OUTPUT_CONVEYOR_Y - PART_HEIGHT / 2 }) < 5) {
                    dispatch({ type: PLC_ACTIONS.NEXT_STEP, payload: 40 });
                }
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
                    dispatch({ type: PLC_ACTIONS.SET_MESSAGE, payload: { key: "sim.msg.part_dropped", params: { name: partToDrop.name } } });
                    setTimeout(() => dispatch({ type: PLC_ACTIONS.NEXT_STEP, payload: 50 }), 500);
                } else dispatch({ type: PLC_ACTIONS.NEXT_STEP, payload: 0 });
            },
            50: () => {
                animActions.moveRobotTo(ROBOT_BASE_X, ROBOT_BASE_Y);
                if (distance(robotPosRef.current, targetRef.current) < 5) {
                    dispatch({ type: PLC_ACTIONS.INCREMENT_CYCLE });
                    dispatch({ type: PLC_ACTIONS.NEXT_STEP, payload: 0 });
                    dispatch({ type: PLC_ACTIONS.SET_MESSAGE, payload: { key: "sim.msg.cycle_complete" } });
                }
            },
        };

        if (steps[state.step]) steps[state.step]();
    }, [state.step, state.liveMode, spawnNewPart, animActions, robotPosRef, targetRef, inputPartRef, robotPartRef, outputPartsRef, partRecipeRef, dispatch]);


    // Override Reset Action to include Animation Reset
    const handleReset = useCallback(() => {
        stateActions.handleReset();
        animActions.resetPositions();
    }, [stateActions, animActions]);

    return React.useMemo(() => ({
        state,
        refs: {
            robotPosRef,
            targetRef,
            robotPartRef,
            outputPartsRef,
            inputPartRef,
            partRecipeRef
        },
        actions: {
            setPartQueueText: stateActions.setPartQueueText,
            handleStart: stateActions.handleStart,
            handleStop: stateActions.handleStop,
            handleReset, // Used the wrapped reset
            runPLCStep,
            updateConveyorMovement,
            updateRobotAnimation,
            toggleLiveMode: stateActions.toggleLiveMode
        }
    }), [
        state,
        robotPosRef, targetRef, robotPartRef, outputPartsRef, inputPartRef, partRecipeRef,
        stateActions, handleReset, runPLCStep, updateConveyorMovement, animActions
    ]);
};

