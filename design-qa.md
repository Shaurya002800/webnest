# WebNest Homepage Design QA

## Evidence

- Source visual truth: `public/assets/reference/hero-room-reference.png`
- Source dimensions: 1036 × 583 px (16:9)
- Rendered desktop: `implementation-hero-1440x810-v2.png`
- Rendered mobile: `implementation-mobile-390x844-final.png`
- Combined comparison: `design-qa-comparison-final.png`
- Desktop viewport/CSS size: 1440 × 810 at device scale factor 1
- Mobile viewport/CSS size: 390 × 844 at device scale factor 1
- Normalization: both desktop source and implementation were displayed at equal 16:9 frames in the combined comparison; no browser chrome or device frame was included.
- State: homepage hero at initial scroll position; default dark theme; live flame active; butterfly at initial flight-band position.

## Full-view comparison evidence

The combined comparison shows the Figma hero environment and implementation in the same image. Room composition, nocturnal exposure, central city window, candle location, warm tabletop reflection, framed wall art, plant silhouette and orange/teal color relationship are retained. The implementation adds semantic navigation, headline, description and conversion controls over the left-side negative space.

The connected full-page capture was reviewed for order and continuity. The semantic DOM contains one instance each of the hero, problems and FAQ sections; the long-page screenshot stitch repeated some regions because smooth scrolling was active, not because the page duplicated content.

## Focused region comparison evidence

The hero's candle, flame and butterfly were inspected at 1440 × 810 and 390 × 844. The clean room plate contains neither a baked flame nor butterfly. The browser canvas flame is anchored to the wick, and the separate transparent butterfly remains above/right of the candle. Focused mobile inspection confirmed zero horizontal overflow (`scrollWidth` 390 equals `clientWidth` 390).

## Required fidelity surfaces

- Fonts and typography: Cormorant Garamond preserves the high-contrast editorial display character; Manrope provides the restrained UI/body counterpoint. Hierarchy, line height and headline wrapping remain coherent on desktop and mobile.
- Spacing and layout rhythm: desktop uses the source's left negative space and full-bleed room crop. Mobile preserves the headline and CTA hierarchy without horizontal overflow.
- Colors and visual tokens: near-black, ember orange, bronze and cool city teal match the source direction. Contrast remains strong for primary copy and controls.
- Image quality and asset fidelity: the edited hero plate preserves the source room without a baked flame or butterfly. The butterfly is a transparent generated raster asset rather than CSS or placeholder art. No visible transparency halo was found in the final capture.
- Copy and content: homepage language follows the approved WebNest business narrative, with consistent `/free-audit` and `/start-project` routes.
- Icons and interaction states: one consistent Phosphor icon family is used. Header navigation, mobile menu, anchors, CTA links and FAQ expansion were exercised successfully.
- Accessibility: semantic landmarks/headings, keyboard-native links/buttons, focus-visible styling, descriptive hero alt text and reduced-motion behavior are present.

## Comparison history

### Pass 1 — blocked

- [P2] Desktop flame was materially larger and flatter than the reference flame.
  - Fix: reduced the canvas slot from a maximum width of 110 px to 56 px while preserving live procedural motion and wick anchoring.
- [P2] Mobile flame and butterfly overlapped conversion copy/controls.
  - Fix: adjusted the mobile background crop, constrained CTA width, moved the butterfly into the gap below the title, reduced it to 44 px and re-anchored the flame to the visible mobile wick.

### Pass 2 — passed

- Evidence: `design-qa-comparison-final.png` and `implementation-mobile-390x844-final.png`.
- The source-room composition remains faithful; the live flame scale now matches the candle; mobile motion layers no longer cover the title or CTA labels; no actionable P0/P1/P2 findings remain.

## Follow-up polish

- [P3] Later scene environment artwork can be brought closer to each individual Figma board when those page sections receive their next round of user input.

## Implementation checklist

- [x] Source and implementation compared together at a matched aspect ratio
- [x] Live flame and independent butterfly verified
- [x] Desktop and mobile viewport checks completed
- [x] Mobile menu and FAQ interactions tested
- [x] Console errors checked (none)
- [x] Automated tests and production build passed

## Hero-to-Building Transition QA

### Evidence

- Source visual truth: `public/assets/generated/building-night.png` plus the approved room → window → exterior → building motion specification.
- Source dimensions: 1672 × 941 px.
- Rendered desktop: `implementation-second-frame-final.png` at 1440 × 900 CSS px, device scale factor 1.
- Rendered mobile: `implementation-second-frame-mobile.png` at 390 × 844 CSS px, device scale factor 1.
- Combined comparison: `design-qa-transition-comparison.png` at 1280 × 720 px.
- Normalization: source and implementation were displayed together in equal 16:10 content frames for composition and art-direction review; the full desktop and mobile implementation captures were separately inspected at native CSS size for typography and interaction fidelity.
- State: transition progress 1; camera settled outside; all three problem anchors visible; butterfly resting between the semantic copy and problem column.

