# Audit Backlog — Prioritized Defect Register

Consolidated defect backlog derived from Phases 00 through 04, categorized according to the Master Index severity definitions:
- **P0 — Crash / Data Corruption:** Unhandled exceptions, infinite effect loops, state duplication.
- **P1 — Broken Layout / Resource Leaks:** Overlapping controls, unmanaged intervals, clipped viewports.
- **P2 — Cosmetic / Architecture Polish:** Build deprecations, duplicate notification systems, chunk sizes.
- **P3 — Hygiene / Dead Code:** Unused dependencies, dead exports, missing test infrastructure.

---

## 1. High Priority (P0 — Crash / Logic Corruption)

| ID | Severity | Location | Summary | Impact & Target Fix |
|---|---|---|---|---|
| **AUD-301** | **P0** | `src/components/fun/CatchTheBooksGameModal.tsx:167-198` | Cascading effect re-trigger on game over | Updating `highScore` inside the game-over effect re-triggers the effect, awarding double XP, replaying audio, and double-firing confetti. Fix by decoupling high-score state update or using a completion ref guard. |

---

## 2. Serious Defects (P1 — Broken Layout & Resource Leaks)

| ID | Severity | Location | Summary | Impact & Target Fix |
|---|---|---|---|---|
| **AUD-302** | **P1** | `src/App.tsx:1258-1272` | Leaked timer interval in order tracking | Rapid order tracking searches spawn unmanaged concurrent `setInterval` timers without clearance or cancellation. Fix by tracking interval via `useRef` and clearing existing timer before starting a new one. |
| **AUD-401** | **P1** | `src/components/fun/*.tsx` | Modal backdrop z-index collision | Modal dialog backdrops use `z-50`, colliding with the sticky navbar `<header className="sticky top-0 z-50">` in `App.tsx`. Fix by upgrading modal overlays to `z-[100]` to strictly supersede the sticky header. |
| **AUD-402** | **P1** | `src/components/fun/CatchTheBooksGameModal.tsx:380-388` | Modal vertical clipping on short viewports | Modal backdrop lacks `overflow-y-auto` and modal card lacks max-height constraints, causing clipping on viewports < 600px height. Fix by adding `overflow-y-auto` to the backdrop and `max-h-[92vh] overflow-y-auto` to the dialog container. |

---

## 3. Moderate Defects (P2 — Cosmetic & Architecture)

| ID | Severity | Location | Summary | Impact & Target Fix |
|---|---|---|---|---|
| **AUD-303** | **P2** | `vite.config.ts:11:27` | Deprecated Node.js `__dirname` in ESM config | Vite build produces deprecation warning for `__dirname`. Fix by using `import.meta.dirname` or modern path resolution. |
| **AUD-304** | **P2** | `vite.config.ts` | Monolithic client JS bundle chunk (>690 kB) | Single bundle chunk exceeds Vite's 500 kB recommendation. Fix by tuning manual chunks for third-party libraries (`react`, `motion`, `canvas-confetti`). |
| **AUD-403** | **P2** | `src/App.tsx:1409-1414`, `src/components/fun/FunToastContainer.tsx` | Competing duplicate toast notification systems | `App.tsx` has a bespoke bouncing toast at `top-20` while `FunToastContainer` renders at `bottom-6`. Fix by routing all toasts uniformly through `useFun().showFunToast`. |
| **AUD-404** | **P2** | `src/components/fun/MascotWidget.tsx:65-87` | Mascot speech bubble mobile viewport occlusion | Speech bubble (260px total with avatar) occludes majority of bottom screen on narrow 360px viewports. Fix by optimizing speech bubble width and responsive padding on mobile screens. |

---

## 4. Low Priority / Hygiene (P3 — Dead Code, Deps & Tests)

| ID | Severity | Location | Summary | Impact & Target Fix |
|---|---|---|---|---|
| **AUD-001** | **P3** | `package.json:19,28,10` | Orphaned Express dependency and obsolete clean script | Remove unused `express`, `@types/express`, and outdated `server.js` clean reference. |
| **AUD-002** | **P3** | `package.json:14,18,32,35` | Unused dependencies in package.json | Prune unused packages: `@google/genai`, `dotenv`, `autoprefixer`, `tsx`. |
| **AUD-101** | **P3** | `package.json:14,18,19,20,21` | Unused production dependencies | Prune unused production deps (`lucide-react`, `motion`, etc.) or reconcile usage. |
| **AUD-102** | **P3** | `package.json:28,32,35` | Unused devDependencies | Prune unneeded dev dependencies. |
| **AUD-103** | **P3** | `src/lib/fun/constants.ts`, `src/App.tsx` | Dead / unconsumed exports | Remove or consume unused exports (`FunnyReview`, `LOADING_MESSAGES`, `ProductLabStats`). |
| **AUD-104** | **P3** | `package.json:11` | Absence of dedicated linter config | Standardize `lint` script command. |
| **AUD-201** | **P3** | `package.json:6-12` | Missing test script | Add standard test runner script or test configuration. |
| **AUD-202** | **P3** | `package.json:26-37` | No test framework installed | Install Vitest or test runner for automated regression testing. |
| **AUD-203** | **P3** | `src/` | 0% automated test coverage | Create automated regression test specifications. |
| **AUD-204** | **P3** | `src/lib/fun/storage.ts`, `src/lib/fun/funContext.tsx` | Untested core business logic | Add automated unit tests covering storage, leveling, and cart logic. |
| **AUD-003** | **P3** | `package.json` | Missing test runner infrastructure | Consolidated into AUD-201 / AUD-202. |
| **AUD-004** | **P3** | `src/App.tsx:1-3082` | Monolithic root component | Plan component modularization in future architectural milestones. |
