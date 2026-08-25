# Learner Dashboard

A React + TypeScript dashboard where learners can track course progress and take a quick knowledge-check quiz. Built with Vite, styled with Tailwind CSS, documented with Storybook, and tested with Vitest + React Testing Library.

The app renders two main areas:
- **Progress badges** — a list of course progress indicators (`LearnerProgressBadge`) with `default`, `in-progress`, `completed`, and `disabled` states.
- **Quiz** — a multi-question, keyboard-accessible quiz (`Quiz`) with a loading skeleton (`QuizSkeleton`) and a retry/error state (`QuizLoadError`) for slow or failed loads.

Quiz questions currently come from a static, bundled data set (`src/data/quizData.ts`) loaded through a mocked async fetch — there is no live backend yet (see [Development Notes](#development-notes)).

## Prerequisites

- **Node.js**: `^18.0.0` or `>=20.0.0` (required by Vite 5 — this repo has no `.nvmrc`, so use `nvm use 20` or similar if you manage multiple Node versions).
- **npm** (comes with Node). The project uses `package-lock.json`, so `npm install` is recommended over `yarn`/`pnpm` to keep the lockfile consistent.

## Getting Started

### 1. Clone the repository

```bash
git clone <repository-url>
cd learner-dashboard
```

### 2. Install dependencies

```bash
npm install
```

### 3. Set up environment variables

```bash
cp .env.example .env
```

The project currently has **no required environment variables** — see `.env.example` for details and for guidance on adding variables in the future (Vite requires a `VITE_` prefix for any variable exposed to client code).

### 4. Run the app locally

```bash
npm run dev
```

This starts the Vite dev server (with hot module reload). The terminal output will show the local URL (default `http://localhost:5173`).

## Available Scripts

All scripts are defined in `package.json` and run via `npm run <script>`:

| Script | Command | Description |
|---|---|---|
| `dev` | `vite` | Starts the local development server with HMR. |
| `build` | `tsc && vite build` | Type-checks the project, then builds the production bundle into `dist/`. |
| `preview` | `vite preview` | Serves the built `dist/` folder locally to sanity-check a production build. |
| `test` | `vitest run` | Runs the full test suite once (CI-style, no watch mode). |
| `test:watch` | `vitest` | Runs tests in interactive watch mode. |
| `test:coverage` | `vitest run --coverage` | Runs tests once and generates a coverage report (V8 provider; text + HTML reporters). |
| `storybook` | `storybook dev -p 6006` | Starts Storybook locally at `http://localhost:6006` for isolated component development. |
| `build-storybook` | `storybook build` | Builds a static, deployable Storybook site. |
| `lint` | `eslint . --ext .ts,.tsx --fix` | Lints `.ts`/`.tsx` files and auto-fixes what it can. |
| `lint:check` | `eslint . --ext .ts,.tsx` | Lints without auto-fixing (useful for CI). |
| `type-check` | `tsc --noEmit` | Runs the TypeScript compiler in check-only mode (no output files). |
| `format` | `prettier --write .` | Formats the codebase with Prettier. |
| `format:check` | `prettier --check .` | Checks formatting without writing changes (useful for CI). |

## Running Tests

```bash
npm test          # run once
npm run test:watch     # watch mode while developing
npm run test:coverage  # with coverage report (output in coverage/)
```

Tests use **Vitest** with a `jsdom` environment and **React Testing Library**. Setup (e.g. `@testing-library/jest-dom` matchers) lives in `src/setupTests.ts` and is loaded automatically via `vitest.config.ts`. Coverage excludes `src/main.tsx`, `*.stories.tsx` files, and `.storybook/**`.

Test files live alongside the code they cover, under `__tests__/` directories (e.g. `src/components/Quiz/__tests__/Quiz.test.tsx`).

## Production Build

```bash
npm run build     # type-check + build to dist/
npm run preview   # serve the dist/ build locally
```

`npm run build` runs `tsc` first — the build will fail on type errors, not just bundling errors. Output goes to `dist/` (already listed in `.gitignore`, along with `build/` and `node_modules/`).

## Project Structure

```
.
├── src/
│   ├── components/
│   │   ├── LearnerProgressBadge/   # Progress badge component + Storybook story + tests
│   │   ├── Quiz/                   # Quiz component, QuizLoadError, tests
│   │   ├── Skeleton/                # QuizSkeleton loading state + tests
│   │   └── index.ts                 # Barrel export for all components
│   ├── data/
│   │   └── quizData.ts             # Static/bundled quiz question set
│   ├── hooks/
│   │   └── useQuizQuestions.ts     # Async loading hook (loading/success/error + timeout + retry)
│   ├── tokens/
│   │   └── designTokens.ts         # Design system tokens (colors, typography, radius)
│   ├── types/
│   │   └── index.ts                # Shared TypeScript types
│   ├── App.tsx                     # Top-level layout: progress badges + quiz
│   ├── main.tsx                    # React entry point
│   ├── index.css                   # Tailwind entry point / global styles
│   └── setupTests.ts               # Vitest/RTL global test setup
├── .storybook/                     # Storybook configuration (main.ts, preview.ts)
├── public/                         # Static assets served as-is
├── index.html                      # Vite HTML entry point
├── vite.config.ts                  # Vite build/dev config
├── vitest.config.ts                # Vitest config (separate from vite.config.ts)
├── tailwind.config.js              # Tailwind theme (brand colors, content paths)
├── postcss.config.js               # PostCSS plugins (tailwindcss, autoprefixer)
├── tsconfig.json / tsconfig.node.json
├── .eslintrc.cjs                   # ESLint rules
├── .env.example                    # Environment variable template (currently none required)
└── package.json
```

## Development Notes

- **No live backend yet.** `fetchQuizQuestions()` in `src/App.tsx` is a stand-in that resolves the bundled `quizQuestions` array after a simulated delay. A code comment marks where to swap in a real `fetch(...)` call once a questions endpoint exists — at that point, an API base URL would be added as a `VITE_`-prefixed variable in `.env.example`.
- **Request timeout + retry.** `useQuizQuestions` races the fetch against a 10-second timeout (`REQUEST_TIMEOUT_MS`) so a hung request doesn't leave the learner on an infinite loading skeleton; the `QuizLoadError` component then offers a retry.
- **Dev-only logging.** Quiz results are only logged to the console when `import.meta.env.DEV` is true (Vite's built-in flag) — nothing is logged in production builds, and only aggregate counts are logged, never answer content or learner identifiers.
- **Accessibility is a first-class concern** throughout the components: live regions (`aria-live`) announce quiz status and question changes, the quiz options use a `radiogroup`/roving-tabindex pattern with arrow-key navigation, and color tokens were adjusted in `LearnerProgressBadge` to meet contrast requirements (see inline comments in `LearnerProgressBadge.tsx` and `designTokens.ts`).
- **Skeleton layout parity.** `QuizSkeleton` is deliberately built to match the real `Quiz` component's layout dimensions so there's no layout shift when real content loads in.

## Troubleshooting

- **`Cannot find module @rollup/rollup-linux-x64-gnu` (or a similar platform-specific `@rollup/rollup-*` / esbuild binary) when running `npm test`, `npm run build`, or `npm run dev`.**
  This is a known npm bug with optional dependency resolution ([npm/cli#4828](https://github.com/npm/cli/issues/4828)), commonly hit on Linux CI images and containers. Fix:
  ```bash
  rm -rf node_modules package-lock.json
  npm install
  ```
- **Wrong Node version.** Vite 5 requires Node `^18.0.0` or `>=20.0.0`. If `npm install` or `npm run dev` fails with obscure syntax/engine errors, check `node -v` first.
- **Type errors block the build but not `dev`.** `npm run dev` does not type-check on start, but `npm run build` runs `tsc` first and will fail the build on type errors. Run `npm run type-check` on its own if you want fast feedback without a full build.
- **Lint currently passes with warnings only** (`no-console` in `App.tsx`'s dev-only log, and `no-explicit-any` in some test mocks) — these are pre-existing and non-blocking; `npm run lint:check` exits `0` despite them.