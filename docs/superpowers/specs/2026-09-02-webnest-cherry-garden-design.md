# WebNest Cherry Garden Design Specification

## Intent

Build the fifth connected WebNest scene as a living, scroll-directed cherry-blossom garden. It begins at the coffee shop's rear door, preserves the Figma frame's dark editorial composition, explains how one connected WebNest system adapts to six business types, and points the butterfly toward the next apartment-building frame.

## Visual Source of Truth

- Figma file: `BkNTP8G1MPCRNEfv1jIQSd`
- Figma node: `23:24` (`image 7`, 1672 × 941)
- Match the source's large overhanging tree, rain-dark street, warm house windows, muted rose blossoms, thin ember borders, restrained information plaques, and lower editorial callout.
- Do not render the Figma image, a city photograph, or a tree photograph as the page background.

## Scene and Motion

- The coffee-shop rear-door exit flows directly into this frame; do not insert a separator or empty transition screen.
- Use a real, licensed 3D cherry-tree asset as the hero geometry.
- Render falling petals in WebGL with deterministic drift, rotation, and recycling.
- The same global butterfly enters from the café door, passes through a stable branch-height band, pauses near the main branch, and leaves toward the apartment-building scene.
- Desktop uses a sticky 260vh scroll scene with restrained camera travel and pointer parallax.
- Mobile shortens the journey, reduces plaque density, and keeps horizontal cards usable.
- Reduced-motion mode uses a stable composition and greatly reduced petal movement.

## Content and Interaction

- Eyebrow: `Built for real businesses`
- Headline: `Different businesses. Different needs. One WebNest.`
- Supporting copy: `WebNest adapts the system around how your customers discover, contact and buy from your business.`
- Six interactive journeys: Restaurants, Salons, Clinics, Gyms, Coaching, and Retail.
- Selecting, focusing, or hovering a journey updates the active plaque and its linked 3D branch lantern.
- Closing statement: `Your business has its own customer journey. Your digital system should too.`
- CTA: `Explore business solutions`, linking to `#industries`.

## Performance and Accessibility

- Cap device pixel ratio and render only while the scene is visible.
- Keep the hero model near web-ready size and document its license.
- Use semantic buttons, visible focus states, accessible labels, and a descriptive canvas role.
- Avoid essential text inside WebGL; every business journey must remain HTML.

