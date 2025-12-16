import { DEFAULT_PART_QUEUE_TEXT } from "../constants/simulationConstants";

// --- Action Types ---
export enum PLC_ACTIONS {
    START = 'START',
    STOP = 'STOP',
    RESET = 'RESET',
    TOGGLE_LIVE_MODE = 'TOGGLE_LIVE_MODE',
    SET_QUEUE_TEXT = 'SET_QUEUE_TEXT',
    UPDATE_METRICS = 'UPDATE_METRICS',
    SET_MESSAGE = 'SET_MESSAGE',
    NEXT_STEP = 'NEXT_STEP',
    INCREMENT_CYCLE = 'INCREMENT_CYCLE',
    INCREMENT_FINISHED = 'INCREMENT_FINISHED',
    VALIDATE_RECIPE = 'VALIDATE_RECIPE'
}

// --- Interfaces ---
export interface OeeMetrics {
    availability: number;
    performance: number;
    quality: number;
    oee: number;
}

export interface PLCState {
    isRunning: boolean;
    step: number;
    cycleCount: number;
    finishedCount: number;
    message: string;
    partQueueText: string;
    validRecipeLength: number;
    liveMode: boolean;
    oeeMetrics: OeeMetrics;
}

// --- Action Unions (Discriminated Union) ---
export type UtilsAction =
    | { type: PLC_ACTIONS.START }
    | { type: PLC_ACTIONS.STOP }
    | { type: PLC_ACTIONS.RESET }
    | { type: PLC_ACTIONS.TOGGLE_LIVE_MODE }
    | { type: PLC_ACTIONS.INCREMENT_CYCLE }
    | { type: PLC_ACTIONS.INCREMENT_FINISHED }
    | { type: PLC_ACTIONS.SET_QUEUE_TEXT; payload: string }
    | { type: PLC_ACTIONS.SET_MESSAGE; payload: string }
    | { type: PLC_ACTIONS.NEXT_STEP; payload: number }
    | { type: PLC_ACTIONS.UPDATE_METRICS; payload: OeeMetrics }
    | { type: PLC_ACTIONS.VALIDATE_RECIPE; count: number; payload?: string };

// --- Initial State ---
export const initialState: PLCState = {
    isRunning: false,
    step: 0,
    cycleCount: 0,
    finishedCount: 0,
    message: "Üretim planını düzenleyin ve başlamak için START'a basın.",
    partQueueText: DEFAULT_PART_QUEUE_TEXT,
    validRecipeLength: 0,
    liveMode: false,
    oeeMetrics: {
        availability: 100,
        performance: 100,
        quality: 100,
        oee: 100
    }
};

// --- Reducer Function ---
export function plcReducer(state: PLCState, action: UtilsAction): PLCState {
    switch (action.type) {
        case PLC_ACTIONS.START:
            return {
                ...state,
                isRunning: true,
                step: state.step === 0 ? 0 : state.step,
                message: state.liveMode ? "🟢 ONLINE MOD: Canlı veri akışı başladı..." : "Simülasyon BAŞLADI."
            };

        case PLC_ACTIONS.STOP:
            return {
                ...state,
                isRunning: false,
                message: "🔴 Simülasyon DURDURULDU."
            };

        case PLC_ACTIONS.RESET:
            return {
                ...initialState,
                liveMode: state.liveMode, // Preserve mode
                partQueueText: DEFAULT_PART_QUEUE_TEXT
            };

        case PLC_ACTIONS.TOGGLE_LIVE_MODE:
            const newMode = !state.liveMode;
            return {
                ...state,
                liveMode: newMode,
                isRunning: false,
                message: newMode ? "📡 Live Mod Aktif: PLC'den veri bekleniyor..." : "Offline Simülasyon Modu"
            };

        case PLC_ACTIONS.SET_QUEUE_TEXT:
            return {
                ...state,
                partQueueText: action.payload
            };

        case PLC_ACTIONS.VALIDATE_RECIPE:
            return {
                ...state,
                validRecipeLength: action.count
            };

        case PLC_ACTIONS.UPDATE_METRICS:
            return {
                ...state,
                oeeMetrics: action.payload
            };

        case PLC_ACTIONS.SET_MESSAGE:
            return {
                ...state,
                message: action.payload
            };

        case PLC_ACTIONS.NEXT_STEP:
            return {
                ...state,
                step: action.payload
            };

        case PLC_ACTIONS.INCREMENT_CYCLE:
            return {
                ...state,
                cycleCount: state.cycleCount + 1
            };

        case PLC_ACTIONS.INCREMENT_FINISHED:
            return {
                ...state,
                finishedCount: state.finishedCount + 1
            };

        default:
            return state;
    }
}