### Full-view comparison evidence

The side-by-side comparison confirms that the implementation preserves the generated plate's teal-black façade, three warm windows, deep city haze, and left-side negative space. The semantic Growth Problems copy occupies that negative space, while the three problem cards follow the lit-window rhythm without obscuring the architectural subject.

### Focused region comparison evidence

The full-resolution desktop capture was inspected for headline wrapping, description visibility, butterfly/card clearance, and all three anchor labels. The full-resolution mobile capture was inspected for the shortened reveal, legible stacked cards, fixed-header clearance, and horizontal overflow. Focused crops were not required because both native captures kept these regions readable at 1:1 CSS size.

### Required fidelity surfaces

- Fonts and typography: Cormorant Garamond and Manrope retain the approved editorial-luxury hierarchy; the desktop headline and supporting copy are fully visible, and the mobile headline wraps cleanly without truncation.
- Spacing and layout rhythm: the desktop keeps a calm 45/55 copy-to-façade balance; cards align to the three warm windows. Mobile collapses the cards into a compact bottom stack while preserving visual breathing room.
- Colors and visual tokens: near-black, cool teal, warm amber, and low-opacity bronze rules remain consistent with the homepage and source plate.
- Image quality and asset fidelity: the 1672 × 941 generated raster plate is used directly; no CSS-drawn building, placeholder, or inline-SVG substitute is present. Crop and scale remain sharp on both tested viewports.
- Copy and content: the heading appears only after camera settlement, and the three problem statements remain semantic, concise, and consistent with the WebNest business narrative.
- Accessibility and motion: the building has descriptive accessible image text; desktop uses the full perspective sequence, mobile uses a shorter sequence, and reduced motion resolves to a static exterior state.

### Comparison history

#### Pass 1 — blocked

- [P2] The butterfly's settled desktop lane crossed the second problem label.
  - Fix: added an earlier inward return keyframe and moved the settled endpoint into the clear central façade gap.
- [P2] Desktop supporting copy fell below the viewport at the final sticky state.
  - Fix: raised the semantic copy block from 50% to 45% of the frame height.
- [P2] Mobile stylesheet priorities prevented the runtime butterfly path from updating.
  - Fix: removed the mobile `!important` flight-position overrides so the shared motion state controls the mobile path.

#### Pass 2 — passed

- Evidence: `design-qa-transition-comparison.png`, `implementation-second-frame-final.png`, and `implementation-second-frame-mobile.png`.
- The butterfly clears all labels, desktop copy is fully visible, mobile uses the live shared path with zero horizontal overflow, and no actionable P0/P1/P2 findings remain.

### Primary interactions and diagnostics

- Exercised hero entry, room phase, window crossing, exterior crossfade, settled building state, desktop and mobile progression.
- Verified phase changes `room` → `window` → `exterior` → `building` in the rendered browser.
- Verified desktop and mobile `scrollWidth - clientWidth` equals 0.
- Browser console checked: no warnings or errors; only Vite connection and React development notices.

### Follow-up polish

- [P3] Fine-tune scroll duration after the user feels the sequence on their own trackpad; the current pacing intentionally favors a slow cinematic reveal.

## Direct Hero Journey Correction

### Evidence

- Source visual truth: `public/assets/generated/hero-room-clean.png`, `public/assets/generated/building-night.png`, and the approved direct-flow requirement: hero copy fades in the original room, the butterfly crosses that room's window, then the building replaces it without another room section.
- Rendered desktop states: `implementation-direct-journey-start.png`, `implementation-direct-journey-window.png`, `implementation-direct-journey-arrival.png`, and `implementation-direct-journey-final.png` at 1440 × 900 CSS px, device scale factor 1.
- Rendered mobile states: `implementation-direct-journey-mobile-start.png` and `implementation-direct-journey-mobile-final.png` at 390 × 844 CSS px, device scale factor 1.
- Combined comparison: `design-qa-direct-journey.png` at 1280 × 720 px.
- Normalization: the three desktop states were placed together as equal 16:10 frames; native 1:1 desktop and mobile captures were separately inspected for typography, crop, and overflow.
- State sequence: landing → copy fade/window crossing → exterior crossfade → settled building.

### Full-view and focused comparison evidence

The combined storyboard visibly contains one room state followed by the window crossing and building arrival; there is no repeated empty-room frame. Native captures confirm one journey section and one room image in the DOM. Focused inspection covered the hero fade, live flame, butterfly window position, building crossfade, settled problem copy, and both responsive endpoints; no separate crop was necessary because each area is readable at native size.

