# WebNest — Complete Project Context

**Last updated:** 2026-09-03  
**Repository:** `/Users/shaurya/Desktop/webnest`  
**Current product stage:** Interactive homepage prototype in active development  
**Current implementation milestone:** Frames 1–13 and both conversion routes are implemented; production backend, final content confirmation, and launch hardening remain

## 1. Purpose of this file

This is the durable handoff document for WebNest. It records:

- what the business and website are trying to achieve;
- the approved experience and visual direction;
- the actual implementation and technical architecture;
- what is finished, partial, superseded, or still missing;
- performance, accessibility, asset, routing, and QA decisions;
- the recommended order for completing the website.

Use this file before starting a new WebNest task. It is descriptive project context, not permission to ignore a newer user request.

### Source priority

When sources disagree, use this order:

1. The user's latest direct instruction.
2. `AGENTS.md` durable WebNest decisions.
3. The currently rendered implementation in `src/`.
4. The newest matching section in `design-qa.md`.
5. Existing specifications and plans under `docs/superpowers/`.
6. Older Figma/architecture recommendations.

The original business blueprint was previously supplied as `WebNest_Complete_Business_and_Website_Blueprint(1).docx`, but that file is no longer present at its original Downloads path. The business summary below is therefore grounded in the implemented copy, earlier conversation context, Figma-flow notes, and repository documents. Reconcile this file with the original blueprint if it is attached again.

## 2. Business context

### Business

WebNest is positioned as a strategy, identity, website, and digital-growth studio for growing businesses. It is not presented as a commodity website agency. The central promise is to create connected digital systems around how a business attracts, converts, and serves customers.

### Core positioning

- **Primary proposition:** “Where brands become worlds.”
- **Differentiation:** More than a website agency; business-first, connected, tailored, and growth-oriented after launch.
- **Operating idea:** Strategy, story, website, SEO, customer flow, automation, and growth should work as one system.
- **Brand character:** Small-team attention, senior craft, transparent decisions, and full-system thinking.
- **Emotional impression:** Calm confidence, dark royalty, cinematic craft, technological competence, and restraint.

### Current service model represented on the site

1. Brand strategy
2. Identity design
3. Web experiences
4. Growth systems

The coffee-shop scene also frames the service story through four interactive service pillars.

### Business categories represented

- Restaurants
- Salons
- Clinics
- Gyms
- Coaching businesses
- Retail

The generic industries section currently also lists:

- Startups
- Hospitality
- Professional services
- Creators
- Wellness
- E-commerce

The overlap between these two taxonomies should be resolved before launch.

### Current commercial offers in the prototype

- **Foundation — ₹45k+**: positioning sprint, visual identity, one-page website.
- **Growth — ₹95k+**: full brand system, conversion website, launch campaign.
- **Partnership — Custom**: monthly roadmap, design/development, growth experiments.
- **Free growth audit**: no obligation, currently described as delivered within three working days.

These prices and deliverables are prototype copy and require final business confirmation.

### Primary conversion paths

- `/free-audit`
- `/start-project`

All major homepage CTAs consistently use these paths. The destination pages and real form workflows have not been built yet.

## 3. Experience north star

WebNest is a connected cinematic scroll story, not a normal stack of unrelated landing-page sections.

### Journey principle

The visitor follows one butterfly through a nocturnal city:

1. Studio room and candle
2. Exterior problem building
3. Connected-system street
4. Royal coffee shop
5. Cherry-blossom business journeys
6. Apartment façade / Why WebNest
7. Sky / selected work
8. Rooftop / process
9. Staircase / pricing
10. Street / free audit
11. Road / FAQ
12. Return to the original building and room / final CTA
13. Footer / closing

Transitions matter as much as individual frames. Each frame must inherit the camera direction, butterfly direction, light, doorway, window, road, branch, or architectural line of the previous frame.

### Permanent visual language

- Near-black base across the experience.
- Editorial serif display typography paired with a modern sans-serif UI font.
- Warm ivory text instead of pure white.
- Thin aged-brass, ember, or muted red borders.
- Practical amber light stronger than decorative neon.
- Selective crimson, violet, rose, cyan, teal, and moonlight accents by scene.
- Royal character through spacing, material depth, lighting, and restraint—not decorative excess.
- Real environmental assets where appropriate; semantic HTML for all essential content.

