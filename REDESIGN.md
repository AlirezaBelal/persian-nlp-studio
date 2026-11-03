# v0.3 interface redesign

The product is a workspace for reading Persian text more clearly. The redesign replaces the former dark marketing page with a light paper/forest-green system and a consistent two-page application shell. No image service, remote font, framework or runtime dependency is needed.

## Layout and interaction decisions

- Persistent right navigation on desktop; always-visible two-destination navigation on mobile. The product needs no hidden mobile menu.
- Compact introduction and direct workspace access. Text entry is the primary action; results update locally as the user types.
- Input, aggregate metrics, word frequencies and normalized output have distinct surfaces. Mobile shows the aggregate result before the secondary normalized preview.
- Explicit normalized-text copying has success/error feedback. JSON export remains the existing numeric aggregate allowlist and never contains the copied text.
- Five independent specialist workspaces replace a long wall of five forms. Real fragment links support bookmarks and back/forward; current location is announced with aria-current and selection moves focus to the workspace heading. A no-JavaScript fallback leaves all sections readable.
- Tool inputs remain in DOM memory when switching. Every tool has its own clear action; there is no saved workspace, hidden persistence or account.
- Local file selection is Persian-labeled with visible format/size guidance. New manual edits or samples cancel stale import completion so they cannot be overwritten by an older pending file.
- Empty states distinguish missing text, missing search phrase and no match. Accuracy notes are near the relevant tool; broader method/privacy details are available in a disclosure.

## Design system

`styles.css` owns color, spacing, type, surfaces, controls, application navigation, analysis and comparison. `tools.css` contains only specialist layout. Warm neutral canvas, white panels, restrained sage, forest-green actions and a muted amber caution surface distinguish hierarchy without decorative fake data. Tahoma/Segoe UI fallback fonts are local. Forms use 16px text, interface labels are readable, controls have 44px minimum targets, focus is visible and motion preferences are respected.

## Acceptance and limitations

Use `npm run check`, `npm test` and the pinned Chromium/axe suite documented in MAINTENANCE.md. Exercise both pages and all five specialist tools, real keyboard use, fragment/back-forward navigation, numeric-only download, explicit clipboard action, stale-import protection, and 320/375/414/768/1024/1440px. Axe checks WCAG A/AA tags with no disabled rules; it does not establish complete accessibility certification. Desktop and mobile screenshots are visually reviewed during implementation.

The Pages asset list is unchanged: the two HTML documents, two stylesheets, favicon and five local browser modules. Tests, installer, external skills and Node preview server are never served by Pages. The Node preview mirrors this allowlist. No research model is marketed as shipped; existing lexical/data provenance limits remain in FEATURE_SCOPE.md.
