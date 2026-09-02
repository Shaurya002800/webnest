# WebNest Street System Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build the approved third-frame street scene as a responsive, interactive continuation of the WebNest room-to-building journey.

**Architecture:** A pure `getStreetSystemState(progress)` function owns deterministic scroll choreography. `StreetCity3D.tsx` builds one Three.js scene from a small curated set of CC0 glTF assets, while `StreetSystem.tsx` renders semantic waypoints, publishes street progress to the existing global butterfly director, and isolates pointer parallax from scroll state. `Homepage.tsx` swaps the static system block for this component while `src/styles.css` owns responsive HTML overlays and fallbacks.

**Tech Stack:** React 19, TypeScript/TSX, Three.js, glTF/GLB, GSAP-compatible CSS variables, Lenis, Vitest, Testing Library, Vite.

**Spec:** `docs/superpowers/specs/2026-09-01-webnest-street-system-design.md`

## Global Constraints

- Keep `.openai/hosting.json`, `worker/index.js`, `scripts/prepare-sites-build.mjs`, and `tests/sites-worker.test.mjs` intact.
- Build UI only in `src/` and assets in `public/assets/`.
- Preserve the single global butterfly and canonical conversion routes `/free-audit` and `/start-project`.
- Use real CC0 3D city components and props; no photographic city plate and no CSS/div/SVG city artwork.
- Honor `prefers-reduced-motion` and keyboard access.

---

### Task 1: Deterministic street choreography

**Files:**
- Create: `src/prototype/street-system.test.ts`
- Create: `src/prototype/street-system.ts`

**Interfaces:**
- Consumes: a normalized numeric scroll progress.
- Produces: `getStreetSystemState(progress): StreetSystemState` with `phase`, `activeStep`, camera values, route progress and butterfly pose.

- [ ] **Step 1: Write the failing state tests**

```ts
expect(getStreetSystemState(0).phase).toBe('arrival')
expect(getStreetSystemState(.5).activeStep).toBe(3)
expect(getStreetSystemState(1).routeProgress).toBe(1)
```

- [ ] **Step 2: Run the focused test and confirm it fails because the module is absent**

Run: `npm test -- src/prototype/street-system.test.ts`

- [ ] **Step 3: Implement clamped interpolation and six-step state mapping**

```ts
export function getStreetSystemState(rawProgress: number): StreetSystemState {
  const progress = Math.max(0, Math.min(1, rawProgress))
  return { phase, activeStep, routeProgress, camera, butterfly }
}
```

- [ ] **Step 4: Run the focused test and confirm it passes**

Run: `npm test -- src/prototype/street-system.test.ts`

### Task 2: Street component and semantic interaction

**Files:**
- Create: `src/prototype/components/StreetSystem.test.tsx`
- Create: `src/prototype/components/StreetSystem.tsx`
- Modify: `src/prototype/components/Homepage.tsx`
- Modify: `src/prototype/components/ButterflyDirector.tsx`

**Interfaces:**
- Consumes: `reducedMotion: boolean` and `getStreetSystemState`.
- Produces: the `#system` section, six keyboard-focusable waypoints and `webnest:street-progress` events.

- [ ] **Step 1: Write failing component tests**

```tsx
render(<StreetSystem reducedMotion={false} />)
expect(screen.getByRole('region', { name: /connected online business system/i })).toBeInTheDocument()
expect(screen.getAllByRole('button')).toHaveLength(6)
```

- [ ] **Step 2: Run the focused component test and confirm it fails because the component is absent**

Run: `npm test -- src/prototype/components/StreetSystem.test.tsx`

- [ ] **Step 3: Implement the component and replace the static system block**

```tsx
<StreetSystem reducedMotion={motion.tier === 'still'} />
```

- [ ] **Step 4: Extend `ButterflyDirector` to consume street progress from the same image asset**

```ts
window.addEventListener('webnest:street-progress', onStreetProgress)
```

- [ ] **Step 5: Run focused and homepage tests**

Run: `npm test -- src/prototype/components/StreetSystem.test.tsx src/prototype/components/Homepage.test.tsx`

### Task 3: WebGL city environment and responsive styling

**Files:**
- Create: `src/prototype/components/StreetCity3D.tsx`
- Create: `public/assets/3d/city/`
- Create: `public/assets/3d/LICENSES.md`
- Modify: `src/styles.css`
- Modify: `AGENTS.md`

**Interfaces:**
- Consumes: curated CC0 glTF city models and CSS variables published by `StreetSystem`.
- Produces: a real-time 3D street canyon, a 260vh sticky desktop journey, mobile adaptation and reduced-motion presentation.

- [ ] **Step 1: Download and inspect web-efficient CC0 modular city and road packs**

Use only selected models in the shipped prototype and preserve their source/license notes.

- [ ] **Step 2: Build the Three.js street scene and connect camera/environment state to scroll progress**

```tsx
<StreetCity3D progress={streetProgress} reducedMotion={reducedMotion} />
```

- [ ] **Step 3: Add measured HTML overlay styling, mobile quality limits and reduced-motion rules**

```css
@media (prefers-reduced-motion:reduce){.street-system{height:auto}.street-system__sticky{position:relative}}
```

- [ ] **Step 4: Record the approved street direction in `AGENTS.md`**

- [ ] **Step 5: Run the complete unit test suite**

Run: `npm test`

### Task 4: Browser verification and design QA

**Files:**
- Modify: `design-qa.md`

**Interfaces:**
- Consumes: Figma node `21:18` screenshot and browser screenshots at matching 1672 × 941 viewport.
- Produces: an open local prototype and `design-qa.md` with `final result: passed`.

- [ ] **Step 1: Run the local Vite server and open the prototype in the in-app browser**

Run: `npm run dev -- --host 127.0.0.1`

- [ ] **Step 2: Inspect arrival, midpoint, exit, keyboard focus and mobile states; check the console**

- [ ] **Step 3: Capture the implementation at 1672 × 941 and compare it with the Figma source in one visual input**

- [ ] **Step 4: Fix every P0/P1/P2 mismatch and repeat the comparison until passed**

- [ ] **Step 5: Run final verification**

Run: `npm test`

Run: `npm run build`

Run: `npm run test:sites`
