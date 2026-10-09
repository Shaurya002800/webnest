**Design QA — Cherry-blossom business journeys**

**Comparison target**

- Source visual truth: `/Users/shaurya/Desktop/webnest/public/assets/reference/cherry-garden-figma.png` (captured from the approved Figma frame supplied by the user).
- Original user screenshot: `/var/folders/_7/4x2mbnx915b3zyjhbllgcslm0000gn/T/TemporaryItems/NSIRD_screencaptureui_bVJDZ8/Screenshot 2026-09-02 at 1.06.56 PM.png`.
- Browser-rendered implementation: `qa/screenshots/cherry-garden-browser-final-1672.png`.
- Mobile evidence: `qa/screenshots/cherry-garden-browser-mobile.png`.
- Full-view comparison: `qa/screenshots/cherry-garden-design-qa-comparison.png`.
- Focused tree/card comparison: `qa/screenshots/cherry-garden-design-qa-detail.png`.
- Local implementation URL: `http://127.0.0.1:5177/#business-solutions`.

**Normalization and state**

- Desktop source pixels: 1672 × 941.
- Desktop implementation pixels: 1672 × 941.
- Desktop CSS viewport: 1672 × 941 at 1× screenshot density; no resampling was required for the comparison.
- State: nocturnal theme, cherry scene at approximately 43% sticky-scroll progress, all six journeys visible, live tree and petal systems loaded.
- Mobile CSS viewport and screenshot: 390 × 844; the source has no dedicated mobile frame, so mobile was reviewed for hierarchy and resilience rather than pixel parity.

**Findings**

- No actionable P0/P1/P2 issues remain.
- Fonts and typography: the source's high-contrast editorial display hierarchy is preserved with Cormorant Garamond, compact uppercase plaque labels, restrained body copy, and matching three-line headline wrapping.
- Spacing and layout rhythm: the intro, six staggered plaques, and lower conversion bar follow the source composition. Plaque dimensions and type density were increased in the final pass to restore the source's readable, substantial surfaces.
- Colors and visual tokens: black, wet charcoal, muted rose, ember red, timber brown, and warm window amber match the intended nocturnal palette. Contrast remains sufficient for the key headline, plaque titles, and CTA.
- Image and asset fidelity: no screenshot or photographic city/tree plate is rendered. The tree is deterministic live Three.js geometry from the MIT-licensed EZ Tree system; the long lateral crown reuses the same generated geometry. Alley lamps are licensed GLB props, icons come from the existing Phosphor icon family, and petals are live instanced WebGL geometry.
- Copy and content: all reference business categories, service bullets, heading, supporting copy, and closing message are present without truncation.
- Interaction and accessibility: all six plaques are semantic buttons with visible hover/focus/selected states and `aria-pressed`; the tested Salons selection became pressed. Scroll progress also updates the active journey. The lower CTA was clicked and reached `#industries`. The 390px layout has no document-level horizontal overflow; its journey rail intentionally scrolls horizontally. Reduced-motion CSS removes the sticky travel and uses a static grid while the component caps petal motion.
- Console: no browser warnings or errors at desktop or mobile.

**Comparison history**

1. Initial comparison — blocked.
   - [P1] The photogrammetry tree read as a flat slab rather than the source's deep natural canopy.
   - [P2] The background architecture was a dim, generic box façade and did not carry the source's machiya/storefront depth.
   - [P2] Journey plaques were too small and sparse compared with the source.
   - Fixes: replaced the active scan with deterministic procedural branch/blossom geometry; added a layered machiya façade, windows, timber lattice, roofs, lantern lighting, wet street material, and real 3D lamp props; rebuilt the three-line heading and plaque composition.

2. Revised comparison — blocked.
   - [P2] The natural tree was materially better but its blossom ceiling and lateral bough remained too sparse.
   - Fixes: increased blossom density, strengthened the leftward branch force, and added an off-screen-rooted lateral crown that shares the generated geometry. Increased pink canopy lighting and shifted the façade right to recover the source's alley/storefront balance.

3. Final comparison — passed.
   - Post-fix evidence: `qa/screenshots/cherry-garden-design-qa-comparison.png` and `qa/screenshots/cherry-garden-design-qa-detail.png` show the restored dense canopy, heavy right-side trunk and lateral branch, matching six-plaque hierarchy, and compact lower CTA bar.
   - The persistent WebNest navigation and the exact storefront/street geometry remain intentional product-level differences: the header preserves continuity with the already-approved connected journey, while the background is a performant original real-time 3D interpretation rather than a copied raster plate.

**Primary checks**

