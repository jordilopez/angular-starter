# AI Agent Context — Angular Starter

## Project overview

An Angular 19 starter project with TypeScript, the Angular application
builder, Storybook, headless components styled by the shared css-starter
design system, Vitest, and pre-commit hooks (ESLint + Prettier + Gitleaks).

## Tech stack

| Layer      | Choice                                                                                      |
| ---------- | ------------------------------------------------------------------------------------------- |
| Framework  | Angular 19 (standalone components, Zone.js bootstrap)                                       |
| Language   | TypeScript (strict mode)                                                                    |
| Build      | `@angular-devkit/build-angular:application` (ESBuild-based application builder)             |
| Testing    | Vitest + `@analogjs/vitest-angular` (unit), Playwright (browser)                            |
| Storybook  | v10 + addon-a11y + addon-docs + addon-vitest                                                |
| Styling    | [css-starter](../css-starter) (tokens + native element styles); colocated `*.component.css` |
| Components | Headless primitives — no local styles, native semantics                                     |
| Linting    | ESLint (flat config, `@angular-eslint`) + Prettier                                          |
| Secrets    | Gitleaks (pre-commit hook)                                                                  |
| Git hooks  | Husky + lint-staged                                                                         |
| Node       | v24 (`.nvmrc`)                                                                              |

## Project structure

```
src/
├── main.ts
├── test-setup.ts             # Vitest zone.js TestBed setup
├── styles/
│   └── index.css             # Imports css-starter (tokens, reset, base styles)
└── app/
    ├── app.config.ts
    ├── app.component.{ts,html,css,spec.ts}
    └── components/
        ├── Button/
        │   ├── Button.component.ts      # Headless component (no CSS file)
        │   ├── Button.component.html
        │   ├── Button.spec.ts           # Unit test
        │   └── Button.stories.ts        # Storybook story
        ├── Accordion/
        │   ├── Accordion.component.ts   # Types + logic (colocated)
        │   ├── Accordion.component.html
        │   ├── Accordion.component.css  # Local styles (flat selectors)
        │   ├── Accordion.spec.ts
        │   └── Accordion.stories.ts
        └── Page/
            ├── Page.component.ts
            ├── Page.component.html
            ├── Page.component.css
            ├── Page.spec.ts
            └── Page.stories.ts
```

## Conventions

### Naming

| Prefix | Use                           | Examples    |
| ------ | ----------------------------- | ----------- |
| `c-`   | Class hook on UI primitives   | `.c-button` |
| `l-`   | Class hook on layout wrappers | `.l-page`   |

**Folder and file names** are descriptive `PascalCase` with a `.component`
suffix: `Button/Button.component.ts`, `Page/Page.component.ts`. The `c-`/`l-`
prefixes appear as **element selectors** and CSS **class hooks**, not file names.

### Angular components

- Standalone components — no `NgModule`
- Inputs/outputs declared with signal-based `input()` / `output()` API
- Templates use the new control-flow blocks: `@if` / `@for`
- Native semantics win: `disabled`, `aria-*`, `type` — no custom `data-*`
  state attributes on primitives

### Headless styling

UI primitives (e.g. `CButton`) carry **no local CSS**. They render the
native element with a `c-` class hook and css-starter does the styling:

```html
<button type="button" class="c-button" [disabled]="disabled()" (click)="onClick()">
  <ng-content></ng-content>
  @if (label(); as labelText) { {{ labelText }} }
</button>
```

- Visuals come from css-starter's native element selectors (`:where(button)`)
  and tokens (`--btn-*`, `--c-*`, …)
- Components with bespoke behavior keep a colocated `*.component.css`
  (emulated ViewEncapsulation, flat selectors) and component-specific state
  attributes (e.g. `data-open` on `Accordion` panels)

### Testing

- Unit tests colocated: `ComponentName/*.spec.ts`
- Use Angular `TestBed` + explicit Vitest imports (specs import from `vitest`
  explicitly even though the vitest config sets `globals: true` for the
  Analog snapshot serializer)
- Call `detectChanges()` after every mutation
- Check class hooks with `querySelector('.c-button')`
- Check native attributes with `querySelector('button').disabled`

### Scripts

```bash
npm run dev              # ng serve (port 5173)
npm run build            # Production build
npm test                 # Run unit tests (Vitest)
npm run test:watch       # Watch mode
npm run coverage         # With coverage report
npm run format           # Prettier all source
npm run lint             # ESLint check
npm run storybook        # Storybook dev (port 6006, via Angular builder)
```

### Pre-commit hooks

1. `prettier --write` on staged `.ts/.html/.css/.json/.md`
2. `eslint --fix` on staged `.ts/.html`
3. `gitleaks protect --staged` on all staged files

## Vitest / PostCSS configs

- `vitest.config.ts` — single `unit` project (jsdom) via `@analogjs/vitest-angular`
- `postcss.config.mjs` — `postcss-custom-media` (`@custom-media` breakpoints)
- `playwright.config.ts` — Chromium, `ng serve` on 5173

## css-starter pin

Consumers install `css-starter` from GitHub:
`"css-starter": "github:jordilopez/css-starter#cb17ba5"`.

**Note:** currently pinned to the commit `cb17ba5` (dark-mode refactor to
`@media prefers-color-scheme`). The published `v0.1.0` tag ships the older
`data-theme` mode, which never activates. Switch to `#v0.2.0` once that tag
is published. Brand overrides live in `src/styles/index.css` (ember red
`#e35d5b`).