### Permanent UX rules

- Native scrolling must never feel trapped, delayed, or floaty.
- The experience must remain readable before heavy assets finish loading.
- Motion guides attention; it does not compete with copy or CTAs.
- Desktop receives the richest version.
- Mobile receives the same story with shorter travel, simpler effects, and no shrunken desktop assumptions.
- Reduced-motion users receive complete static content without scrub-dependent comprehension.
- Customer smoothness takes priority over maintaining WebGL everywhere.

## 4. Actual technical stack

The earlier Figma guidance recommended Next.js, GSAP, Lenis, Rive, Zustand, and selective React Three Fiber. That was a proposed architecture, not the stack currently implemented.

### Current runtime

- React 19
- Vite 6
- JavaScript entry files with TypeScript/TSX prototype components
- Three.js used directly for the street and coffee-shop environments
- CSS for layout, responsive behavior, transitions, glow, and most UI motion
- Phosphor Icons
- Vitest + Testing Library
- Native browser scrolling
- Intersection Observer for media/scene activation
- Custom progress-state functions and browser events for cross-scene coordination

### Installed but not currently central

- `@dgreenheck/ez-tree` is used by the sakura-tree regeneration utility and its tests; the active cherry scene loads the generated GLB.

### Not implemented

- Next.js
- React Router or another route-specific page router
- Lenis smooth scrolling
- Rive butterfly state machine
- Zustand store
- React Three Fiber / Drei
- CMS
- Backend/API
- Form submission service
- Analytics
- Authentication
- Database

Do not migrate the stack merely because the older recommendation mentioned these tools. Add or migrate only when a specific remaining requirement justifies it.

## 5. Current architecture

### Application entry

- `src/main.jsx` mounts the React application.
- `src/App.jsx` renders only `Homepage`.
- `src/prototype/components/Homepage.tsx` assembles the entire current experience.
- `src/styles.css` contains the shared visual system, scene layout, responsive behavior, and motion styling.

### Scene state

Pure state modules translate normalized scroll progress into visual state:

- `exterior-transition.ts`
- `street-system.ts`
- `coffee-shop.ts`
- `cherry-garden.ts`
- `apartment-facade.ts`

Their corresponding React scenes publish browser events such as:

- `webnest:exterior-progress`
- `webnest:street-progress`
- `webnest:coffee-progress`
- `webnest:cherry-progress`
- `webnest:apartment-progress`

### Butterfly coordination

`ButterflyDirector.tsx` is mounted once above the full experience. It listens to scene progress events and updates CSS variables for position, scale, rotation, realm, and opacity.

Known continuity gap: the director currently sets butterfly opacity to zero in the cherry and apartment realms. This was correct when those plates contained a baked butterfly, but the new clean replacement plates do not. Restoring the single visible butterfly through these realms is the highest-priority continuity fix.

### Motion policy

`motion-policy.ts` assigns four tiers:

- `full`
- `lite`
- `minimal`
- `still`

The policy considers viewport width and `prefers-reduced-motion`. Smooth scrolling is deliberately disabled.

### Heavy-scene lifecycle

`ViewportScene.tsx` mounts heavy scene content only within a `20%` Intersection Observer preload margin and unmounts it outside that boundary.

This prevents street and coffee WebGL worlds from remaining active together during normal traversal.

## 6. Frame-by-frame implementation status

