# Repository Guidelines

## Project Structure

- `app/` contains Next.js App Router pages, layouts, and API route handlers (`app/api/`).
- `lib/` contains shared server utilities, including the Prisma client. `utils/` holds authentication and request helpers; `types/dto/` holds request schemas and DTO types.
- `prisma/schema.prisma`, `prisma/migrations/`, and `prisma/seed.ts` define and initialize the database. Treat `app/generated/prisma/` as generated output; update the schema and regenerate instead of editing it directly.
- `public/` contains static assets such as the hospital logo.



## Development Commands

- `npm ci` installs the versions recorded in `package-lock.json`.
- `npm run dev` starts the local Next.js development server.
- `npm run build` creates a production build; `npm start` serves that build.
- `npm run db:seed` runs the configured Prisma seed script. Set `DATABASE_URL` first.

## Code Style

Use TypeScript and the existing two-space indentation. Keep route files aligned with App Router conventions, use `PascalCase` for React components and `camelCase` for functions and variables, and define request validation with the existing Zod schemas. Style UI with Tailwind CSS and use `lucide-react` for interface icons and  react-hot-toast for error and success messages. Keep secrets in environment variables; authentication also requires `JWT_KEY`.

## Responsive UI

Every page and shared component must work on mobile, tablet, and desktop. Use Tailwind's mobile-first responsive utilities, keep content readable without horizontal scrolling, and adapt navigation, forms, tables, and spacing for narrow screens. Check layouts at small, medium, and large breakpoints when making UI changes.

## Testing

There is no test framework or test script configured yet. For changes, run `npm run build` and describe any manual checks. If adding tests, include the runner and command in the same change and use clear `*.test.ts` or `*.test.tsx` names.

## Commits and Pull Requests

Recent commits use Conventional Commit prefixes, such as `feat:`, `chore:`, and `fix:`. Keep commit subjects short and imperative. Pull requests should explain user-visible changes, list database or environment changes, link related issues, and include screenshots for UI updates.

## Next.js Agent Guidance

<!-- BEGIN:nextjs-agent-rules -->

## This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->
