# Architecture Map — StudySprint

## 1. Detected Stack & Manifests

- **Runtime / Framework:** React 19.0.1 (Single-Page Application) on Vite 8.3.0
- **Language:** TypeScript 7.0.2 / ES2022 (`tsconfig.json`)
- **Styling:** Tailwind CSS 4.3.3 via `@tailwindcss/vite` plugin and `@import "tailwindcss"` in `src/index.css`
- **Animation & FX:** `motion` 12.23.24, `canvas-confetti` 1.9.4
- **Iconography:** `lucide-react` 0.546.0
- **Package Management:** Authoritative lockfile `bun.lock` (no `package-lock.json` or `yarn.lock`)
- **State Management:** React Context (`FunProvider` in `src/lib/fun/funContext.tsx`) + component local `useState` in `App.tsx` and modal components. Persistent state via `localStorage` wrapper in `src/lib/fun/storage.ts`.
- **Audio Engine:** Web Audio API synthesized procedural sounds (`src/lib/fun/sound.ts`).

### Manifests & Configs
| Config File | Role | Key Settings |
|-------------|------|--------------|
| `package.json` | Project manifest & scripts | `dev`, `build`, `preview`, `clean`, `lint` |
| `bun.lock` | Bun lockfile | Authoritative dependency tree |
| `tsconfig.json` | TypeScript config | Target `ES2022`, module `ESNext`, moduleResolution `bundler`, paths `@/*` -> `./*` |
| `vite.config.ts` | Vite build config | `@vitejs/plugin-react`, `@tailwindcss/vite`, alias `@` -> root |
| `metadata.json` | AI Studio applet metadata | Name: StudySprint - Doodle Study Kits & Stationery |
| `.env.example` | Environment template | `GEMINI_API_KEY`, `APP_URL` |

### Build, Run, and Quality Commands
- **Install:** `npm install` (or `bun install`)
- **Dev Server:** `npm run dev` (`vite --port=3000 --host=0.0.0.0`)
- **Production Build:** `npm run build` (`vite build`)
- **Preview:** `npm run preview` (`vite preview`)
- **Lint / Type-Check:** `npm run lint` (`tsc --noEmit`)
- **Test:** None defined in `package.json`

---

## 2. Route & Page Inventory

The application is an interactive Single Page Application (SPA) without client-side route transitions (no React Router or file-based routing). It renders a main interactive view with sectional anchors and modular modal dialogs.

| Route / View | Source File | Type / Trigger | Linked from UI | Notes |
|---|---|---|---|---|
| `/` | `src/App.tsx` | Main SPA Page | Yes (Entry point) | Contains Hero, Products Catalog, Kit Builder, Reviews, Tracking, FAQ, Footer |
| Modal: Academic Checkout | `src/components/fun/AcademicCheckoutModal.tsx` | Dialog Modal (`checkoutOpen`) | Yes | Modal checkout flow with payment options and address input |
| Modal: Catch The Books | `src/components/fun/CatchTheBooksGameModal.tsx` | Dialog Modal (`gameCatchBooksOpen`) | Yes | Mini-game modal with keyboard/touch basket controls |
| Modal: Exam Survival | `src/components/fun/ExamSurvivalGameModal.tsx` | Dialog Modal (`gameSurvivalOpen`) | Yes | Mini-game survival runner with quick-time decisions |
| Modal: Achievement Showcase | `src/components/fun/AchievementModal.tsx` | Dialog Modal (`achievementModalOpen`) | Yes | 15 unlockable achievements with progress bars and rewards |
| Modal: Brain Battery | `src/components/fun/BrainBatteryModal.tsx` | Dialog Modal (`brainBatteryOpen`) | Yes | Interactive brain charge diagnostics & recovery actions |
| Modal: Behavioral Analysis | `src/components/fun/BehaviorAnalysisModal.tsx` | Dialog Modal (`behaviorModalOpen`) | Yes | Academic behavior diagnostic questionnaire |
| Modal: Degree Generator | `src/components/fun/DegreeGeneratorModal.tsx` | Dialog Modal (`degreeModalOpen`) | Yes | Parody degree certificate generator |
| Modal: Future Predictor | `src/components/fun/FuturePredictorModal.tsx` | Dialog Modal (`futurePredictorOpen`) | Yes | Fortune-teller style academic prediction generator |
| Modal: Product Lab | `src/components/fun/ProductLabModal.tsx` | Dialog Modal (`productLabOpen`) | Yes | Custom stationery recipe mixing simulator |
| Modal: Compatibility Scanner | `src/components/fun/CompatibilityScannerModal.tsx` | Dialog Modal (`compatModalOpen`) | Yes | Study partner compatibility calculator |
| Modal: Suspicious Activity | `src/components/fun/SuspiciousActivityModal.tsx` | Dialog Modal (`suspiciousModalOpen`) | Yes | Humorous "Over-Studying Alert" modal |
| Modal: Dev Diagnostics | `src/components/fun/DevDiagnosticsModal.tsx` | Dialog Modal (`devDiagnosticsOpen`) | Yes | Developer diagnostics and state inspect panel |

---

## 3. Component & Module Inventory

All components are located under `src/components/fun/` and re-exported via `src/components/fun/index.ts`. All components are actively referenced and mounted in `App.tsx`.

