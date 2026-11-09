# Hatch — redesign direction contract (working note)

**Authority:** replace (user-approved full redesign). Preserve product truth, routes, auth, backend contracts and the "Hatch" brand.

**Thesis:** a calm, dense operational console that disappears into the token-generation task. It avoids glassmorphism, animated gradient blobs, gradient text and gradient CTAs.

## Visual world

- Light neutral ground (`#FAFAFA`) with white surfaces and 1px zinc borders; one grey family (zinc).
- One locked accent: brand red `#E5173A` (brand-700) for the primary action, active states, focus rings and the application badge. Semantic red/amber/green are reserved for status; the destructive button uses a soft red outline and error text uses a darker red so the primary action is never confused with danger.
- Type: system sans stack (Inter-like), 12/14/16px steps; monospace only for the token and URL data.
- Shape lock: inputs/buttons/selects 8px, cards 12px, badges/pills full.
- Depth: one subtle card shadow; no glow, no blur.

## First viewport

Header (brand + environment badge + account), then a two-column workspace — form (5/12) and result artifact (7/12) — with saved entries below. The saved-entries heading and filters stick below the header on scroll so they stay reachable. Primary action: "Generate token".

## States

Idle empty state, loading skeleton, inline error with retry, success artifact with copy/open, disabled, selected, focus-visible.

## Motion

Opacity-only 150ms feedback for the toast; no entrance choreography; reduced-motion collapses transitions.

## Target status

Image generation was unavailable (the service returned "Insufficient account funds"), so no generated target exists. Comparison is against the incumbent system and this contract. Visual verification used a labeled development preview harness with illustrative fixtures, not the authenticated app.

## Finish

Representative desktop/tablet/mobile widths, keyboard focus, reachable states, plus a clean TypeScript check and production build.
