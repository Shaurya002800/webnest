# WebNest Apartment Façade Design

## Goal

Replace the generic “Why WebNest” block with a connected, interactive apartment-building frame that follows the cherry garden and faithfully recreates the supplied 1472 × 844 reference without rendering that screenshot.

## Visual source of truth

- `/Users/shaurya/Desktop/webnest/public/assets/reference/apartment-why-webnest.png`
- Full-height dark concrete apartment façade, warm scattered windows, selective teal rooms, centered editorial headline, four large value rooms, a lower statement room, and a lower-right CTA room.

## Scene and interaction

- The cherry butterfly enters near the lower-left/center façade and moves between the four value rooms.
- Scroll selects each value room in sequence; pointer, keyboard focus, or click also selects a room.
- The active room receives a stronger practical light, brighter border, and a subtle camera focus—not a neon UI effect.
- Window blinds and room light intensity move slightly with pointer position and scroll.
- The lower CTA links to `#process` and remains a semantic link.
- Reduced motion renders a static façade and readable grid, with no continuously moving camera or blinds.

## 3D construction

- Three.js builds the concrete shell, recessed windows, frames, balcony rails, mullions, blinds, roofline, side-city silhouettes, and room volumes.
- Twelve selected Kenney Furniture Kit GLBs furnish the visible rooms. The pack is CC0 and documented under `public/assets/3d/apartment/README.md`.
- Practical lights are amber/orange in most rooms, teal in a few secondary rooms, and olive-green in the second principle room.
- The supplied screenshot remains QA-only and is never referenced by runtime code.

## Responsive behavior

- Desktop preserves the reference's façade grid and overlaid text layout at 1472 × 844.
- Mobile shortens the scroll travel, retains the central title, and converts the four value rooms into a horizontal snap rail over a cropped live façade.
- The CTA and active room remain reachable at 390 px without document-level overflow.

## Accessibility and performance

- Value rooms are buttons with `aria-pressed`; CTA is a real link.
- The 3D canvas has a descriptive accessible label and decorative canvas internals are hidden.
- Furniture loads only when the section approaches the viewport.
- Rendering pauses when the section is offscreen and caps pixel ratio on compact screens.

