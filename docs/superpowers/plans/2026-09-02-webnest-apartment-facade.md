# WebNest Apartment Façade Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a live, interactive 3D apartment façade that replaces the generic Why WebNest block and continues directly from the cherry scene.

**Architecture:** A pure scroll-state module drives phases, active principles, camera focus, room lighting, and the butterfly. `ApartmentFacadeScene` owns semantic overlay content and interaction while `ApartmentFacade3D` owns Three.js geometry and licensed room props.

**Tech Stack:** React, TypeScript, Three.js, Vitest, Testing Library, existing Phosphor icons and Lenis journey.

**Spec:** `docs/superpowers/specs/2026-09-02-webnest-apartment-facade-design.md`

## Global Constraints

- Never render the supplied screenshot.
- Use live Three.js geometry and the local CC0 Kenney furniture subset.
- Preserve the connected butterfly journey and reduced-motion behavior.
- Keep canonical conversion routes unchanged.

---

### Task 1: Apartment scroll state

**Files:**
- Create: `src/prototype/apartment-facade.ts`
- Test: `src/prototype/apartment-facade.test.ts`

**Interfaces:**
- Produces: `getApartmentFacadeState(progress): ApartmentFacadeState` with phase, active principle, content opacity, four room intensities, camera values, and butterfly values.

- [ ] Write tests for clamping, phase boundaries, sequential room activation, and butterfly exit.
- [ ] Run the focused test and confirm it fails because the module is missing.
- [ ] Implement deterministic interpolation and clamping.
- [ ] Run the focused test and confirm it passes.

### Task 2: Semantic scene and homepage integration

**Files:**
- Create: `src/prototype/components/ApartmentFacadeScene.tsx`
- Test: `src/prototype/components/ApartmentFacadeScene.test.tsx`
- Modify: `src/prototype/components/Homepage.tsx`
- Modify: `src/prototype/components/Homepage.test.tsx`

**Interfaces:**
- Consumes: `getApartmentFacadeState`.
- Produces: `webnest:apartment-progress` custom events and the `#why-webnest` section.

- [ ] Write component and homepage tests for the four buttons, CTA target, no runtime reference image, and placement after the cherry scene.
- [ ] Run the focused tests and confirm they fail before the component exists.
- [ ] Implement the scene overlay, selection behavior, and homepage insertion; remove the old duplicate Why WebNest block.
- [ ] Run the focused tests and confirm they pass.

### Task 3: Live 3D façade and props

**Files:**
- Create: `src/prototype/components/ApartmentFacade3D.tsx`
- Modify: `src/prototype/components/ApartmentFacadeScene.tsx`
- Modify: `src/styles.css`

**Interfaces:**
- Consumes: `activePrinciple`, `reducedMotion`, and `webnest:apartment-progress`.
- Produces: live façade canvas with `data-ready` state.

- [ ] Add a failing scene assertion for the accessible live-3D façade and loading state.
- [ ] Build the concrete shell, recessed windows, blinds, balconies, practical lights, furniture loader, and responsive camera.
- [ ] Add the reference-matched overlay layout and mobile snap rail.
- [ ] Run focused tests and confirm they pass.

### Task 4: Butterfly continuity and verification

**Files:**
- Modify: `src/prototype/components/ButterflyDirector.tsx`
- Modify: `src/prototype/components/ButterflyDirector.test.tsx`
- Modify: `design-qa.md`

**Interfaces:**
- Consumes: `webnest:apartment-progress`.
- Produces: `data-realm="apartment-facade"` and continuous flight coordinates.

- [ ] Write the failing butterfly event test.
- [ ] Implement the apartment event listener and cleanup.
- [ ] Run all unit tests, production build, Sites tests, and `git diff --check`.
- [ ] Capture 1472 × 844 desktop and 390 × 844 mobile screenshots, test a value-room selection and CTA navigation, compare against the reference in one combined image, and record `final result: passed` only after all P0/P1/P2 differences are fixed.

