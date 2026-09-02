# WebNest Street System Design

**Status:** Approved by the user on 2026-09-01.

## Goal

Transform the existing static “One connected system” section into the third cinematic frame: an interactive, rain-soaked, high-tech New York-inspired street that continues directly from the exterior building scene and guides the visitor toward the coffee shop scene.

## Source of truth

- Figma file: `BkNTP8G1MPCRNEfv1jIQSd`
- Figma street frame: node `21:18` (`image 5`, 1672 × 941)
- Existing prototype: `/Users/shaurya/Desktop/webnest/src/`
- Durable journey: room → building → street → coffee shop

## Experience

- The camera descends from the settled building façade into a full-viewport street canyon; no independent page load or disconnected content block appears.
- The street uses a real-time WebGL environment assembled from properly licensed modular buildings, roads and urban props, with wet asphalt, deep city perspective, distant traffic silhouettes and selective magenta/cyan accents.
- Six business-system stages—Discover, Build Trust, Capture Action, Connect, Automate and Grow—appear as interactive glass waypoints along a luminous street route.
- The single global butterfly leads the route and activates the current waypoint as the visitor scrolls.
- Desktop pointer movement adds restrained parallax. Keyboard focus and hover reveal the same waypoint details.
- The exit composition aims toward a warm coffee-shop glow to establish the next scene.

## Motion and accessibility

- The scene is sticky over an extended scroll range and maps normalized section progress into camera, route and waypoint states.
- Existing GSAP/Lenis conventions remain the motion stack; no second animation framework is introduced.
- Mobile shortens the journey, removes pointer parallax and presents readable waypoints without horizontal overflow.
- Reduced-motion mode keeps the street visible, disables the butterfly and camera drift, and exposes all content without requiring animation.

## Visual constraints

- Preserve WebNest’s nocturnal editorial-luxury language and Figma hierarchy.
- Use real 3D assets for the city environment; do not use a photographic city plate or draw the city with CSS, divs or handcrafted SVG.
- Prefer web-efficient CC0 glTF/GLB models. Record their source and license in the repository.
- Keep the New York mood less flashy: practical amber street lighting and dark architectural materials dominate, while magenta is reserved for the WebNest system route.
- Keep interface copy as semantic HTML rather than baking it into the street image.
- Avoid generic dashboard styling, excessive glow and sci-fi hologram clichés.