| Component / Module | Path | Purpose | Importers / Consumers | Status |
|---|---|---|---|---|
| `App` | `src/App.tsx` | Root application component | `src/main.tsx` | Active |
| `AcademicCheckoutModal` | `src/components/fun/AcademicCheckoutModal.tsx` | Parody and functional checkout dialog | `App.tsx`, `index.ts` | Active |
| `AchievementModal` | `src/components/fun/AchievementModal.tsx` | Achievement display and unlock rewards | `App.tsx`, `index.ts` | Active |
| `BehaviorAnalysisModal` | `src/components/fun/BehaviorAnalysisModal.tsx` | Study habit diagnostics modal | `App.tsx`, `index.ts` | Active |
| `BrainBatteryModal` | `src/components/fun/BrainBatteryModal.tsx` | Energy/burnout monitoring modal | `App.tsx`, `index.ts` | Active |
| `CatchTheBooksGameModal` | `src/components/fun/CatchTheBooksGameModal.tsx` | Falling items mini-game modal | `App.tsx`, `index.ts` | Active |
| `CompatibilityScannerModal`| `src/components/fun/CompatibilityScannerModal.tsx` | Partner compatibility tool | `App.tsx`, `index.ts` | Active |
| `DegreeGeneratorModal` | `src/components/fun/DegreeGeneratorModal.tsx` | Parody diploma generator | `App.tsx`, `index.ts` | Active |
| `DevDiagnosticsModal` | `src/components/fun/DevDiagnosticsModal.tsx` | Internal state & event debugger | `App.tsx`, `index.ts` | Active |
| `DoNotClickWidget` | `src/components/fun/DoNotClickWidget.tsx` | Floating reverse-psychology button | `App.tsx`, `index.ts` | Active |
| `ExamSurvivalGameModal` | `src/components/fun/ExamSurvivalGameModal.tsx` | Quiz / decision survival mini-game | `App.tsx`, `index.ts` | Active |
| `FunHeaderControls` | `src/components/fun/FunHeaderControls.tsx` | Sound, panic button, mini-game menu | `App.tsx`, `index.ts` | Active |
| `FunToastContainer` | `src/components/fun/FunToastContainer.tsx` | Notification toaster popup overlay | `App.tsx`, `index.ts` | Active |
| `FuturePredictorModal` | `src/components/fun/FuturePredictorModal.tsx` | Exam outcome prophecy generator | `App.tsx`, `index.ts` | Active |
| `LiveActivityTicker` | `src/components/fun/LiveActivityTicker.tsx` | Real-time parody student events bar | `App.tsx`, `index.ts` | Active |
| `MascotWidget` | `src/components/fun/MascotWidget.tsx` | Floating Sprinty mascot with dialogue | `App.tsx`, `index.ts` | Active |
| `ProductLabModal` | `src/components/fun/ProductLabModal.tsx` | Custom item creation simulator | `App.tsx`, `index.ts` | Active |
| `SuspiciousActivityModal` | `src/components/fun/SuspiciousActivityModal.tsx` | Academic misconduct parody popup | `App.tsx`, `index.ts` | Active |
| `funContext` | `src/lib/fun/funContext.tsx` | Global audio, XP, streak, achievement state | 18 files | Active |
| `soundEngine` | `src/lib/fun/sound.ts` | Synthesized Web Audio sound effects | 5 files | Active |
| `storage` | `src/lib/fun/storage.ts` | Safe localStorage wrapper with fallbacks | `funContext.tsx` | Active |
| `constants` | `src/lib/fun/constants.ts` | Achievements, quotes, products, messages | 4 files | Active |
| `types` | `src/lib/fun/types.ts` | TypeScript interface definitions | 4 files | Active |

---

## 4. Directory Purpose Summary

| Directory | Purpose |
|---|---|
| `/` | Configuration files (`package.json`, `tsconfig.json`, `vite.config.ts`), HTML entry `index.html`, git metadata |
| `/public/` | Public assets directory served statically by Vite |
| `/public/assets/aistudio/` | AI Studio placeholder asset folder |
| `/src/` | Primary source code root |
| `/src/components/fun/` | Feature components, modals, floating widgets, and UI controls |
| `/src/lib/fun/` | Core logic: Web Audio engine, React context provider, constants, storage, and types |
| `/audit/` | Audit artifacts, reports, logs, and screenshots |

---

## 5. Structural Inconsistencies & Anomalies

| ID | Severity (proposed) | Location | Description | Evidence |
|---|---|---|---|---|
| AUD-001 | P3 | `package.json:19,28,10` | Orphaned Express dependency and obsolete clean target (`server.js`) with no backend entry point | `package.json` |
| AUD-002 | P3 | `package.json:14,18,32,35` | Unused dependencies: `@google/genai`, `dotenv`, `autoprefixer`, and `tsx` are installed but never imported or referenced in scripts | `package.json`, `grep` logs |
| AUD-003 | P3 | `package.json:6-12` | Missing test script and complete lack of automated test files or test runner configuration | `package.json` |
| AUD-004 | P3 | `src/App.tsx:1-3082` | Monolithic root component exceeding 3,000 lines containing mixed business logic, mock data, and multiple section templates | `src/App.tsx` |
