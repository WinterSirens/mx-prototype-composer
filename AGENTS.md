# AGENTS.md

Guidance for AI coding agents working in this repo.

## What this is

**MX Composer** — a demo/portfolio prototype (originally scaffolded in Google AI Studio) of a
tool that lets a Solutions Architect build a working financial-app prototype from a chat
conversation. It is a single-page React app: no backend, no tests, no router.

The whole product is a linear, hard-coded walkthrough of screens 1 → 6, with a live "prototype
preview" whose appearance is driven by Gemini function calls.

## Commands

```bash
npm install
npm run dev      # vite dev server on :3000, host 0.0.0.0
npm run build    # vite build -> dist/
npm run preview
npm run lint     # tsc --noEmit  (the ONLY check that exists — run before finishing)
npm run clean    # rm -rf dist
```

There is no test suite and no linter/formatter config. `npm run lint` is type-checking only.

## Layout

```
index.html            entry, loads /src/main.tsx
src/main.tsx          React root
src/App.tsx           screen state machine (ScreenId '1'..'6','6a') + workspace/documentation tab
src/UIContext.tsx     UIProvider / useUI() — ALL prototype-preview state lives here
src/lib/gemini.ts     Gemini client + the updateUI function-calling schema
src/components/
  Screen1..Screen6    the walkthrough steps (Screen6 is the big one, ~900 lines)
  Documentation.tsx   docs tab
  Sidebar / RightPanel / PhoneFrame / WebFrame   chrome around the preview
src/index.css         Tailwind v4 + @theme design tokens
```

## Conventions

- **React 19 + TypeScript + Vite 6 + Tailwind v4.** Tailwind is configured via the Vite plugin and
  `@theme` in `src/index.css` — there is **no `tailwind.config.js`**. Add design tokens as CSS vars
  in the `@theme` block (`--color-composer-dark`, `--color-cascade-primary`, …) and use them as
  utility classes (`bg-composer-light`, `text-cascade-primary`).
- **Styling is Tailwind classes only.** No CSS modules, no styled-components.
- Components are default-export function components, props typed inline.
- Path alias `@/*` → repo root (`vite.config.ts` + `tsconfig.json`). Most code uses relative imports.
- Navigation is prop drilling (`onNext`, `onNavigate`, `onTabChange`) — do not add a router.
- Preview state (`showBalanceCard`, `themeColor`, `prototypeTemplate`, …) goes through `useUI()`.
  If you add a knob the AI can change, it must be added in **three** places:
  `UIContext.tsx`, the `updateUIFunctionDeclaration` schema in `src/lib/gemini.ts`, and wherever
  `refineUI` results are applied.

## Anthropic integration

- Model: `claude-3-7-sonnet-20250219` (configurable via `ANTHROPIC_MODEL`) via `@anthropic-ai/sdk`.
- `getAnthropic()` is lazily initialized from `process.env.ANTHROPIC_API_KEY`, which Vite inlines at build
  time via `define` in `vite.config.ts`. Note `dangerouslyAllowBrowser: true` is enabled for client-side API calls.
- Three entry points in `src/lib/anthropic.ts`: `generateChatResponse` (vision chat), `buildUIConfiguration` (chat →
  initial UI config), `refineUI` (natural-language tweak → `updateUI` tool call).

## Environment

Copy `.env.example` to `.env.local` and set `ANTHROPIC_API_KEY`.
Never commit real keys.

## Gotchas

- `vite.config.ts` disables HMR when `DISABLE_HMR=true` (AI Studio sets this to stop flicker during
  agent edits). Leave that logic alone.
- `express`, `dotenv` and `tsx` are in `dependencies` but nothing uses them — there is no server.
  Don't build on them assuming a backend exists.
- `Screen6.tsx` is very large; read the relevant section rather than the whole file, and prefer
  targeted edits over rewrites.
- Keep changes minimal and in the existing style. This is a portfolio demo, not a platform —
  avoid introducing dependencies, abstraction layers, or infrastructure it doesn't need.