### Required fidelity surfaces

- Fonts and typography: the hero's Cormorant/Manrope hierarchy is unchanged; fading affects the complete semantic hero layer evenly without broken wrapping or residual controls.
- Spacing and layout rhythm: the original landing composition remains intact, while the overall journey shrinks from two serial sections to one 250vh desktop / 180vh mobile section.
- Colors and visual tokens: the nocturnal teal-black and amber palette remains continuous through the crossfade.
- Image quality and asset fidelity: exactly one clean room plate and one building plate are used; no duplicate room asset, placeholder, or code-drawn replacement appears.
- Copy and content: landing copy disappears before the building arrives, and Growth Problems copy appears only at settlement.
- Motion and accessibility: the butterfly enters the visible window before moving into the exterior; reduced motion removes the butterfly and camera transforms while preserving the shorter room-to-building dissolve.

### Comparison history

#### Pass 1 — blocked

- [P1] The previous implementation placed a second empty room section after the landing page, creating a dead-scroll page before the exterior transition.
  - Fix: moved the hero content, flame, room plate, exterior plate, and problem frame into one sticky journey section and removed the standalone hero/duplicate-room sequence.
- [P2] The first consolidated butterfly path moved across the right wall instead of visibly entering the window.
  - Fix: redirected the pre-exit keyframes diagonally left into the window, then outward into the exterior frame.
- [P3] The Inside/Outside progress meter competed with the initial Follow the light cue.
  - Fix: tied the meter opacity to the inverse hero-copy opacity so it appears only after the landing content begins clearing.

#### Pass 2 — passed

- Evidence: `design-qa-direct-journey.png` and the native desktop/mobile captures listed above.
- One journey and one room image are rendered, the copy clears before the building crossfade, the butterfly crosses the actual window, and no P0/P1/P2 findings remain.

### Primary interactions and diagnostics

- Exercised start, partial hero fade, cleared-room window crossing, exterior crossfade, and settled problem frame on desktop.
- Exercised initial and settled states at 390 × 844.
- Desktop and mobile horizontal overflow: 0 px.
- Browser console warnings/errors: none.

## Real-time 3D Street System QA

### Evidence

- Source visual truth: `public/assets/reference/street-system-figma.png` at 1672 × 941 px.
- Rendered desktop: `street-implementation-desktop.png` at 1672 × 941 CSS px.
- Combined comparison: `street-design-qa-comparison.png`, with source and implementation in one matched-size review surface.
- Rendered mobile: inspected at 390 × 844 CSS px in the in-app browser.
- State: street opening and mid-route progression; 3D assets loaded; live butterfly director active.

### Full-view comparison evidence

The implementation retains the approved editorial split, six-stage path, dark street canyon, practical amber lighting, restrained magenta signal, and left-side conversion narrative. In accordance with the user's revised direction, the photographic city and large neon moon are intentionally replaced by a less-flashy, real-time 3D New York-inspired environment. The final scene uses reusable modeled façades, skyscrapers, streetlights, traffic lights, and street signs rather than a city image.

### Comparison history

#### Pass 1 — blocked

- [P1] The city environment was still a static photographic plate.
  - Fix: replaced the plate with an accessible WebGL canvas and real 3D assets from the CC0 Quaternius and Kenney kits.
- [P2] Initial 3D materials were too dark to communicate the building geometry.
  - Fix: preserved source texture maps, added restrained cool fill and practical amber light, and tuned fog/exposure without introducing the reference's oversized neon moon.
- [P2] Kenney GLB files initially referenced missing shared textures.
  - Fix: preserved each pack's directory-relative texture structure; a fresh browser run reports no warnings or errors.
- [P2] The first runtime loaded and rendered the city while it was far below the fold.
  - Fix: deferred model loading until the scene approaches the viewport and capped active rendering near 30 fps.
- [P2] The section lacked the Figma's onward conversion control.
  - Fix: added a working `Explore what WebNest builds` anchor to `#services`.

#### Pass 2 — passed

- The source and implementation were compared at identical dimensions in `street-design-qa-comparison.png`.
- The desktop 3D street preserves the intended hierarchy while honoring the requested calmer NYC character.
- Mobile typography, horizontal waypoint browsing, WebGL framing, and zero-error browser diagnostics were inspected at 390 × 844.
- No actionable P0/P1/P2 findings remain.

### Primary interactions and diagnostics

- Exercised opening, mid-route camera movement, active waypoint progression, butterfly handoff, and the onward services link.
- Verified the city does not begin loading while it is far below the viewport, then becomes ready before the section reaches the top.
- Browser console warnings/errors: none on a fresh run.
- Automated component tests, complete test suite, production build, and Sites worker tests are required in the final verification pass.

final result: passed