| # | Story frame | Current component/section | Status | Important notes |
|---|---|---|---|---|
| 0 | Global navigation and butterfly | `Header`, `ButterflyDirector` | Implemented across the full journey | Header, anchors, mobile menu, and one persistent butterfly now continue through every cinematic frame before fading in the final room. |
| 1 | Studio room / homepage hero | `ExteriorTransition`, `LiveFlame` | Implemented and visually QA'd | Live browser-rendered candle flame, diagonal butterfly, two conversion CTAs, dark editorial room. |
| 2 | Growth Problems exterior building | `ExteriorTransition` | Implemented and connected to hero | Hero copy fades in place; butterfly exits through the window; no duplicate empty-room frame. |
| 3 | Connected-system street | `StreetSystem`, `StreetCity3D` | Implemented and visually QA'd | Real-time 3D New York-inspired street, wet road, licensed city props, six interactive waypoints, restrained practical lighting. |
| 4 | Royal coffee shop / services | `CoffeeShopScene`, `CoffeeShop3D` | Implemented and visually QA'd | Real-time 3D interior, licensed 1K props, four service pillars, rear-door exit direction. |
| 5 | Cherry-blossom business journeys | `CherryGardenScene` | Implemented with lightweight media | Clean WebP plate, live HTML content, six business journey controls, licensed slow petal loop, visible butterfly, no WebGL. |
| 6 | Apartment façade / Why WebNest | `ApartmentFacadeScene` | Implemented with lightweight media and interaction | Clean WebP plate, live semantic copy, four interactive rooms, hover/focus enlargement and amber glow, visible butterfly, no WebGL. |
| 7 | Sky / selected work | `SelectedWorkScene` | Implemented from Figma node `25:30` | Clean moonlit city-canyon plate, three interactive concept panels, live copy, apartment-to-sky butterfly continuation. |
| 8 | Rooftop / process | `ProcessScene` | Implemented | Clean moonlit rooftop plate and five interactive Understand → Plan → Build → Launch → Grow steps. |
| 9 | Staircase / pricing | `PricingScene` | Implemented | Clean magenta stairwell plate, Starter/Growth/GrowthOS offers, preserved package query parameters, custom-quote route. |
| 10 | Street / free audit | `AuditScene` | Implemented | Clean high-angle wet-street plate, six audit checks, canonical `/free-audit` CTA. |
| 11 | Road / FAQ | `FaqRoadScene` | Implemented | Clean red-moon wet-road plate with a keyboard-operable six-question accordion. |
| 12 | Return building/room / final CTA | `FinalRoomScene` | Implemented | Clean candlelit-room plate, final conversion choice, and butterfly rest/fade. |
| 13 | Closing footer | `SiteFooter` | Implemented | Figma-aligned black editorial footer with brand statement, navigation, contact, and legal row. |

## 7. Implemented details

### Frames 1–2: room to problem building

- One continuous sticky journey.
- Candle flame is rendered live and is not part of the background image.
- Butterfly flies diagonally beside/above the candle within a controlled altitude band.
- Hero copy fades without inserting a duplicate room.
- The butterfly exits through the same visible room window.
- Exterior building becomes the Growth Problems frame directly.
- Desktop uses restrained depth and parallax.
- Mobile uses a shorter reveal.
- Reduced motion uses a simpler/static transition.

### Frame 3: connected street

- Real-time Three.js city—not a photographic plate.
- Licensed Quaternius and Kenney city assets.
- Deep blue-black architecture, readable façades, wet-road reflections, amber street lighting, restrained magenta route accents.
- Six system stages: Discover, Build Trust, Capture Action, Connect, Automate, Grow.
- Hover, focus, click, and scroll update active waypoints.
- Street exit points toward the coffee shop.
- Scene is lazy-mounted through `ViewportScene`.

### Frame 4: coffee shop

- Real-time Three.js interior—not the Figma image or a café photograph.
- Espresso black, walnut, aged brass, warm amber, cream, and restrained ember red.
- Licensed Poly Haven armchair, chandelier, coffee cart, and coffee table assets.
- Four service pillars remain semantic HTML.
- Butterfly route enters from the street, settles near the bar, and aims toward the rear door.
- Scene is lazy-mounted and pauses outside the viewport.

### Frame 5: cherry garden

- Strategy changed from live WebGL to optimized media because customer smoothness is more important than retaining 3D in late scenes.
- Background: `public/assets/reference/cherry-garden-royal.webp`.
- Falling petals: `public/assets/generated/cherry-petal-slow.mp4`.
- Petal loop is 16 seconds, 24 fps, 960 × 540, approximately 2.4 MB.
- Video source is applied only near the viewport, pauses offscreen, and is hidden for reduced motion.
- Desktop palette is dark royal: near-black surfaces, amber street light, ivory serif type, aged-brass/ember lines.
- Six journey buttons remain semantic and interactive.
- Mobile uses a horizontal snap rail with no page-level overflow.
- No WebGL canvas is created.

