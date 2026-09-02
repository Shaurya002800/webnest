# Prototype Instructions

Run the local server yourself and open the preview in the browser available to this environment. Do not give the user server-start instructions when you can run it.

Before making substantial visual changes, use the Product Design plugin's `get-context` skill when the visual source is unclear or no longer matches the current goal. When the user gives durable prototype-specific design feedback, preferences, or decisions, record them in `AGENTS.md`.

When implementing from a selected generated mock, treat that image as the source of truth for layout, component anatomy, density, spacing, color, typography, visible content, and hierarchy.

Build app UI in `src/`. Keep `.openai/hosting.json`, `worker/index.js`, `scripts/prepare-sites-build.mjs`, and `tests/sites-worker.test.mjs` intact so the same local prototype can be handed to Sites. Before a Sites handoff, run `npm run build` and `npm run test:sites`; the build must leave `dist/client/index.html`, `dist/server/index.js`, and `dist/.openai/hosting.json`.

## Durable WebNest decisions

- The homepage candle flame must be rendered live in the browser and must not be baked into a static image.
- The hero butterfly is an independent asset that flies diagonally above and beside the candle while staying inside a narrow, stable altitude band.
- Preserve the approved Figma's nocturnal, cinematic, editorial-luxury character and its connected room-to-city journey.
- Canonical conversion routes are `/free-audit` and `/start-project`.
- The hero-to-second-frame transition follows the butterfly through the studio window into an exterior building view; the building becomes the complete Growth Problems frame rather than a separate cutscene.
- Desktop uses restrained perspective/parallax for this transition; mobile uses a shorter reveal and reduced-motion uses a dissolve.
- The landing hero and exterior building are one continuous sticky scroll journey: hero copy fades in place, the butterfly exits through that same room window, and the building arrives directly. Never insert or repeat an empty room frame between them.
- The third frame is a highly interactive, rain-soaked, high-tech New York-inspired street. It must continue directly from the exterior building, express the connected business system through physical street waypoints, and aim the exit toward the coffee-shop scene.
- The street environment must be rendered from real-time 3D city components and props, not a photographic city plate. Keep the New York atmosphere restrained and less flashy: deep blue-black materials, wet-road reflections, practical amber light, and selective magenta accents only.