- `npm test`: 14 files, 47 tests passed.
- `npm run build`: passed; Sites artifacts emitted.
- `npm run test:sites`: 4 tests passed.
- `git diff --check`: passed.

**Follow-up polish**

- [P3] A future optimization pass could bake the procedural tree geometry to a compact mesh while preserving live lighting and petals, reducing the lazy tree chunk without changing the visual result.

final result: passed

---

**Final QA — Apartment window illumination interaction**

- Source plate: `/var/folders/_7/4x2mbnx915b3zyjhbllgcslm0000gn/T/codex-clipboard-17be77e0-0dcc-4301-9499-4a4d69ddaaaa.png` (1672 × 941).
- Hover implementation: `qa/apartment-window-hover-final.png` at 1280 × 720.
- Same-state comparison: `qa/apartment-window-hover-comparison.jpg`.
- Mobile evidence: `qa/apartment-window-mobile.png` at 390 × 844; no document-level horizontal overflow.
- No actionable P0/P1/P2 issue remains. The clean façade is preserved as a 188 KB WebP beneath live semantic headline, principle, statement, and CTA content.
- Hovering or focusing a principle activates only its mapped window: the room scales to 110%, receives a layered amber glow, and the non-target rooms recede to 58% opacity. The handoff uses a 720–900 ms eased transition.
- Mobile retains the horizontal principle rail without the scale-heavy desktop hover treatment. Reduced motion removes the transform while preserving the selected state.
- Browser console: zero warnings/errors during hover handoff and mobile traversal.
- `npm test`: 18 files, 62 tests passed.
- `npm run build`: passed; Sites artifacts emitted.
- `npm run test:sites`: 4 tests passed.
- `git diff --check`: passed.

final result: passed

---

**Final QA — Lightweight cherry and apartment media pass**

- Source truth: the approved Figma cherry-garden plate and the user's supplied apartment screenshot.
- Desktop evidence (1556 × 899): `qa/cherry-garden-implementation.png`, `qa/apartment-facade-implementation.png`, and the equal-state comparison `qa/apartment-facade-comparison.jpg`.
- Mobile evidence: both late scenes reviewed at 390 × 844 with no document-level horizontal overflow.
- No actionable P0/P1/P2 issue remains. The apartment composition, lighting, typography, and hierarchy match the supplied frame; the persistent site header and semantic hotspot focus treatment are intentional product interactions.
- The cherry scene now uses the approved Figma plate plus a locally optimized 2.3 MB H.264 petal loop. It receives its source only near the viewport, pauses offscreen, and is disabled for reduced motion.
- The apartment scene now uses a 184 KB high-quality WebP of the supplied frame with accessible HTML hotspots. Mobile uses a darkened plate beneath readable semantic content.
- Neither late scene creates a WebGL context. The only canvas retained at these checkpoints is the hero's live flame, whose draw loop is paused while offscreen.
- Scene preload distance is reduced from 70% to 20%, preventing adjacent 3D worlds from overlapping during normal traversal.
- The production build contains no CherryGarden3D or ApartmentFacade3D chunks. Earlier street and coffee 3D remain lazy-loaded.
- Browser console: no warnings or errors after desktop and mobile traversal.
- `npm test`: 18 files, 61 tests passed.
- `npm run build`: passed; Sites artifacts emitted.
- `npm run test:sites`: 4 tests passed.
- `git diff --check`: passed.

final result: passed

---

**Final QA — Dark-royal cherry correction**

- User source plate: `/var/folders/_7/4x2mbnx915b3zyjhbllgcslm0000gn/T/codex-clipboard-0b73c42b-c54e-4504-8698-442bb0467e89.png` (1672 × 940).
- Desktop implementation: `qa/cherry-garden-dark-royal.png` at 1672 × 940.
- Same-state comparison: `qa/cherry-garden-dark-royal-comparison.jpg`.
- Mobile evidence: `qa/cherry-garden-dark-royal-mobile.png` at 390 × 844; document width remains 390 px.
- No actionable P0/P1/P2 issue remains. The grey-teal veil is removed; the clean amber night street is preserved beneath near-black plaque surfaces, ivory editorial type, aged-brass hairlines, and restrained ember accents.
- The previous baked-content plate is no longer used. Headline, six business journeys, states, and CTA are live semantic HTML.
- Petals use a motion-interpolated 16-second H.264 loop at 24 fps. The layer is sparse, masked away from the primary copy, and limited to 9.5% screen-blend opacity; it loads only near the viewport and pauses offscreen.
- Browser inspection confirmed the film is playing, its duration is exactly 16 seconds, and the console has zero warnings/errors.
- `npm test`: 18 files, 61 tests passed.
- `npm run build`: passed; no CherryGarden3D or ApartmentFacade3D production chunks.
- `npm run test:sites`: 4 tests passed; required Sites artifacts present.
- `git diff --check`: passed.