### Frame 6: apartment façade

- Strategy changed from live Three.js rooms to an optimized clean façade plate plus semantic interaction.
- Background: `public/assets/reference/apartment-facade-royal.webp` (approximately 188 KB).
- Headline, principle content, lower statement, and CTA are live HTML.
- Four principle rooms: Business First, Everything Connected, Built Around You, Growth After Launch.
- Hovering or keyboard-focusing a principle:
  - activates its mapped room;
  - scales the room to 110%;
  - introduces a layered amber practical-light glow;
  - recedes non-target rooms to 58% opacity;
  - uses a 720–900 ms eased transition.
- Mobile retains a readable horizontal rail without the scale-heavy desktop behavior.
- Reduced motion preserves selection without the transform.
- CTA links to `#process`.
- No WebGL canvas is created.

### Functional fallback sections after Frame 6

The following are implemented as conventional responsive sections so the full homepage remains usable while their cinematic frames are pending:

- Services
- Industries
- Selected work
- Process
- Pricing
- Free audit
- FAQ
- Final CTA
- Footer

These sections should not automatically be deleted. Decide whether each becomes the semantic foreground of its matching cinematic frame, remains as a fallback, or is consolidated to avoid repetition.

## 8. Current content inventory

### Selected work placeholders

- Aster House — Identity / Hospitality — “+64% direct enquiries”
- Nami Rituals — Digital / Wellness — “2.3× conversion rate”
- Northstar OS — Platform / Technology — “Launch in 7 weeks”

These are prototype case studies and need replacement or confirmation before launch.

### Process

1. Discover
2. Define
3. Design
4. Deliver

### FAQ

- How long does a project take?
- Can you work with an existing brand?
- Do you only build websites?
- What happens after launch?

### Contact and closing copy

- Email currently displayed: `hello@webnest.studio`
- Footer line: “Made after dark.”

Confirm the email address, legal business name, copyright, domain, and policies before launch.

## 9. Performance architecture and current state

### Current protections

- Native scrolling; no perpetual smooth-scroll animation loop.
- Heavy WebGL scenes load only near the viewport.
- Street and coffee renderers pause or unmount offscreen.
- Cherry and apartment create no WebGL contexts.
- Cherry video is lazy-enabled and pauses offscreen.
- Motion primarily uses transforms and opacity.
- Mobile reduces visual complexity.
- Reduced-motion mode removes scrub-dependent travel.

### Last verified production build (2026-09-03)

- Main entry JS: approximately 327 KB before gzip.
- CSS: approximately 59 KB before gzip.
- Coffee scene JS: approximately 6 KB lazy chunk.
- Street scene JS: approximately 56 KB lazy chunk.
- GLTF loader/Three support: approximately 621 KB lazy chunk.
- No active CherryGarden3D or ApartmentFacade3D production chunks.

Public images, videos, and GLB/glTF assets are separate from these JavaScript chunk numbers.

### Performance work still required

- Run a real Lighthouse/Web Vitals pass on production-like hosting.
- Test memory and GPU behavior on a low-end Android device and Safari/iOS.
- Confirm all scene media sizes and cache headers after deployment.
- Confirm no long tasks during transitions between street, coffee, and cherry.
- Decide whether unused legacy 3D modules/assets should be removed from the repository.
- Add explicit low-power detection if browser/device evidence justifies it.

## 10. Accessibility and responsive behavior

### Implemented

- Semantic landmarks and heading structure.
- Skip link.
- Keyboard-operable navigation and FAQ.
- Interactive business journeys and principle rooms use real buttons.
- `aria-pressed` communicates active controls.
- Focus-visible states exist.
- CTAs are real links.
- Reduced-motion behavior exists.
- 390 px layouts have been checked for document-level horizontal overflow.
- Essential copy is not trapped inside WebGL.

