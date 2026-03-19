# Contributing to XPS

Thanks for helping improve XPS. The goal of this repository is to stay small,
readable, and pragmatic while the product grows.

## Before You Start

- Read the README to understand the current app shape and Supabase setup.
- Keep changes focused. Small, reviewable pull requests are preferred.
- Avoid introducing new dependencies unless they solve a real problem.

## Development Workflow

1. Install dependencies with `npm install`.
2. Start the app with `npm run dev`.
3. Run `npm run lint` and `npm run build` before opening a pull request.
4. If your change touches the data model, update the Supabase migration or add a new one.

## Style Guidelines

- Follow the existing React and CSS patterns in the repo.
- Keep UI copy concise and product-oriented.
- Prefer structured data over hardcoded repeated values.
- Use ASCII unless a file already depends on other characters.

## Database Changes

If you change the schema, add a new migration under
`supabase/migrations/` rather than editing old history.

## Pull Requests

- Include a short summary of what changed and why.
- Mention any setup or migration steps reviewers need to run.
- Add screenshots for visible UI changes when relevant.

## Code Of Conduct

This project follows a straightforward standard: be respectful, be precise,
and keep feedback focused on the work. Harassment, discrimination, or abusive
behavior is not acceptable.

If you encounter behavior that violates this standard, open an issue or notify
the maintainers privately.