final result: passed

---

**Focused QA — Cherry and apartment performance remediation**

- Browser evidence: `qa/screenshots/cherry-garden-browser-optimized.png` and `qa/screenshots/apartment-facade-browser-optimized.png` at the Codex preview viewport (849 × 837 CSS px).
- The cherry tree is now a 1.53 MiB baked GLB generated from the same MIT-licensed EZ Tree system. The previous 3,999.29 kB runtime generator chunk is absent from the production build.
- Cherry live detail remains interactive through 420 instanced blossoms and up to 80 falling-petal instances. Apartment furniture, room lighting, blinds and butterfly choreography remain live.
- Both scenes cap renderer density at 1.1×, disable costly shadow maps, and render at approximately 25 fps while onscreen. Browser inspection confirmed one active WebGL canvas, `data-ready="true"`, and no blank handoff in either scene.
- The optimized visuals retain the approved nocturnal palette, copy, hierarchy and interaction states; no raster reference was introduced.

final result: passed

---

**Design QA — Apartment façade and performance pass**

**Comparison target**

- Source visual truth: `/Users/shaurya/Desktop/webnest/public/assets/reference/apartment-why-webnest.png`.
- Browser implementation: `qa/apartment-facade-implementation.png`.
- Mobile evidence: `qa/screenshots/apartment-facade-browser-mobile.png`.
- Full-view comparison: `qa/screenshots/apartment-facade-design-qa-comparison.png`.
- Local implementation: `http://127.0.0.1:5180/#why-webnest`.

**Normalization and state**

- Source and implementation pixels: 1472 × 844 at a 1472 × 844 CSS viewport and 1× screenshot density; no resampling was used.
- Desktop state: principles phase at approximately 42% sticky progress, live façade and licensed room props loaded.
- Mobile state: 390 × 844, principles phase, first value room visible in the intentional horizontal rail.
- A focused crop was not required because the headline, all four value-room labels, furniture silhouettes, statement and CTA remain legible in the equal-size full comparison.

**Findings**

- No actionable P0/P1/P2 issue remains after the optimization pass.
- Typography and copy preserve the reference's editorial serif hierarchy, uppercase value labels, exact four principles and lower statement.
- Layout follows the reference's centered intro, paired room rows, wide lower statement and lower-right CTA. The persistent site header is an intentional journey-level difference.
- The palette remains nocturnal concrete, amber practical light, selective teal/green rooms and ember-red interaction accents.
- No reference screenshot is rendered at runtime. The façade, architectural courses, frames, blinds, balconies, lighting and furniture are live Three.js geometry; furniture uses the CC0 Kenney kit.
- Buttons retain hover, focus, click and `aria-pressed` states. The CTA reaches `#process`; mobile has no document-level horizontal overflow.

**Comparison history**

1. Initial comparison — blocked.
   - [P1] Dense opaque blinds flattened the rooms and hid the downloaded 3D props.
   - [P2] The camera crop made the building oversized and lost the source's full-façade framing.
   - Fixes: reduced blind density and opacity, exposed and relit the real props, brightened concrete courses, and pulled the camera back to restore the complete building composition.
2. Final comparison — passed.
   - Post-fix evidence: `qa/screenshots/apartment-facade-design-qa-comparison.png` shows matching content hierarchy, room placement, nocturnal lighting and full-façade scale.

**Performance verification**

- Root cause confirmed: four WebGL worlds were initialized together and retained after leaving them; Lenis also ran a perpetual smoothing RAF.
- Each 3D renderer now loads only within a 70% preload boundary and is disposed after leaving it. Browser traversal confirmed exactly one live WebGL canvas at the street, coffee, cherry and apartment checkpoints, with each scene reporting `data-ready="true"`.
- The hero now starts with zero WebGL canvases; its live flame pauses outside the hero. Native scrolling replaces the smoothing loop.
- Production entry JavaScript fell from 1,049.59 kB to 326.87 kB; Three/GLTF and all 3D scenes are lazy chunks.
- Browser console: no warnings or errors after traversing the optimized journey.
- `npm test -- --run`: 17 files, 58 tests passed.
- `npm run build`: passed and Sites artifacts emitted.
- `npm run test:sites`: 4 tests passed.
- `git diff --check`: passed.

final result: passed