### Remaining

- Complete keyboard and screen-reader audit across Frames 7–13.
- Audit color contrast in all active/hover/receded room states.
- Build accessible labels, validation, error summaries, and success states for both conversion forms.
- Run a full automated accessibility audit and manual screen-reader pass before launch.
- Add final privacy, terms, and consent flows if analytics or marketing tools are introduced.

## 11. Routes and functional gaps

The homepage links correctly to `/free-audit` and `/start-project`, but there is no route-aware component system. `App.jsx` always renders `Homepage`.

Therefore:

- `/free-audit` does not yet provide a dedicated audit form page.
- `/start-project` does not yet provide a dedicated enquiry/onboarding form page.
- There is no form submission, API, email delivery, CRM connection, persistence, or success state.
- Query parameters added by service, industry, and package links are not consumed by a destination form.

This is a launch blocker, not just visual polish.

## 12. Asset and licensing inventory

### Street assets

- Quaternius Downtown City MegaKit — CC0.
- Kenney City Kit (Commercial) — CC0.
- Kenney City Kit (Roads) — CC0.

### Coffee-shop assets

- Poly Haven Arm Chair 01 — CC0.
- Poly Haven Chandelier 03 — CC0.
- Poly Haven Modern Coffee Table 01 — CC0.
- Poly Haven Coffee Cart 01 — CC0.

### Cherry assets

- Pixabay cherry-petal footage by yuku777 — Pixabay Content License.
- Local 8-second optimized source and 16-second slow derivative are documented in `public/assets/generated/cherry-petal-loop-LICENSE.md`.
- Earlier EZ Tree and scanned-tree assets remain in the repository but are not active runtime scenery.

### Apartment assets

- Current runtime uses the clean user-supplied façade plate.
- Earlier Kenney Furniture Kit files are CC0 but are not used by the active plate-based scene.

### Documentation warning

Some older asset READMEs and scene specifications still describe the cherry and apartment scenes as live Three.js implementations. Those descriptions are historical. `AGENTS.md`, active components, and this context file supersede them.

## 13. Testing and QA status

### Last verified on 2026-09-03

- `npm test`: 18 test files, 62 tests passed.
- `npm run build`: passed.
- `npm run test:sites`: 4 tests passed.
- `git diff --check`: passed.
- Sites artifacts emitted:
  - `dist/client/index.html`
  - `dist/server/index.js`
  - `dist/.openai/hosting.json`
- Browser console had no errors or warnings in the latest cherry/apartment desktop and mobile passes.

### QA evidence

Recent QA files are under `qa/`, including:

- `qa/cherry-garden-dark-royal.png`
- `qa/cherry-garden-dark-royal-mobile.png`
- `qa/cherry-garden-dark-royal-comparison.jpg`
- `qa/apartment-window-hover-final.png`
- `qa/apartment-window-mobile.png`
- `qa/apartment-window-hover-comparison.jpg`

`design-qa.md` includes historical passes. Use its newest relevant QA entry; older entries may describe superseded 3D approaches.

## 14. Known technical debt and contradictions

1. **Butterfly continuity:** hidden in clean cherry/apartment frames even though those plates no longer include it.
2. **Duplicate content:** coffee/cherry tell the services/industries stories, but conventional Services and Industries sections still follow the apartment frame.
3. **Unused legacy modules:** `CherryGarden3D.tsx` and `ApartmentFacade3D.tsx` remain in the repository but are not used by the active homepage.
4. **Unused dependencies:** GSAP and EZ Tree are installed but not used by active source code.
5. **Stale documentation:** some specs, plans, and asset READMEs describe older runtime decisions.
6. **No actual route pages:** audit and project links do not lead to dedicated experiences.
7. **Prototype content:** prices, case studies, results, business email, and delivery promises need business confirmation.
8. **No backend or analytics:** forms, CRM/email, event tracking, consent, and operational workflows are absent.
9. **No production SEO pass:** metadata, social cards, canonical URLs, sitemap, schema, and robots behavior need implementation.
10. **No complete production-device performance audit:** current verification is local browser and build based.

