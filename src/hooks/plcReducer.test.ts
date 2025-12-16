import { plcReducer, initialState, PLC_ACTIONS, PLCState } from './plcReducer';

describe('PLC Reducer Logic', () => {

    it('should return initial state', () => {
        // @ts-ignore - Intentionally passing undefined to test default case if applicable or just strictly calling reducer
        // In strict TS reducer usually expects state, but we test logic
        const state = plcReducer(initialState, { type: PLC_ACTIONS.RESET });
        expect(state).toEqual(expect.objectContaining({
            step: 0,
            isRunning: false
        }));
    });

    it('should handle START action', () => {
        const nextState = plcReducer(initialState, { type: PLC_ACTIONS.START });
        expect(nextState.isRunning).toBe(true);
        expect(nextState.message).toContain("BAŞLADI");
    });

    it('should handle STOP action', () => {
        const runningState: PLCState = { ...initialState, isRunning: true };
        const nextState = plcReducer(runningState, { type: PLC_ACTIONS.STOP });
        expect(nextState.isRunning).toBe(false);
    });

    it('should toggle LIVE MODE properly', () => {
        const nextState = plcReducer(initialState, { type: PLC_ACTIONS.TOGGLE_LIVE_MODE });
        expect(nextState.liveMode).toBe(true);
        // Live mode toggle should stop running to be safe
        expect(nextState.isRunning).toBe(false);

        const offlineState = plcReducer(nextState, { type: PLC_ACTIONS.TOGGLE_LIVE_MODE });
        expect(offlineState.liveMode).toBe(false);
    });

    it('should update OEE metrics', () => {
        const metrics = { availability: 80, performance: 80, quality: 100, oee: 64 };
        const nextState = plcReducer(initialState, {
            type: PLC_ACTIONS.UPDATE_METRICS,
            payload: metrics
        });
        expect(nextState.oeeMetrics).toEqual(metrics);
    });

    it('should increment cycle count', () => {
        const nextState = plcReducer(initialState, { type: PLC_ACTIONS.INCREMENT_CYCLE });
        expect(nextState.cycleCount).toBe(initialState.cycleCount + 1);
    });

    it('should validate recipe length', () => {
        const nextState = plcReducer(initialState, {
            type: PLC_ACTIONS.VALIDATE_RECIPE,
            count: 5
        });
        expect(nextState.validRecipeLength).toBe(5);
    });
});
