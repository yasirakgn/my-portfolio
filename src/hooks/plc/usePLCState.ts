import { useReducer, useCallback, useEffect, useRef } from "react";
import { plcReducer, initialState, PLC_ACTIONS } from "../plcReducer";
import { COLOR_MAP, PartInfo, DEFAULT_PART_QUEUE_TEXT } from "../../constants/simulationConstants";

export const usePLCState = () => {
    // --- State Management ---
    const [state, dispatch] = useReducer(plcReducer, initialState);

    // --- Data Refs (Pure Data, not UI physics) ---
    const partRecipeRef = useRef<PartInfo[]>([]);

    // --- Logic Helpers ---
    const initializeParts = useCallback(() => {
        const partsText = state.partQueueText.toUpperCase().split(',').map(s => s.trim()).filter(s => s.length > 0);
        const fullRecipe: PartInfo[] = [];
        const invalidParts: string[] = [];

        for (const partName of partsText) {
            const partInfo = COLOR_MAP[partName];
            if (partInfo) fullRecipe.push({ ...partInfo });
            else invalidParts.push(partName);
        }

        partRecipeRef.current = fullRecipe;
        dispatch({ type: PLC_ACTIONS.VALIDATE_RECIPE, count: fullRecipe.length });

        if (invalidParts.length > 0) {
            const availableNames = Object.values(COLOR_MAP).map(v => v.name).join(', ');
            dispatch({
                type: PLC_ACTIONS.SET_MESSAGE,
                payload: `🚨 Üretim planında GEÇERSİZ renkler: ${invalidParts.join(', ')}. Sadece: ${availableNames}`
            });
        } else if (fullRecipe.length > 0) {
            dispatch({
                type: PLC_ACTIONS.SET_MESSAGE,
                payload: `Üretim planı yüklendi: ${fullRecipe.length} parça. Sistem hazır.`
            });
        } else {
            dispatch({
                type: PLC_ACTIONS.SET_MESSAGE,
                payload: "Üretim planı boş veya geçersiz."
            });
        }
    }, [state.partQueueText]);

    // --- Handlers ---
    const setPartQueueText = useCallback((text: string) => {
        dispatch({ type: PLC_ACTIONS.SET_QUEUE_TEXT, payload: text });
    }, []);

    const toggleLiveMode = useCallback(() => {
        dispatch({ type: PLC_ACTIONS.TOGGLE_LIVE_MODE });
    }, []);

    const handleStart = useCallback(() => {
        if (!state.liveMode) initializeParts();

        setTimeout(() => {
            if (!state.liveMode && partRecipeRef.current.length === 0) {
                return dispatch({ type: PLC_ACTIONS.SET_MESSAGE, payload: "🔴 HATA: Üretim planı boş veya geçersiz!" });
            }
            if (!state.isRunning) {
                dispatch({ type: PLC_ACTIONS.START });
            }
        }, 50);
    }, [initializeParts, state.isRunning, state.liveMode]);

    const handleStop = useCallback(() => {
        dispatch({ type: PLC_ACTIONS.STOP });
    }, []);

    const handleReset = useCallback(() => {
        dispatch({ type: PLC_ACTIONS.RESET });
        setTimeout(() => initializeParts(), 0);
    }, [initializeParts]);

    // --- OEE Logic (Side Effect) ---
    useEffect(() => {
        if (!state.isRunning) return;

        const interval = setInterval(() => {
            const randomFluctuation = state.liveMode ? (Math.random() - 0.5) * 2 : 0;
            const newPerformance = Math.min(100, Math.max(60, 95 + randomFluctuation));
            const newAvailability = Math.min(100, Math.max(80, 98 + randomFluctuation));
            const newQuality = Math.min(100, Math.max(90, 99 + randomFluctuation));

            const metrics = {
                availability: Math.round(newAvailability),
                performance: Math.round(newPerformance),
                quality: Math.round(newQuality),
                oee: Math.round((newAvailability * newPerformance * newQuality) / 10000)
            };

            dispatch({ type: PLC_ACTIONS.UPDATE_METRICS, payload: metrics });
        }, 2000);

        return () => clearInterval(interval);
    }, [state.isRunning, state.liveMode]);

    // Init
    useEffect(() => { initializeParts(); }, [initializeParts]);

    return {
        state,
        dispatch,
        partRecipeRef,
        actions: {
            setPartQueueText,
            toggleLiveMode,
            handleStart,
            handleStop,
            handleReset,
            initializeParts
        }
    };
};