## 15. Completion roadmap

### Phase A — Stabilize Frames 1–6

1. Restore the single global butterfly through the cherry and apartment frames.
2. Make the apartment exit point clearly toward the sky/portfolio frame.
3. Confirm coffee rear-door → cherry and cherry → apartment visual handoffs after the clean-plate changes.
4. Decide how conventional Services and Industries sections integrate with or collapse into the cinematic scenes.
5. Remove or archive unused late-scene 3D components, assets, and dependencies only after confirming they are no longer needed.
6. Update stale asset READMEs and historical spec status notes.
7. Run a complete Frame 1–6 mobile and reduced-motion traversal.

### Phase B — Frame 7: Sky / Selected Work

Goal: transition from apartment windows upward into a moonlit sky/portfolio environment.

Planned content:

- Selected work headline.
- Three case studies with real imagery/data.
- Project category and measurable outcome.
- Interaction that reveals each project without feeling like a generic card grid.

Implementation direction:

- Prefer 2D/2.5D composition, masks, depth layers, and optimized images.
- Add WebGL only if the user-approved frame requires depth that cannot be achieved efficiently otherwise.
- Continue the butterfly upward from the apartment façade.
- End with a camera direction that can settle onto the rooftop.

User should provide frame-specific input before implementation begins.

### Phase C — Frame 8: Rooftop / Process

Goal: land on a cinematic rooftop and explain Discover → Define → Design → Deliver.

- Reuse the existing four-step semantic process content.
- Use rooftop objects only where they support hierarchy and depth.
- Preserve practical bronze/amber light over moonlit charcoal.
- End at an architectural path or opening that naturally leads to the staircase.

### Phase D — Frame 9: Staircase / Pricing

Goal: turn descending/ascending architecture into a clear pricing journey.

- Present Foundation, Growth, and Partnership without generic SaaS-card styling.
- Preserve package query parameters in links.
- Make the featured Growth offer clear but not flashy.
- End toward street level and the audit scene.

### Phase E — Frame 10: Street / Free Audit

Goal: bring the visitor back to street level and convert interest into an audit request.

- Preserve the existing audit promise and three audit outcomes.
- Connect visually to the earlier city without repeating the same street scene.
- CTA leads to the real `/free-audit` flow.

### Phase F — Frame 11: Road / FAQ

Goal: answer objections while the journey continues along the road.

- Keep the existing accessible accordion.
- Integrate questions into the environment without reducing legibility.
- Maintain natural scrolling and avoid making reading dependent on motion.

### Phase G — Frame 12–13: Return room, final CTA, and footer

Goal: complete the circle by returning to the original building/room.

- Reconnect to the opening visual language.
- Give the butterfly a clear final rest/disappearance moment.
- Present Start a Project and Get a Free Audit as the final choice.
- Finish with the existing brand/email/footer content.

### Phase H — Build conversion routes

#### `/free-audit`

- Dedicated page or route-aware view.
- Clear qualification questions.
- Contact and business details.
- Website URL and primary problem.
- Consent/privacy language.
- Validation, loading, error, and success states.
- Submission delivery to an approved backend/email/CRM.

#### `/start-project`

- Dedicated page or route-aware view.
- Consume `service`, `industry`, and `package` query parameters.
- Project goals, scope, budget, timeline, contact, and optional links/files.
- Validation, loading, error, and success states.
- Submission delivery to an approved backend/email/CRM.

### Phase I — Launch hardening

1. Replace/confirm prototype copy, prices, case studies, statistics, and contact details.
2. Add metadata, Open Graph assets, sitemap, robots, canonical tags, and structured data.
3. Add analytics and conversion events only after selecting a privacy-compliant provider.
4. Add privacy/terms pages and consent behavior as required.
5. Complete accessibility audit.
6. Complete Lighthouse/Web Vitals and real-device testing.
7. Verify asset licenses and remove unused assets.
8. Configure deployment, domain, caching, and error monitoring.
9. Run full regression, build, Sites packaging, and visual QA.

## 16. Per-frame implementation protocol

For every remaining cinematic frame:

