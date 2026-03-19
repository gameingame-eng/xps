# XPS

XPS is a small React + Vite app built around Supabase auth. The current UI has two states:

- A public sign-in/sign-up screen with email/password authentication.
- A signed-in overview that shows a lightweight budget dashboard shell with placeholder metrics and recent activity.

The app is intentionally shaped like a finance product, but the data model and dashboard features are still mostly placeholders. Authentication is real and backed by Supabase.

## Tech Stack

- React 19
- Vite
- Supabase JS client
- ESLint

## Getting Started

The commands below work the same on Linux, macOS, and Windows. On Windows, run them in PowerShell, Windows Terminal, or another shell that supports Node.js commands.

### 1. Install Dependencies

```bash
npm install
```

### 2. Add Environment Variables

Create a local environment file named `.env` in the project root and provide your Supabase credentials:

```bash
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### 3. Start the App

```bash
npm run dev
```

### Optional Scripts

```bash
npm run build
npm run lint
npm run preview
```

### Platform Notes

- Linux: use your distribution's terminal and make sure Node.js is installed.
- macOS: use Terminal or iTerm2 with Node.js installed.
- Windows: use PowerShell or Windows Terminal. If you prefer, Git Bash also works.

## Supabase Setup

The client in [`src/lib/supabase.js`](/workspaces/XPS/src/lib/supabase.js) reads `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` from `import.meta.env`. If either value is missing, the app throws immediately instead of booting with a broken auth client.

Make sure the Supabase project has email/password auth enabled. The UI uses:

- `signInWithPassword`
- `signUp`
- `signOut`
- session restoration through `getSession`
- auth state updates through `onAuthStateChange`

If email confirmations are enabled in Supabase, new users will need to confirm their account before signing in.

## Project Structure

- [`src/App.jsx`](/workspaces/XPS/src/App.jsx) contains the auth flow and the two UI states.
- [`src/App.css`](/workspaces/XPS/src/App.css) holds the page-specific layout and component styling.
- [`src/index.css`](/workspaces/XPS/src/index.css) defines the global theme, typography, and background treatment.
- [`src/lib/supabase.js`](/workspaces/XPS/src/lib/supabase.js) creates the shared Supabase client.
- [`src/main.jsx`](/workspaces/XPS/src/main.jsx) mounts the React app.

## Next Steps

The obvious follow-on work is to replace the placeholder dashboard values with real budget data, then add:

- transactions and categories
- recurring bills
- savings goals or envelopes
- month-over-month spending views
- a persisted user profile layer

## Notes

This repository was started from a Vite React template, but the app has moved beyond the minimal starter and now focuses on a finance-oriented authenticated shell.
