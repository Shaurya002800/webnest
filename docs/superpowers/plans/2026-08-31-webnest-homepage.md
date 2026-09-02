# WebNest Homepage Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build the connected 13-scene WebNest homepage with a live candle flame, a stable diagonal butterfly flight band, responsive fallbacks, and working conversion interactions.

**Architecture:** A Product Design Vite/React prototype hosts semantic scene components driven by a central scene registry. Animation policy, device tier, reduced-motion behavior, and CTA destinations remain separate from visual components so later pages can reuse them.

**Tech Stack:** React, TypeScript, Vite, CSS, GSAP/ScrollTrigger/MotionPath, Lenis, Vitest, Testing Library.

**Spec:** `docs/superpowers/specs/2026-08-31-webnest-homepage-design.md`

## Global Constraints

- Essential copy must be semantic HTML, not baked into imagery.
- The candle flame must be live and not an image.
- The hero butterfly must maintain a stable altitude band diagonally above/right of the candle.
- Motion must respect `prefers-reduced-motion`.
- Mobile sections use natural height and simplified choreography.
- All audit CTAs route to `/free-audit`; all project CTAs route to `/start-project`.

---

### Task 1: Prototype foundation and scene contract

**Files:**
- Create: `src/prototype/scene-model.ts`
- Create: `src/prototype/scene-model.test.ts`
- Modify: `src/Prototype.tsx`
- Modify: `src/prototype.css`

**Interfaces:**
- Produces: `SceneId`, `SceneDefinition`, `SCENES`, `getSceneById(id)`.
- Consumes: none.

- [ ] Write a failing test that asserts the literal 13-scene order and canonical CTA destinations.
- [ ] Run `npm test -- src/prototype/scene-model.test.ts` and confirm failure because the scene module does not exist.
- [ ] Implement the typed scene registry with the approved content order.
- [ ] Run the test again and confirm it passes.
- [ ] Compose `Prototype.tsx` from the scene registry without animation.

### Task 2: Motion preference and device policy

**Files:**
- Create: `src/prototype/motion-policy.ts`
- Create: `src/prototype/motion-policy.test.ts`

**Interfaces:**
- Produces: `getMotionPolicy({ reducedMotion, width, lowPower })`.
- Consumes: viewport and preference inputs.

- [ ] Write failing table-driven tests for desktop, tablet, mobile, low-power, and reduced-motion results.
- [ ] Run `npm test -- src/prototype/motion-policy.test.ts` and confirm the missing-module failure.
- [ ] Implement literal policies for parallax, continuous flight, ambient layers, and smooth scrolling.
- [ ] Run the focused test and the full test suite.

### Task 3: Live flame and candle-light system

**Files:**
- Create: `src/prototype/components/LiveFlame.tsx`
- Create: `src/prototype/components/LiveFlame.test.tsx`
- Modify: `src/prototype.css`

**Interfaces:**
- Produces: `<LiveFlame reducedMotion?: boolean />`.
- Consumes: motion policy.

- [ ] Write a failing accessibility test asserting one decorative flame container, three flame layers, and reduced-motion state.
- [ ] Run the focused test and confirm failure because `LiveFlame` does not exist.
- [ ] Implement the semantic component and layered styling.
- [ ] Run the focused test and full suite.

### Task 4: Butterfly director and hero flight band

**Files:**
- Create: `src/prototype/components/ButterflyDirector.tsx`
- Create: `src/prototype/components/ButterflyDirector.test.tsx`
- Create: `src/prototype/butterfly-path.ts`
- Create: `src/prototype/butterfly-path.test.ts`
- Modify: `src/prototype.css`

**Interfaces:**
- Produces: `getHeroButterflyPoint(progress)` and `<ButterflyDirector />`.
- Consumes: motion policy and hero scroll progress.

- [ ] Write failing tests verifying that sampled path points remain within the approved altitude band and progress diagonally toward the window.
- [ ] Run focused tests and confirm missing-module failures.
- [ ] Implement the path function with hand-derived normalized coordinates.
- [ ] Implement the persistent butterfly component and reduced-motion fallback.
- [ ] Run focused tests and the full suite.

### Task 5: Hero and first connected transition

**Files:**
- Create: `src/prototype/components/SiteHeader.tsx`
- Create: `src/prototype/components/HeroScene.tsx`
- Create: `src/prototype/components/ProblemScene.tsx`
- Create: `src/prototype/components/HeroScene.test.tsx`
- Modify: `src/Prototype.tsx`
- Modify: `src/prototype.css`

**Interfaces:**
- Produces: hero content, CTA routing, first pinned transition.
- Consumes: `LiveFlame`, `ButterflyDirector`, scene registry, motion policy.

- [ ] Write failing interaction tests for hero CTA destinations and the Work anchor.
- [ ] Run the focused tests and confirm expected failures.
- [ ] Implement the header, hero layout, candle placement, and problem scene.
- [ ] Add the scroll transition without changing the semantic document order.
- [ ] Run focused tests and the full suite.

### Task 6: Remaining homepage scenes and interactions

**Files:**
- Create: `src/prototype/components/HomeScenes.tsx`
- Create: `src/prototype/components/FaqScene.tsx`
- Create: `src/prototype/components/FaqScene.test.tsx`
- Modify: `src/Prototype.tsx`
- Modify: `src/prototype.css`

**Interfaces:**
- Produces: all remaining scene sections and keyboard-operable FAQ.
- Consumes: scene registry and shared CTA contracts.

- [ ] Write failing FAQ interaction tests covering open, close, and keyboard activation.
- [ ] Run the focused test and confirm failure.
- [ ] Implement the remaining scenes in registry order.
- [ ] Implement pricing URL context and final CTA destinations.
- [ ] Run focused tests and the full suite.

### Task 7: Responsive, performance, and visual QA

**Files:**
- Create: `design-qa.md`
- Modify: `src/prototype.css`
- Modify: affected scene components from Tasks 3-6.

**Interfaces:**
- Consumes: completed homepage and Figma reference screenshots.
- Produces: verified desktop, tablet, mobile, keyboard, and reduced-motion homepage.

- [ ] Run `npm test` and fix any failures.
- [ ] Run `npm run build` and fix compilation or bundling errors.
- [ ] Run `npm run check:runtime` and `npm run test:sites`.
- [ ] Open the local prototype and exercise navigation, CTAs, FAQ, and responsive states.
- [ ] Compare the desktop hero and representative scenes against the Figma references in `design-qa.md`.
- [ ] Fix all P0/P1/P2 issues and repeat visual comparison until `final result: passed`.

