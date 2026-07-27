# Imperium Italian Textile

Premium Italian fabrics delivered to the Gulf's most discerning tailors, designers, and hospitality groups. This is the brand website: a Next.js application with a full-screen fabric hero, motion-rich sections, and a contact flow backed by Resend.

## Tech stack

- **Framework:** [Next.js 15](https://nextjs.org/) (App Router) + React 19 + TypeScript
- **Animation:** [Framer Motion](https://www.framer.com/motion/)
- **Styling:** CSS Modules with design tokens in `src/app/globals.css`
- **Email:** [Resend](https://resend.com/) (Server Action + API route)
- **Testing:** [Vitest](https://vitest.dev/) (unit) + [Playwright](https://playwright.dev/) (e2e)
- **Quality:** ESLint 9 (flat config) + Prettier + Commitlint + Husky + lint-staged

## Requirements

- Node.js `>=20.11.0` (see `engines` in `package.json`)
- npm `>=10.8.1`

## Getting started

```bash
npm install            # install dependencies
cp .env.example .env.local   # provide RESEND_API_KEY, RESEND_FROM, RESEND_TO
npm run dev            # start the dev server at http://localhost:3000
```

Without `RESEND_API_KEY` the contact form runs in a local mock-success mode.

## Scripts

| Command              | Description                       |
| -------------------- | --------------------------------- |
| `npm run dev`        | Start the Next.js dev server      |
| `npm run build`      | Production build                  |
| `npm run start`      | Serve the production build        |
| `npm run lint`       | Lint with ESLint                  |
| `npm run lint:fix`   | Lint and auto-fix                 |
| `npm run typecheck`  | Type-check with `tsc --noEmit`    |
| `npm run format`     | Format with Prettier              |
| `npm run test`       | Run unit tests (Vitest)           |
| `npm run test:watch` | Run unit tests in watch mode      |
| `npm run test:e2e`   | Run end-to-end tests (Playwright) |

## Project structure

```
src/
  app/            Routes, layouts, API/Server Actions, metadata
  components/
    layout/      Navigation, Footer, Section primitives
    motion/      Reusable animation components
    sections/    Homepage narrative sections (Hero, Collections, …)
    ui/          Buttons, cards, and other primitives
  data/          Typed content modules (no CMS)
  hooks/         Custom React hooks
  lib/           Utilities, env, email, metadata
  types/         Shared TypeScript types
public/          Static assets (images, self-hosted WOFF2 fonts)
scripts/         Developer helper scripts (font subsetting)
tests/           unit/ and e2e/ tests mirroring src/
docs/            Long-form documentation (e.g. TECHNICAL_ARCHITECTURE.md)
```

## Documentation

- Architecture, conventions, and fallback behavior: [`docs/TECHNICAL_ARCHITECTURE.md`](docs/TECHNICAL_ARCHITECTURE.md)
- Agent/developer instructions: [`AGENTS.md`](AGENTS.md)

## License

UNLICENSED — private project. All rights reserved.
