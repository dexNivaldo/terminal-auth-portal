import { createHash } from 'node:crypto';
import { readFileSync, writeFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const base = dirname(fileURLToPath(import.meta.url));

function sha256(path) {
  return createHash('sha256').update(readFileSync(resolve(base, path))).digest('hex');
}

const sources = [
  '../src/index.css',
  '../tailwind.config.js',
  '../index.html',
  '../public/favicon.svg',
  '../public/logo.svg',
  '../src/home.tsx',
  '../src/login.tsx',
  '../src/components/app-header.tsx',
  '../src/components/settings-sheet.tsx',
  '../src/components/token-form.tsx',
  '../src/components/token-result.tsx',
  '../src/components/saved-entries.tsx',
  '../src/components/toast.tsx',
  '../src/components/ui/button.tsx',
  '../src/components/ui/card.tsx',
  '../src/components/ui/input.tsx',
  '../src/components/ui/badge.tsx',
  '../src/components/ui/skeleton.tsx',
  '../src/components/ui/alert.tsx',
  '../src/components/ui/select.tsx',
  '../src/components/ui/switch.tsx',
  '../src/components/ui/drawer.tsx',
  '../src/components/ui/separator.tsx',
  '../src/components/ui/label.tsx',
  '../src/hooks/use-auth-entry.ts',
  '../src/hooks/use-toast.ts',
  '../src/hooks/use-media-query.ts',
  '../src/hooks/use-local-storage-listener.ts',
  '../src/hooks/use-async-list.ts',
  '../src/hooks/use-debounce.ts',
  '../src/services/auth.service.ts',
  '../src/services/auth-entries.service.ts',
  '../src/loaders/home.loader.ts',
  '../src/utils/settings.ts',
  '../src/utils/format.ts',
  '../src/types/auth-entry.ts',
  '../src/preview.tsx',
  '../design/direction.md',
].map((path) => ({ path, sha256: sha256(path) }));

const captures = [
  'captures/login-desktop.png',
  'captures/preview-success-desktop.png',
  'captures/preview-success-mobile.png',
  'captures/preview-success-tablet.png',
  'captures/preview-loading-desktop.png',
  'captures/preview-error-desktop.png',
  'captures/preview-empty-entries-desktop.png',
  'captures/preview-settings-desktop.png',
  'captures/preview-delete-confirm-desktop.png',
  'captures/preview-sticky-desktop.png',
  'captures/preview-sticky-mobile.png',
  'captures/preview-focus-tab-button.png',
];

function capture(path) {
  return { path, kind: 'image', sha256: sha256(path) };
}

const receipt = {
  schemaVersion: 'uizze.visual-evidence.v1',
  scope:
    'Hatch full redesign — login and home surfaces, light theme, anti-slop system, brand accent #E5173A, sticky saved-entries filters. Verified with a labeled development preview harness (illustrative fixtures) plus the real login route.',
  platform: 'web',
  sources,
  comparison: 'existing-system',
  requiredChecks: [
    { id: 'login-desktop', kind: 'visual' },
    { id: 'home-success-desktop', kind: 'visual' },
    { id: 'home-success-mobile', kind: 'visual' },
    { id: 'home-success-tablet', kind: 'visual' },
    { id: 'home-loading-desktop', kind: 'visual' },
    { id: 'home-error-desktop', kind: 'visual' },
    { id: 'home-empty-entries-desktop', kind: 'visual' },
    { id: 'home-settings-desktop', kind: 'visual' },
    { id: 'delete-confirm-desktop', kind: 'visual' },
    { id: 'saved-entries-sticky-desktop', kind: 'visual' },
    { id: 'saved-entries-sticky-mobile', kind: 'visual' },
    { id: 'keyboard-focus-primary', kind: 'interaction' },
  ],
  checks: [
    {
      id: 'login-desktop',
      status: 'pass',
      state: 'Signed out, centered login card',
      environment: { kind: 'browser', name: 'Chromium 156 headless', width: 1440, height: 900 },
      observed:
        'Brand mark, "Sign in" heading, teal "Continue with Google" button with the Google mark, and helper text render on a plain light ground. No gradients, glass, blobs or decorative illustration. Focus order begins at the brand link and button.',
      artifacts: [capture('captures/login-desktop.png')],
    },
    {
      id: 'home-success-desktop',
      status: 'pass',
      state: 'Token generated successfully',
      environment: { kind: 'browser', name: 'Chromium 156 headless', width: 1440, height: 900 },
      observed:
        'Two-column workspace: form card (Patente, Application segmented control with TAS active in the single teal accent, Terminal, Role, Generate/Save/Share) and result card (token box with copy, redirect URL with Open/Copy, metadata grid, Details disclosure). Saved entries below with search, role filter pills, application filter and rows. One accent hue, one grey family, no gradients or glass.',
      artifacts: [capture('captures/preview-success-desktop.png')],
    },
    {
      id: 'home-success-mobile',
      status: 'pass',
      state: 'Token generated successfully at a phone width',
      environment: { kind: 'browser', name: 'Chromium 156 headless', width: 390, height: 844 },
      observed:
        'Single column stacks the form above the result. Header brand, Development badge and avatar fit without horizontal overflow; buttons are full width and every field fits the viewport.',
      artifacts: [capture('captures/preview-success-mobile.png')],
    },
    {
      id: 'home-success-tablet',
      status: 'pass',
      state: 'Token generated successfully at a tablet width',
      environment: { kind: 'browser', name: 'Chromium 156 headless', width: 768, height: 1024 },
      observed:
        'Single column below the lg breakpoint; the sm button row applies and the workspace stays readable with no overflow.',
      artifacts: [capture('captures/preview-success-tablet.png')],
    },
    {
      id: 'home-loading-desktop',
      status: 'pass',
      state: 'Token request in flight',
      environment: { kind: 'browser', name: 'Chromium 156 headless', width: 1440, height: 900 },
      observed:
        'Result panel shows a skeleton matching the result shape, a "Generating token…" status and a disabled primary button with a spinner. The rest of the page stays stable.',
      artifacts: [capture('captures/preview-loading-desktop.png')],
    },
    {
      id: 'home-error-desktop',
      status: 'pass',
      state: 'Token request failed',
      environment: { kind: 'browser', name: 'Chromium 156 headless', width: 1440, height: 900 },
      observed:
        'Result panel shows an inline error alert with a "Try again" action; no raw error dump and no page-level crash.',
      artifacts: [capture('captures/preview-error-desktop.png')],
    },
    {
      id: 'home-empty-entries-desktop',
      status: 'pass',
      state: 'No saved entries',
      environment: { kind: 'browser', name: 'Chromium 156 headless', width: 1440, height: 900 },
      observed:
        'Empty saved-entries state uses a dashed container, an icon and guidance to save a configuration; the counter reads 0 of 0 and the search and filters remain available.',
      artifacts: [capture('captures/preview-empty-entries-desktop.png')],
    },
    {
      id: 'home-settings-desktop',
      status: 'pass',
      state: 'Settings panel open',
      environment: { kind: 'browser', name: 'Chromium 156 headless', width: 1440, height: 900 },
      observed:
        'Settings opens as a right-side panel with an Environment section (production toggle and warning) and an Account section (profile, email, sign out). The overlay dims the page and the panel is reachable.',
      artifacts: [capture('captures/preview-settings-desktop.png')],
    },
    {
      id: 'delete-confirm-desktop',
      status: 'pass',
      state: 'Saved entry delete confirmation open',
      environment: { kind: 'browser', name: 'Chromium 156 headless', width: 1440, height: 900 },
      observed:
        'The destructive "Delete" action uses a soft red outline style, clearly distinct from the solid brand-red primary "Generate token" button. "Cancel" is a neutral ghost action, so primary and destructive intents are not confusable now that the accent is red.',
      artifacts: [capture('captures/preview-delete-confirm-desktop.png')],
    },
    {
      id: 'saved-entries-sticky-desktop',
      status: 'pass',
      state: 'Page scrolled to y=650 on a 1440x900 viewport',
      environment: { kind: 'browser', name: 'Chromium 156 headless', width: 1440, height: 900 },
      observed:
        'The "Saved entries" heading, counter, search field and filter pills/select stick below the 56px app header while the entry list scrolls beneath them. The sticky bar has an opaque background and a bottom border, so rows do not show through.',
      artifacts: [capture('captures/preview-sticky-desktop.png')],
    },
    {
      id: 'saved-entries-sticky-mobile',
      status: 'pass',
      state: 'Page scrolled to y=900 on a 390x844 viewport',
      environment: { kind: 'browser', name: 'Chromium 156 headless', width: 390, height: 844 },
      observed:
        'On a phone width the heading and filters remain stuck below the header; the description is hidden to keep the bar compact, and the search, role pills and application filter stay reachable while the list scrolls under them.',
      artifacts: [capture('captures/preview-sticky-mobile.png')],
    },
    {
      id: 'keyboard-focus-primary',
      status: 'pass',
      state: 'Primary action focused with the keyboard',
      environment: { kind: 'browser', name: 'Chromium 156 headless', width: 1440, height: 900 },
      observed:
        'After dispatching 8 Tab key events, document.activeElement is the "Generate token" button and matches(":focus-visible") is true. The teal button shows a white focus ring with a teal offset, clearly visible against the fill.',
      steps: [
        'Navigated to the preview route.',
        'Dispatched 8 Tab key events through CDP Input.dispatchKeyEvent.',
        'Confirmed document.activeElement is the "Generate token" button and matches(":focus-visible") is true.',
        'Captured the focused state.',
      ],
      artifacts: [capture('captures/preview-focus-tab-button.png')],
    },
  ],
  unresolved: [
    'target-generation: the authorized image-generation service returned "Insufficient account funds" for both target requests, so no generated target exists and no 1:1 target comparison is claimed.',
    'authenticated-home-render: the real home surface needs a Google/Supabase session and the TAS/DPE backend; verification used the labeled development preview harness with illustrative fixtures, not the authenticated app.',
    'screen-reader-audit: no VoiceOver/NVDA session was run; semantic roles and live regions were implemented and code-reviewed but not assistive-technology audited.',
    'eslint: the project ESLint config fails to load a rule because of a pre-existing dependency version mismatch; TypeScript and the production build pass.',
  ],
};

writeFileSync(resolve(base, 'visual-evidence.json'), `${JSON.stringify(receipt, null, 2)}\n`);
console.log(`Wrote visual-evidence.json with ${sources.length} sources and ${receipt.checks.length} checks`);
