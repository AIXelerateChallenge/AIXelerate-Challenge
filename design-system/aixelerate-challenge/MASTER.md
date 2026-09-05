# AIXelerate Challenge / Night Build

## Physical scene

A high-school build room after sunset: laptop light, taped-up prototypes, workshop photographs floating like open windows, and one orange marker used to call the next decision.

## Voice

- Direct, restless, specific.
- The website speaks like a good mentor at the table, not a school brochure.
- Short headlines. Concrete claims. No inflated AI language.

## Palette

| Role | Token | Value |
|---|---|---|
| Stage | `--ground-000` | `oklch(14.5% 0.006 285)` |
| Raised stage | `--ground-050` | `oklch(16.8% 0.007 285)` |
| Panel | `--ground-100` | `oklch(20.5% 0.009 285)` |
| Warm white | `--ink-100` | `oklch(96.5% 0.009 92)` |
| Secondary type | `--ink-300` | `oklch(68% 0.009 285)` |
| Construction orange | `--signal-100` | `oklch(78% 0.17 68)` |
| Decision red | `--signal-300` | `oklch(62% 0.22 29)` |

Orange marks actions and the snail signature. Red is reserved for active sequence progress, underlines, and errors. Neither becomes a glow.

## Type

- Display and body: Archivo. Heavy, tightly tracked headlines reproduce the supplied Volta template’s industrial poster quality.
- Metadata and controls: JetBrains Mono. Use for dates, sequence numbers, facts, and short instructions only.
- Display headings use weights 800–900 and line heights from `.78` to `.94`.
- Body copy stays under 66 characters per line.

## Composition

- The homepage is staged as a sequence of single-purpose viewports.
- Hero typography is split around a central 3D photo object.
- Pinned desktop chapters degrade to linear lists or native scroll strips on touch devices.
- Hairline framing, sparse technical labels, and asymmetry carry the Volta reference.
- Inner pages use the same dark stage, wireframe snail, technical navigation, and orange decision language.

## Imagery

- Use only real AIXelerate event photography already present in `/public/images`.
- Default treatment: lower saturation, slightly higher contrast, and restrained brightness.
- Photographs may regain color on hover, but never become generic card decoration.

## Signature object

The supplied target-shell snail is redrawn as a hollow wireframe. In the hero it sits behind a spiral of workshop frames; in the signature interlude it becomes a tilted object under a virtual spotlight.

## Motion

- Primary: Jakub Krehel. Reveals use opacity, short translation, and blur with controlled exits.
- Secondary: Jhey Tompkins. The collage and signature object may use shallow 3D transforms.
- Emil Kowalski governs controls: buttons settle under 220ms, press scale is `.97`, and keyboard actions do not animate.
- Scroll motion is limited to the craft wheel, project deck, and process rail. Mobile uses normal document flow.
- `prefers-reduced-motion` removes all spatial and looping motion while preserving content and state.

## Responsive rules

- At 819px and below, pinned scenes become normal stacked content.
- The process becomes native horizontal scroll-snap.
- Navigation becomes a full-screen indexed drawer with 48px controls.
- Test minimum width: 375px. Horizontal document overflow is never acceptable.

## Bans

- No purple, neon, outer glow, gradient text, stock imagery, fake team profiles, or fabricated event metrics.
- No generic equal card grids.
- No borrowed Aura runtime or remote template imagery.
- No motion needed to understand content or complete an application.
