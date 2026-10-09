# WebNest Coffee Shop Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build Figma frame `22:21` as a performant, accessible real-time 3D coffee-shop scene connected to the existing street and global butterfly journey.

**Architecture:** A pure coffee-shop choreography module owns deterministic scroll state. `CoffeeShop3D.tsx` renders a single Three.js interior assembled from curated CC0 props, while `CoffeeShopScene.tsx` owns semantic content, interaction and progress events. `ButterflyDirector.tsx` consumes those events so the same butterfly crosses the street threshold and exits toward the next scene.

**Tech Stack:** React 19, TypeScript/TSX, Three.js, glTF/GLB, CSS custom properties, Lenis, Vitest, Testing Library, Vite.

**Spec:** `docs/superpowers/specs/2026-09-02-webnest-coffee-shop-design.md`

## Global Constraints

- Keep `.openai/hosting.json`, `worker/index.js`, `scripts/prepare-sites-build.mjs`, and `tests/sites-worker.test.mjs` intact.
- Build UI only in `src/` and place selected licensed assets in `public/assets/3d/coffee-shop/`.
- Use Figma node `22:21` for composition and hierarchy, never as a rendered page background.
- Preserve the single global butterfly and `webnest:*progress` event pattern.
- Use real licensed 3D props, record every source in `public/assets/3d/LICENSES.md`, and honor reduced motion.

---

### Task 1: Deterministic coffee-shop choreography

**Files:**
- Create: `src/prototype/coffee-shop.test.ts`
- Create: `src/prototype/coffee-shop.ts`

**Interfaces:**
- Consumes: normalized scroll progress as a number.
- Produces: `getCoffeeShopState(progress): CoffeeShopState` containing `phase`, `activePillar`, `contentOpacity`, `camera` and `butterfly`.

- [ ] **Step 1: Write failing state tests**

```ts
expect(getCoffeeShopState(0).phase).toBe('threshold')
expect(getCoffeeShopState(.5).phase).toBe('service')
expect(getCoffeeShopState(1).phase).toBe('rear-door')
expect([.18, .38, .58, .78].map(p => getCoffeeShopState(p).activePillar)).toEqual([0, 1, 2, 3])
```

- [ ] **Step 2: Run the focused test and confirm it fails because the module is absent**

Run: `npm test -- src/prototype/coffee-shop.test.ts`

- [ ] **Step 3: Implement clamped keyframe interpolation and four-pillar state mapping**

```ts
export function getCoffeeShopState(rawProgress: number): CoffeeShopState {
  const progress = Math.max(0, Math.min(1, rawProgress))
  return { phase, activePillar, contentOpacity, camera, butterfly }
}
```

- [ ] **Step 4: Run the focused test and confirm it passes**

Run: `npm test -- src/prototype/coffee-shop.test.ts`

### Task 2: Semantic frame and global butterfly handoff

**Files:**
- Create: `src/prototype/components/CoffeeShopScene.test.tsx`
- Create: `src/prototype/components/CoffeeShopScene.tsx`
- Modify: `src/prototype/components/ButterflyDirector.test.tsx`
- Modify: `src/prototype/components/ButterflyDirector.tsx`
- Modify: `src/prototype/components/Homepage.test.tsx`
- Modify: `src/prototype/components/Homepage.tsx`

**Interfaces:**
- Consumes: `reducedMotion: boolean` and `getCoffeeShopState`.
- Produces: `#coffee-shop`, four keyboard-focusable service pillars, `webnest:coffee-progress` events and a `#services` CTA.

- [ ] **Step 1: Write failing component and butterfly handoff tests**

```tsx
render(<CoffeeShopScene reducedMotion={false} />)
expect(screen.getByRole('region', { name: /everything your business needs/i })).toBeInTheDocument()
expect(screen.getAllByRole('button')).toHaveLength(4)
expect(screen.getByRole('link', { name: /explore all services/i })).toHaveAttribute('href', '#services')
```

- [ ] **Step 2: Run focused tests and confirm they fail because the component and event handler are absent**

Run: `npm test -- src/prototype/components/CoffeeShopScene.test.tsx src/prototype/components/ButterflyDirector.test.tsx src/prototype/components/Homepage.test.tsx`

- [ ] **Step 3: Implement the section, insert it after `StreetSystem`, and publish scroll state**