1. Receive the user's extra frame-specific input.
2. Resolve the exact Figma frame or supplied screenshot as visual truth.
3. Inspect the incoming and outgoing frame so continuity is designed first.
4. Decide the lightest credible rendering approach:
   - semantic DOM + optimized image;
   - 2.5D layered media;
   - video only when it improves motion efficiently;
   - WebGL only when genuine depth/interactivity justifies it.
5. Keep essential copy and controls as semantic HTML.
6. Define desktop, mobile, reduced-motion, hover, focus, selected, and loading states.
7. Write/adjust tests before implementation behavior.
8. Implement the frame and its two transitions.
9. Verify in the browser at desktop and 390 px mobile.
10. Compare the source and implementation in the same state.
11. Fix P0/P1/P2 visual or UX issues.
12. Run:
    - `npm test`
    - `npm run build`
    - `npm run test:sites`
    - `git diff --check`
13. Update `AGENTS.md`, `design-qa.md`, and this file when a durable decision changes.

## 17. Open business/product decisions

These do not block the next visual frame, but they must be resolved before launch:

- Final business legal name and public brand name.
- Final domain and email address.
- Confirmed service packages, prices, inclusions, and delivery promises.
- Real portfolio projects, imagery, categories, and approved performance claims.
- Final industry taxonomy.
- Whether conventional Services/Industries sections remain after their cinematic equivalents.
- Form backend, CRM/email destination, and response workflow.
- Analytics provider and privacy/consent approach.
- CMS requirement for work, pricing, FAQs, or articles.
- Deployment target and production domain.
- Whether optional ambient audio is desired; default should remain silent.
- Whether project enquiries accept file uploads.

## 18. Important files

### Core source

- `src/prototype/components/Homepage.tsx`
- `src/prototype/components/ExteriorTransition.tsx`
- `src/prototype/components/LiveFlame.tsx`
- `src/prototype/components/ButterflyDirector.tsx`
- `src/prototype/components/StreetSystem.tsx`
- `src/prototype/components/StreetCity3D.tsx`
- `src/prototype/components/CoffeeShopScene.tsx`
- `src/prototype/components/CoffeeShop3D.tsx`
- `src/prototype/components/CherryGardenScene.tsx`
- `src/prototype/components/ApartmentFacadeScene.tsx`
- `src/prototype/components/ViewportScene.tsx`
- `src/prototype/scene-model.ts`
- `src/prototype/motion-policy.ts`
- `src/styles.css`

### Project decisions and planning

- `AGENTS.md`
- `design-qa.md`
- `docs/superpowers/specs/`
- `docs/superpowers/plans/`

### Build and hosting

- `vite.config.mjs`
- `.openai/hosting.json`
- `worker/index.js`
- `scripts/prepare-sites-build.mjs`
- `tests/sites-worker.test.mjs`

### Assets

- `public/assets/reference/`
- `public/assets/generated/`
- `public/assets/3d/`

## 19. Commands

```bash
npm run dev -- --host 127.0.0.1 --port 5180
npm test
npm run build
npm run test:sites
git diff --check
```

Do not tell the user to start the local server when the working environment can start and open it directly.

## 20. Definition of complete

WebNest is complete only when:

- all thirteen story frames feel like one connected journey;
- the butterfly continuity is unbroken;
- each transition has an intentional incoming and outgoing camera/light direction;
- all essential content remains readable and semantic;
- mobile and reduced-motion experiences preserve the full story;
- `/free-audit` and `/start-project` are real functional conversion flows;
- business copy, prices, portfolio claims, and contact details are confirmed;
- accessibility, performance, SEO, analytics/privacy, and real-device QA pass;
- production build and Sites packaging pass;
- the deployed experience is fast enough to make a strong first impression.

## 21. Recommended immediate next task

Before Frame 7, make one short stabilization pass:

1. restore the visible butterfly in the clean cherry and apartment scenes;
2. establish the apartment-window → sky exit transition;
3. decide how the existing Services and Industries fallback sections will integrate with the finished cinematic sequence.

Then begin **Frame 7: Sky / Selected Work** using the user's new frame-specific input.
