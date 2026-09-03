# WebNest Cherry Garden Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add a continuous, dark, real-time 3D cherry-blossom scene between the coffee shop and the existing industries content.

**Architecture:** A pure choreography module converts scroll progress into camera, content, petal, active-journey, and butterfly state. A React scene component owns scroll/pointer interaction and semantic HTML, while a focused Three.js renderer loads the licensed tree and draws the house, wet street, lantern links, and falling petals. The global ButterflyDirector consumes the scene event so the existing butterfly remains one continuous asset.

**Tech Stack:** React 19, TypeScript, CSS, Three.js, Vitest, Testing Library

**Spec:** `docs/superpowers/specs/2026-09-02-webnest-cherry-garden-design.md`

## Global Constraints

- Never use the Figma frame, a tree photo, or a city photo as the rendered scene background.
- Preserve the source's dark nocturnal palette, muted rose blossoms, warm windows, and restrained editorial-luxury hierarchy.
- Continue directly from the coffee-shop rear door and use the same global butterfly.
- Use semantic HTML for all essential copy and controls.
- Keep `.openai/hosting.json`, `worker/index.js`, `scripts/prepare-sites-build.mjs`, and `tests/sites-worker.test.mjs` intact.

---

### Task 1: Choreography Contract

**Files:**
- Create: `src/prototype/cherry-garden.test.ts`
- Create: `src/prototype/cherry-garden.ts`

**Interfaces:**
- Produces: `getCherryGardenState(progress: number): CherryGardenState`
- Produces: `CherryGardenState` with `phase`, `activeJourney`, `contentOpacity`, `petalIntensity`, `camera`, and `butterfly`.

- [ ] Write failing tests proving clamping, phase changes, active-journey sequencing, petal intensity, camera travel, and coffee-door-to-branch butterfly continuity.
- [ ] Run `npm test -- src/prototype/cherry-garden.test.ts` and verify failure because the module does not exist.
- [ ] Implement deterministic interpolation and the minimum state contract.
- [ ] Run the focused test and verify it passes.

### Task 2: Semantic Scene Shell

**Files:**
- Create: `src/prototype/components/CherryGardenScene.test.tsx`
- Create: `src/prototype/components/CherryGardenScene.tsx`
- Modify: `src/styles.css`

**Interfaces:**
- Consumes: `getCherryGardenState`.
- Emits: `webnest:cherry-progress` with `CherryGardenState` detail.
- Produces: `CherryGardenScene({ reducedMotion })`.

- [ ] Write a failing component test for the section, accessible 3D scene role, exact headline, six journey controls, CTA target, and absence of a cherry-scene `<img>` plate.
- [ ] Run the focused test and verify failure because the component does not exist.
- [ ] Implement the scroll shell, semantic content, pointer parallax, and journey controls.
- [ ] Add responsive, reduced-motion, focus, and state CSS based on the Figma composition.
- [ ] Run the component test and verify it passes.

### Task 3: Real-Time 3D Garden

**Files:**
- Create: `src/prototype/components/CherryGarden3D.tsx`
- Create: `public/assets/3d/cherry-garden/README.md`
- Add binary asset: `public/assets/3d/cherry-garden/ajimano-sakura.glb`

**Interfaces:**
- Consumes: `progress`, `activeJourney`, and `reducedMotion` props.
- Produces: a canvas container with role `img` and label `Real-time 3D cherry blossom garden at night`.

- [ ] Download the 2.1MB licensed photogrammetry GLB and record the author, source, and license.
- [ ] Load and frame the tree, then build a restrained house/street environment around it with Three.js primitives and PBR materials.
- [ ] Add deterministic instanced petals and six branch lanterns whose active state mirrors the selected journey.
- [ ] Pause rendering when offscreen, cap pixel ratio, resize safely, and dispose resources on unmount.
- [ ] Run the scene component test and verify its public behavior passes.

### Task 4: Continuous Butterfly and Homepage Integration

**Files:**
- Modify: `src/prototype/components/ButterflyDirector.test.tsx`
- Modify: `src/prototype/components/ButterflyDirector.tsx`
- Modify: `src/prototype/components/Homepage.test.tsx`
- Modify: `src/prototype/components/Homepage.tsx`
- Modify: `AGENTS.md`

**Interfaces:**
- Consumes: `webnest:cherry-progress`.
- Inserts: `CherryGardenScene` immediately after `CoffeeShopScene`.

- [ ] Add failing tests for the butterfly event handoff and homepage scene order.
- [ ] Run the focused tests and verify the expected failures.
- [ ] Connect the event to ButterflyDirector and insert the scene in Homepage.
- [ ] Record the durable no-image, real-time-petals, rear-door continuity decisions in `AGENTS.md`.
- [ ] Run focused tests and verify they pass.

### Task 5: Visual QA and Sites Verification

**Files:**
- Download reference: `public/assets/reference/cherry-garden-figma.png`
- Update: `design-qa.md`

**Interfaces:**
- Verifies desktop 1672 × 941, mobile 390 × 844, and reduced-motion behavior.

- [ ] Download the exact Figma node export for comparison only; never render it in production UI.
- [ ] Run `npm test`, `npm run build`, `npm run test:sites`, and `git diff --check`.
- [ ] Start or reuse the local Vite server and open it in the in-app browser.
- [ ] Capture the desktop scene at the intended scroll state and compare it side-by-side with the Figma source at matching dimensions.
- [ ] Fix visible hierarchy, cropping, contrast, spacing, interaction, performance, console, and mobile issues.
- [ ] Record the final desktop/mobile/reduced-motion QA result in `design-qa.md`.