```tsx
<StreetSystem reducedMotion={motion.tier === 'still'} />
<CoffeeShopScene reducedMotion={motion.tier === 'still'} />
```

- [ ] **Step 4: Extend the director with the coffee-shop event**

```ts
window.addEventListener('webnest:coffee-progress', onCoffeeProgress)
```

- [ ] **Step 5: Run focused tests and confirm they pass**

Run: `npm test -- src/prototype/components/CoffeeShopScene.test.tsx src/prototype/components/ButterflyDirector.test.tsx src/prototype/components/Homepage.test.tsx`

### Task 3: Curated 3D interior and licensed assets

**Files:**
- Create: `src/prototype/components/CoffeeShop3D.tsx`
- Create: `public/assets/3d/coffee-shop/`
- Modify: `public/assets/3d/LICENSES.md`

**Interfaces:**
- Consumes: 1K glTF/GLB variants of Poly Haven `ArmChair_01`, `Chandelier_03`, `modern_coffee_table_01` and `CoffeeCart_01`.
- Produces: a canvas labelled “Royal 3D coffee shop interior” and a reusable `getCoffeeShopLightingProfile()` for testable art-direction constraints.

- [ ] **Step 1: Download only the selected CC0 1K glTF files and their included textures**

Keep each asset's original subfolder intact under `public/assets/3d/coffee-shop/` so relative glTF texture references remain valid.

- [ ] **Step 2: Write a failing lighting-profile assertion in `CoffeeShopScene.test.tsx`**

```ts
expect(profile.practicalIntensity).toBeGreaterThan(profile.accentIntensity)
expect(profile.exposure).toBeGreaterThanOrEqual(1)
```

- [ ] **Step 3: Build the Three.js room, load and reuse the models, and connect the camera to `webnest:coffee-progress`**

```tsx
<canvas ref={canvasRef} role="img" aria-label="Royal 3D coffee shop interior" />
```

- [ ] **Step 4: Record exact model pages, authors, licenses and runtime material adaptations**

- [ ] **Step 5: Run the component test and confirm it passes**

Run: `npm test -- src/prototype/components/CoffeeShopScene.test.tsx`

### Task 4: Figma-faithful styling and responsive behavior

**Files:**
- Modify: `src/styles.css`
- Modify: `AGENTS.md`

**Interfaces:**
- Consumes: CSS variables from `CoffeeShopScene` and the semantic four-pillar DOM.
- Produces: the 250vh sticky desktop scene, 190vh mobile scene, warm threshold transition, responsive pillar rail and reduced-motion layout.

- [ ] **Step 1: Add measured desktop styles matching the Figma frame hierarchy**

```css
.coffee-shop{height:250vh;background:#080503}
.coffee-shop__sticky{position:sticky;top:0;height:100svh;overflow:hidden}
```

- [ ] **Step 2: Add mobile and reduced-motion rules**

```css
@media(max-width:650px){.coffee-shop{height:190vh}}
@media(prefers-reduced-motion:reduce){.coffee-shop{height:auto}.coffee-shop__sticky{position:relative}}
```

- [ ] **Step 3: Record the durable no-photo, real-time-3D coffee-shop decision in `AGENTS.md`**

- [ ] **Step 4: Run the full unit suite**

Run: `npm test`

### Task 5: Browser verification and design QA

**Files:**
- Modify: `design-qa.md`
- Create: `qa/screenshots/coffee-shop-implementation-desktop.png`
- Create: `qa/screenshots/coffee-shop-design-qa-comparison.png`

**Interfaces:**
- Consumes: Figma node `22:21` at 1672 × 941 and the local implementation at the same viewport.
- Produces: an open local preview, clean console and a combined side-by-side visual QA artifact with `final result: passed`.

- [ ] **Step 1: Open the local prototype and scroll to `#coffee-shop` in the in-app browser**

- [ ] **Step 2: Inspect threshold, service midpoint, rear-door exit, keyboard focus, 390 × 844 mobile and reduced motion**

- [ ] **Step 3: Capture the implementation at 1672 × 941 and place it beside the Figma reference in one comparison image**

- [ ] **Step 4: Fix every visible P0/P1/P2 mismatch and repeat comparison until passed**

- [ ] **Step 5: Run final verification**

Run: `npm test`

Run: `npm run build`

Run: `npm run test:sites`

