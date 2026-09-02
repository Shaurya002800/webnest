# WebNest Homepage Design Specification

## Objective

Build WebNest's homepage as a connected cinematic scroll journey that communicates the business story, establishes an editorial-luxury visual language, and converts visitors through two canonical actions: **Get Free Audit** and **Start a Project**.

## Approved visual source

- Figma file: `BkNTP8G1MPCRNEfv1jIQSd`
- Homepage sequence: Hero Room, Growth Problems, Connected System, Services, Business Solutions, Differentiation, Selected Work, Process, Pricing, Free Audit, FAQ, Final CTA, Footer.
- The Figma boards are visual references, not implementation-ready UI layers. Essential copy remains semantic HTML.

## Experience principles

1. The homepage is one journey, not thirteen unrelated posters.
2. The butterfly is the persistent visual guide and stays mounted for the experience.
3. The candle flame is rendered live above the candle using layered light and motion; it is not baked into the scene image.
4. In the hero, the butterfly flies diagonally above and beside the candle while remaining inside a stable altitude band.
5. Motion must guide attention without trapping or fighting native scrolling.
6. Desktop receives the full layered experience; mobile and reduced-motion modes preserve the story with lighter choreography.
7. Royal character comes from typography, lighting, spacing, restraint, and material detail rather than ornamental excess.

## Visual system

- Base: near-black nocturnal environments.
- Scene accents: ember red, bronze, amber, violet, cyan, moonlight, and restrained cream.
- Display type: high-contrast editorial serif.
- UI/body type: clean modern sans-serif.
- UI treatment: thin borders, controlled glow, deep translucent surfaces, deliberate negative space.
- All interactive elements receive hover, focus-visible, active, and reduced-motion states.

## Homepage structure

The page uses a shared `ExperienceDirector` and scene registry. Each scene owns content and local layers, while the director owns active-scene progress, butterfly position, lighting theme, reduced-motion behavior, and asset-loading priority.

The first implementation milestone is a vertical slice covering:

- Global navigation
- Hero room
- Live flame and candle glow
- Butterfly flight band
- Hero CTAs
- Transition into the Growth Problems scene

After this slice is stable, the remaining scenes reuse the same section, animation, and progressive-loading contracts.

## Flame behavior

- Three visible layers: core, body, and soft glow.
- Irregular but restrained flicker using multiple non-synchronized keyframes.
- Candle glow affects the nearby tabletop and butterfly without animating layout properties.
- Reduced-motion mode keeps a static flame with a low-amplitude glow.
- The flame is decorative and hidden from assistive technology.

## Butterfly behavior

- The butterfly remains diagonally above/right of the candle in the hero.
- Its flight path stays inside a narrow altitude band and uses subtle diagonal drift, wing motion, and banking.
- It never crosses the headline or primary CTAs.
- Scroll progress moves it toward the window before the first scene transition.
- Reduced-motion mode uses a static butterfly position with no route animation.

## Functional requirements

- Navigation anchors work for homepage sections; unbuilt inner-page routes use explicit non-destructive placeholders until those pages are implemented.
- `Get Free Audit` consistently points to `/free-audit`.
- `Start a Project` consistently points to `/start-project`.
- `View Our Work` scrolls to Selected Work.
- Pricing CTAs preserve package context in the URL.
- FAQ is keyboard-operable.
- Semantic headings, landmarks, links, and buttons are required.

## Responsive behavior

- Desktop: layered scenes, parallax, hero flight path, masks, and progressive scene transitions.
- Tablet: reduced parallax and fewer simultaneous atmospheric layers.
- Mobile: natural section heights, simplified backgrounds, no forced full-viewport content, no heavy WebGL, and an always-readable CTA hierarchy.
- Reduced motion: no scrubbed travel, no parallax, no continuous flight; content remains complete and ordered.

## Performance rules

- Only the current and next scene load high-priority imagery.
- Use responsive WebP/AVIF assets where practical.
- Animate transforms and opacity; avoid continuous layout animation.
- Keep at most one optional WebGL canvas, loaded only when a later scene proves it necessary.
- The hero becomes readable and actionable before below-fold cinematic assets finish loading.

## Acceptance criteria

- Hero visually matches the approved Figma direction at desktop scale.
- The flame visibly reads as live light rather than a looping image.
- The butterfly remains diagonally associated with the candle at a stable height and moves cleanly toward the next scene.
- Primary CTAs, navigation, Work jump, FAQ, and pricing context behave correctly.
- Desktop, tablet, mobile, keyboard, and reduced-motion experiences remain coherent.
- Automated tests, production build, browser checks, and visual design QA pass.

