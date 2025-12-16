export const INPUT_CONVEYOR_Y = 300;
export const MAIN_OUTPUT_CONVEYOR_Y = 150;
export const BRANCH_OFFSET = 60;
export const ROBOT_BASE_X = 150;
export const ROBOT_BASE_Y = 250;
export const INPUT_CONVEYOR_START_X = ROBOT_BASE_X + 50;
export const INPUT_PICKUP_X = 250;
export const OUTPUT_DROP_X = 350;
export const DIVERTER_X = 550;
// export const CONVEYOR_SPEED = 2; // Old frame-based speed
export const CONVEYOR_SPEED_PPS = 120; // 2 pixels * 60 fps = 120 px/sec
export const ROBOT_MOVE_DECAY = 8.0; // Tuned for approx 0.1 lerp @ 60fps
export const BRANCH_A_Y = MAIN_OUTPUT_CONVEYOR_Y - BRANCH_OFFSET;
export const BRANCH_B_Y = MAIN_OUTPUT_CONVEYOR_Y + BRANCH_OFFSET;
export const SENSOR_X = 750;
export const BIN_X = SENSOR_X + 150;
export const PART_WIDTH = 30;
export const PART_HEIGHT = 30;
export const BIN_WIDTH = 50;
export const ORIGINAL_WIDTH = 800;
export const ORIGINAL_HEIGHT = 400;

export type PartType = "TYPE_A" | "TYPE_B";

export interface PartInfo {
    color: string;
    type: PartType;
    name: string;
}

export const COLOR_MAP: Record<string, PartInfo> = {
    "MAVI": { color: "#2563EB", type: "TYPE_A", name: "Mavi" },
    "KIRMIZI": { color: "#DC2626", type: "TYPE_B", name: "Kırmızı" },
    "YESIL": { color: "#10B981", type: "TYPE_A", name: "Yeşil" },
    "SARI": { color: "#F59E0B", type: "TYPE_B", name: "Sarı" },
    "MOR": { color: "#9333EA", type: "TYPE_A", name: "Mor" },
};

export const DEFAULT_PART_QUEUE_TEXT = "Mavi, Kırmızı, Yeşil, Mavi, Sarı, Kırmızı, Mor";
