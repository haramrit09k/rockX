# Portal Search Desk design QA

## Evidence

- Source visual truth: `docs/design/design-reference.png`
- Browser-rendered implementation: `docs/design/design-implementation.png`
- Side-by-side comparison: `docs/design/design-comparison.png`
- Responsive captures: `docs/design/design-mobile.png`, `docs/design/design-mobile-character.png`
- Desktop viewport: 1440 x 1024 CSS px at device scale factor 1
- Source pixels: 1487 x 1058, normalized with contain scaling and centered padding to 1440 x 1024
- Implementation pixels: 1440 x 1024
- Comparison pixels: 2880 x 1024, source on the left and implementation on the right
- State: default character results, dark theme, first result page loaded from the public API

## Full-view comparison evidence

The final implementation preserves the reference's dark full-width surface, acid-green accent, compact branded header, search-first hierarchy, three-column character matrix, portrait-led rows, lightweight dividers, and high-density desktop composition. The live version intentionally uses real API results and API pagination rather than the mock's curated result set.

At original resolution the header, search controls, result metadata, portrait crops, status tokens, row dividers, and primary typography are readable in the combined artifact, so a separate cropped comparison was not required. The mobile captures separately verify the layout behavior that the desktop source does not specify.

## Required fidelity surfaces

- Fonts and typography: passed. A system sans-serif stack reproduces the reference's compact product typography, with bold display hierarchy, readable 12–16 px supporting text, controlled line height, and no clipped labels.
- Spacing and layout rhythm: passed. Header, hero, filter row, result metadata, 176 px portraits, 220 px rows, and divider rhythm now match the reference proportions closely.
- Colors and visual tokens: passed. Near-black and charcoal surfaces, acid-green focus/action tokens, muted gray secondary text, and semantic alive/dead indicators remain legible and consistent.
- Image quality and asset fidelity: passed. All character imagery is sourced directly from the API at native square proportions. The generated portal mark is a real raster asset; no CSS drawings, inline SVG substitutes, placeholder avatars, or fake show imagery are used.
- Copy and content: passed. Product copy explains the user job, data-driven labels remain accurate, and the unofficial-project disclaimer is visible.
- Icons and controls: passed for the implemented scope. Core actions use clear text controls with keyboard-visible focus states rather than approximate icon drawings.
- Accessibility and responsiveness: passed. Semantic navigation, labeled form fields, alt text, focus-visible treatment, live loading/error regions, and usable 390 x 844 layouts were verified.

## Interaction evidence

- Searched for `Birdperson` and received three GraphQL results.
- Applied the `Alien` species filter and received two GraphQL results.
- Opened character 47 and verified its seven nested episode appearances.
- Opened episode 11 and verified its 30-character cast.
- Saved a character and episode, then verified both in My portal.
- Used Surprise me and navigated to a valid random episode route with a live cast.
- Verified the home screen in a fresh browser tab; no warnings or errors were logged.

## Comparison history

### Pass 1

- P2: Result rows used 132 px portraits and 176 px row heights, making the implementation substantially denser than the source.
- P2: The home hero sat too low because an extra eyebrow competed with the selected reference hierarchy.
- P2: Mobile navigation labels wrapped awkwardly.
- P2: The character portrait inherited an explicit HTML height on mobile and rendered taller than its square source.

Fixes applied: portraits increased to 176 px, rows increased to 220 px, the extra eyebrow was removed, hero spacing was tightened, mobile header spacing/type was adjusted, and character images now use automatic height with a square aspect ratio.

### Pass 2

Post-fix evidence in `docs/design/design-comparison.png`, `docs/design/design-mobile.png`, and `docs/design/design-mobile-character.png` shows no remaining actionable P0, P1, or P2 differences.

## Follow-up polish

- P3: The mock shows per-character episode counts in the search grid. The live grid uses “Open appearance trail” because requesting every nested episode list on every search result quickly consumes the public endpoint's rate-limit budget; the complete data appears on the character page.
- P3: The mock includes a global sort control. The live app preserves authoritative API ordering and pagination rather than presenting a misleading current-page-only sort.

final result: passed
