# MX Composer

**A prototype of a tool that turns a sales conversation into a working, branded financial-app prototype.**

Live demo: https://mx-prototype-composer.vercel.app

> **This is a portfolio prototype, not a real product.** It is not an official MX product, is not
> affiliated with or endorsed by MX, and does not connect to real accounts, real member data, or
> the real MX API. All data shown is hard-coded sample data.
>
> Designed, scoped, and built end to end by **Mitchell Dyer**, working with AI coding agents.

---

## The problem

When a financial institution evaluates a platform like MX, the gap between "here's a slide deck"
and "here's what your app would actually look like" is measured in weeks of Solutions Architect
time. Discovery calls, requirements docs, a designer, a scoping meeting — all before the prospect
can see anything concrete.

## The idea

Compress that to minutes. A Solutions Architect (or the prospect themselves) describes what they
want members to be able to do, drops in a logo and two brand colors, and the tool assembles a
clickable, branded prototype wired to a plausible set of MX capabilities — with a Journey Map that
names the specific API behind each feature, so the conversation moves straight to scoping.

## The walkthrough

The demo is a linear six-screen story:

| Screen | What happens |
| --- | --- |
| 1 | Landing / premise |
| 2 | Brand intake — institution name, logo upload, primary + accent colors |
| 3 | Strategy picker — strategic need → use cases → outcomes |
| 4 | Vision chat — describe the member experience in plain language |
| 5 | Assembly — the prototype is generated |
| 6 | Live preview — a branded mobile/web app you can click through and refine in chat |

On screen 6, plain-language requests ("make it blue", "drop the transactions list") are sent to
Claude, which responds with an `updateUI` tool call that mutates the preview live.

## Product decisions worth calling out

- **The Journey Map names real MX APIs.** A prototype that looks good but implies capabilities that
  don't exist is worse than no prototype — it creates scoping debt. Every generated feature is
  labeled with the actual API that would back it (MX Connect, Insights, Goals), and the panel has a
  "Known Gaps & Assumptions" section rather than pretending the mapping is complete.
- **Brand intake is three fields.** Name, logo, two colors. Anything more and it becomes a design
  tool, which is a different product with a different buyer.
- **The AI edits a constrained schema, not raw markup.** Refinements are function calls against a
  fixed set of knobs, so the preview can't be talked into an incoherent state during a live demo.

## Running it locally

**Prerequisites:** Node.js 18+

```bash
npm install
cp .env.example .env.local   # then set ANTHROPIC_API_KEY
npm run dev                  # http://localhost:3000
```

The app calls the Anthropic API directly from the browser (`dangerouslyAllowBrowser`), which is
fine for a demo but is **not** how you would ship this — a real version needs a server-side proxy so
the key is never in the bundle.

### Environment

| Variable | Required | Default |
| --- | --- | --- |
| `ANTHROPIC_API_KEY` | yes | — |
| `ANTHROPIC_MODEL` | no | `claude-3-7-sonnet-20250219` |
| `APP_URL` | no | `http://localhost:3000` |

Vite inlines these at build time via `define` in `vite.config.ts`. Without a key the UI still runs;
the chat and refinement calls just fail.

### Scripts

```bash
npm run dev      # vite dev server on :3000
npm run build    # production build -> dist/
npm run preview  # serve the build
npm run lint     # tsc --noEmit (type-check only)
npm run clean    # rm -rf dist
```

## Stack

React 19 · TypeScript · Vite 6 · Tailwind v4 · Motion · lucide-react · Anthropic SDK

Single-page app, no backend, no router, no test suite. Responsive down to ~390px.

```
src/
  App.tsx          screen state machine ('1'..'6','6a') + workspace/docs tab
  UIContext.tsx    all prototype-preview state
  lib/anthropic.ts generateChatResponse · buildUIConfiguration · refineUI
  components/      Screen1..Screen6, Documentation, Sidebar, RightPanel,
                   PhoneFrame, WebFrame
```

Tailwind is configured through the Vite plugin and an `@theme` block in `src/index.css` — there is
no `tailwind.config.js`.

## Honest limitations

- The six-screen path is hard-coded; the sidebar's Templates / Variables / Assets / Logs / Support
  items are non-functional set dressing.
- Screens 3–5 use scripted content. Only the screen-6 refinement chat is genuinely model-driven.
- No persistence, no auth, no export. Reloading resets everything.
- `express`, `dotenv`, and `tsx` are in `dependencies` but unused — leftovers from the scaffold.
