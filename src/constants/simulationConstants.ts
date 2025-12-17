export const INPUT_CONVEYOR_Y = 350; // Input (Lower Left)
export const MAIN_OUTPUT_CONVEYOR_Y = 200; // Output (Upper Right)
export const BRANCH_OFFSET = 80; // Wider branch separation
export const ROBOT_BASE_X = 375; // Centered between Pickup (300) and Drop (450)
export const ROBOT_BASE_Y = 275; // Slightly above Input
export const INPUT_CONVEYOR_START_X = 50;
export const INPUT_PICKUP_X = 300; // Robot pickup point
export const OUTPUT_DROP_X = 450; // Robot drop point
export const DIVERTER_X = 850; // Late diversion to show buffer
export const // Speed
    CONVEYOR_SPEED_PPS = 140; // Slightly faster for longer distance

export const ROBOT_MOVE_DECAY = 8.0;

export const BRANCH_A_Y = MAIN_OUTPUT_CONVEYOR_Y - BRANCH_OFFSET;
export const BRANCH_B_Y = MAIN_OUTPUT_CONVEYOR_Y + BRANCH_OFFSET;

export const SENSOR_X = 1000; // Post-diverter
export const BIN_X = 1100; // Near end
export const BOXING_STATION_X = 1180; // New station at end

export const PART_WIDTH = 32; // Slightly larger
export const PART_HEIGHT = 32;
export const BIN_WIDTH = 60;

export const ORIGINAL_WIDTH = 1200; // Widescreen industrial view
export const ORIGINAL_HEIGHT = 500; // Taller for perspective

export type PartType = "TYPE_A" | "TYPE_B";

export interface PartInfo {
    color: string;
    type: PartType;
    name: string;
}

export const COLOR_MAP: Record<string, PartInfo> = {
    "MAVI": { color: "#2563EB", type: "TYPE_A", name: "sim.color.blue" },
    "KIRMIZI": { color: "#DC2626", type: "TYPE_B", name: "sim.color.red" },
    "YESIL": { color: "#10B981", type: "TYPE_A", name: "sim.color.green" },
    "SARI": { color: "#F59E0B", type: "TYPE_B", name: "sim.color.yellow" },
    "MOR": { color: "#9333EA", type: "TYPE_A", name: "sim.color.purple" },
};

export const DEFAULT_PART_QUEUE_TEXT = "Mavi, Kırmızı, Yeşil, Mavi, Sarı, Kırmızı, Mor";
