# WebNest Coffee Shop Design

**Status:** Approved for implementation from the user's 2026-09-02 direction.

## Goal

Build the fourth cinematic frame as a real-time 3D royal coffee-shop interior that continues directly from the New York-inspired street and guides the butterfly toward the next cherry-blossom scene.

## Source of truth

- Figma file: `BkNTP8G1MPCRNEfv1jIQSd`
- Figma coffee-shop frame: node `22:21` (`image 6`, 1672 × 941)
- Existing prototype: `/Users/shaurya/Desktop/webnest/src/`
- Durable journey: room → building → street → coffee shop → cherry-blossom house

## Experience

- The street's warm doorway expands into the coffee shop; the transition is continuous rather than a disconnected page cut.
- The camera enters a dark espresso-and-walnut interior with brass pendants, a central bar and coffee machine, shelving, menu wall, café tables, classic seating and botanical detail.
- The global butterfly crosses the threshold, settles above the right side of the bar as the service story becomes readable, then departs through the rear door toward the cherry-blossom scene.
- The Figma hierarchy stays intact: editorial heading on the left, shop identity/menu on the right, four service pillars across the lower third, and one closing service CTA.
- Service pillar copy remains semantic HTML; no text is baked into imagery or WebGL textures.

## Motion and interaction

- A pure `getCoffeeShopState(progress)` function maps normalized scroll progress to scene phase, camera pose, content reveal, active service pillar and butterfly pose.
- The scene is sticky over an extended scroll range and publishes `webnest:coffee-progress` for the existing global `ButterflyDirector`.
- Desktop pointer movement adds restrained parallax and service pillars respond to hover, focus and click.
- Mobile shortens the journey and turns the four pillars into a readable horizontal rail.
- Reduced motion keeps the interior visible, hides the butterfly and exposes all service content without requiring scroll choreography.

## Visual constraints

- Match Figma node `22:21`: near-black coffee-brown base, warm amber practical light, walnut wood, aged brass, cream editorial type and restrained ember red accents.
- Use real licensed 3D furniture, lighting and coffee props. Do not use the Figma image, a coffee-shop photograph, CSS/div artwork or handcrafted SVG as the interior.
- Keep WebGL assets web-efficient: prefer 1K glTF/GLB variants, reuse loaded models and materials, cap device pixel ratio and render only while visible.
- Royal means cinematic material depth, hierarchy and restraint; avoid gold overload, fantasy ornament and neon café styling.

## Accessibility and conversion

- The section is an accessible region named “Everything your business needs to grow online”.
- The four service pillars are keyboard-focusable and expose their full summaries.
- The CTA links to the existing `#services` section; canonical routes remain `/free-audit` and `/start-project` elsewhere.

