# 🏭 Yagser Akgun | Industrial Automation & Software Portfolio

![Project Banner](https://img.shields.io/badge/Status-Production%20Ready-success?style=for-the-badge) ![Tech Stack](https://img.shields.io/badge/Stack-React%20%7C%20Vite%20%7C%20PLC-blue?style=for-the-badge) ![License](https://img.shields.io/badge/License-MIT-gray?style=for-the-badge)

Welcome to a **production-grade Industrial Automation & Simulation Portfolio**. This project bridges the gap between traditional **OT (Operational Technology)** and modern **IT (Web Technology)**, featuring a rigorously engineered Digital Twin of a manufacturing line.

🔗 **Live Deployment:** [yagserakgun.com](https://yagserakgun.com)

---

## 📖 Project Overview

This is not just a website; it is a **deterministic, browser-based factory simulation**.
Unlike simple animations, this system is driven by a real-time **PLC-style State Machine** that mimics the scan cycles of industrial controllers.

### ✨ Key Features
- **🤖 Digital Twin Simulation**: A physical model of a robotic manufacturing line with conveyors, sensors, and actuators.
- **⚡ Real-Time Logic**: Uses a deterministic `Scan Cycle` architecture (16ms heartbeat) to ensure logic safety.
- **🎮 HMI Operator Panel**: Full manual control (Start/Stop/Reset/Mode) mimicking physical industrial panels.
- **🌍 Internationalization (i18n)**: Hot-swappable language support (TR/EN) without breaking simulation logic.
- **📊 OEE Dashboard**: Real-time telemetry for Overall Equipment Effectiveness monitoring.

---

## 🏗️ Architecture Tree

The project follows a scalable, domain-driven structure designed for maintainability.

```text
src/
├── 🧩 components/
│   ├── ui/                 # Reusable Design System (Bento cards, Glass buttons)
│   ├── AiTerminal.jsx      # 🧠 AI Command Interface
│   ├── SimulationCanvas.jsx # 🎨 High-Performance Render Engine
│   ├── SimulationControls.jsx # 🎛️ Operator HMI Panel
│   └── ...
├── 📏 constants/
│   └── simulationConstants.ts # Physics, timing, and layout config
├── 🧠 hooks/
│   ├── plc/
│   │   ├── usePLCAnimation.ts # 🕹️ Physics Queue & Interpolation
│   │   └── usePLCState.ts     # 🏛️ State Management
│   └── usePLCLogic.ts      # ⚙️ Main Finite State Machine (The "CPU")
├── 🌐 i18n/
│   └── translations.js     # Dictionary for safety-critical UI text
└── 🚀 index.jsx
```

---

## 📂 Folder Responsibilities

### `src/components/` 🎨
Strict separation of **Presentation** and **Logic**.
- **`SimulationCanvas.jsx`**: A "Headless" compatible render engine. It draws the state of the machine but contains *zero* business logic.
- **`SimulationControls.jsx`**: Acts as the physical operator button panel.

### `src/hooks/plc/` 🧠
The "Brain" of the application.
- **`usePLCLogic.ts`**: Orchestrates the cycle, inputs, and outputs.
- **`plcReducer.ts`**: Defines strict FSM transitions (e.g., `PICK_UP` → `TRANSFER` → `DROP`).
- **`usePLCAnimation.ts`**: Handles **Inverse Kinematics (IK)** for the Robot Arm and Delta Time (dt) movement.

---

## 🛠️ Key Engineering Decisions

### 1. ⚙️ Deterministic State Machine
Instead of chaotic `setTimeout` calls, the system uses a rigid **Step Sequence**.
> **Why?** To prevent race conditions and ensure the simulation is pause-able, resumable, and mathematically reproducible.

### 2. 🔌 Decoupled "Headless" Logic
The simulation logic runs independently of the valid visual layer.
> **Why?** This mimics real SCADA architectures where the controller (PLC) runs regardless of whether the HMI screen is on or off.

### 3. 🏗️ Inverse Kinematics (IK)
The Robot Arm utilizes calculated joint angles for a simplified "Manhattan" motion profile (Lift-Traverse-Drop).
> **Why?** To accurately represent mechanical constraints rather than using simple CSS transitions.

### 4. 🛡️ Safety-Critical i18n
Translations are strictly isolated to the *View* layer.
> **Why?** Logic identifiers (`TYPE_A`, `STATUS_ERR`) are invariant. Changing the language to Turkish never risks a logic crash.

---

## 🎯 Target Audience

- **👨‍💻 Recruiters**: Demonstrates full-stack capability with complex state management.
- **🏭 Automation Engineers**: Validates understanding of PLC cycles and FSMs.
- **🎨 Frontend Developers**: Showcases React Optimization, Custom Hooks, and Canvas API.

---

© 2025 Yağser Akgün. Engineered for Performance.
