# XPS

XPS is a React + Vite finance workspace backed by Supabase authentication. It includes a public auth surface, a signed-in multi-page application shell, and an initial PostgreSQL schema for budgets, transactions, categories, accounts, and savings goals.

The product UI is intentionally ahead of the live data wiring: authentication is real, while the workspace content is currently driven by structured placeholder data.

## Features

- Email/password authentication with Supabase
- Signed-in workspace with `Dashboard`, `Transactions`, `Goals`, and `Insights` views
- Local design system with bundled typography and responsive finance-oriented UI
- Starter Supabase migration with row-level security and per-user ownership
- CI workflow that runs lint and production build on pushes and pull requests

## Tech Stack

- React 19
- Vite
- Supabase JS client
- ESLint
- GitHub Actions

## Getting Started

### 1. Install dependencies

```bash
npm install
```

### 2. Add environment variables

Copy the example file and provide your Supabase credentials:

```bash
cp .env.example .env
```

```bash
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### 3. Start the app

```bash
npm run dev
```

### 4. Apply database migrations

If you are using the Supabase CLI locally:

```bash
npm run dbpush
```

### Scripts

```bash
npm run build
npm run lint
npm run preview
npm run dbpush
npm run dbpull
```

## Supabase Setup

The client in [`src/lib/supabase.js`](src/lib/supabase.js) reads `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` from `import.meta.env`. If either value is missing, the app throws immediately instead of booting with a broken auth client.

Make sure the Supabase project has email/password auth enabled. The UI uses:

- `signInWithPassword`
- `signUp`
- `signOut`
- session restoration through `getSession`
- auth state updates through `onAuthStateChange`

If email confirmations are enabled in Supabase, new users will need to confirm their account before signing in.

## Database Schema

The initial database schema lives in [`supabase/migrations/202603190001_initial_finance_schema.sql`](supabase/migrations/202603190001_initial_finance_schema.sql).

It creates:

- `profiles`
- `financial_accounts`
- `categories`
- `budget_periods`
- `budget_allocations`
- `transactions`
- `savings_goals`

The migration also includes:

- `updated_at` trigger plumbing
- row-level security on all app tables
- user-scoped access policies
- automatic profile creation when a new `auth.users` row is inserted

## Project Structure

- [`src/App.jsx`](src/App.jsx) contains the auth flow, workspace shell, and page composition.
- [`src/data/appData.js`](src/data/appData.js) holds the structured placeholder content that drives the current UI.
- [`src/App.css`](src/App.css) contains the application layout and component styling.
- [`src/index.css`](src/index.css) defines the global theme, typography, and background treatment.
- [`src/lib/supabase.js`](src/lib/supabase.js) creates the shared Supabase client.
- [`supabase/migrations`](supabase/migrations) stores database migrations for the Supabase project.
- [`.github/workflows/ci.yml`](.github/workflows/ci.yml) runs lint and build in CI.

## Next Steps

The next meaningful step is replacing placeholder workspace data with real Supabase queries and mutations. After that, the highest-value additions are:

- account and transaction syncing
- editable budget periods and allocations
- recurring bills and scheduled cash flow
- goal contribution actions
- month-over-month reporting and forecasting

## Notes

This repository started from a Vite React template, but it now functions as a finance-oriented authenticated workspace starter with a matching Supabase schema and CI baseline.
