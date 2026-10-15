# Meal Planner

Vue 3, Vue Router, shadcn-vue, Tailwind CSS v4, and Supabase. The frontend stays in JavaScript; Edge Functions use TypeScript and Deno. The existing PWA integration is retained.

## Install and Run

Use Node.js 20.19+ or 22.12+ and the pnpm version specified in `package.json`.

```powershell
pnpm install
pnpm dev
```

The app loads without Supabase settings. Submitting the greeting requires the environment setup below. Nothing connects to Supabase on page load.

## Local Supabase

Start Docker Desktop (Linux containers) first. The first startup downloads the Supabase service images and can take several minutes. This project uses ports `55320`-`55329` and inspector port `8183` to avoid conflicting with other local Supabase projects. The API is at `http://127.0.0.1:55321` and Studio is at `http://127.0.0.1:55323`.

```powershell
pnpm supabase:start
pnpm exec supabase status
Copy-Item .env.example .env.local
```

Set `VITE_SUPABASE_PUBLISHABLE_KEY` in `.env.local` to the local publishable key from `supabase status`. Keep the example local URL. Restart Vite after editing environment variables. If using a hosted project, use its Project URL and publishable key instead.

Only publishable keys belong in `VITE_*` variables: Vite embeds them in the public browser bundle. Never use secret or service-role keys. Environment files are ignored by Git except `.env.example`.

The local project is already initialized in `supabase/config.toml`. No application schema, tables, migrations, seed data, or database queries are included. Supabase still creates its own built-in schemas for its managed services. SQL seeding is disabled.

## Sample Edge Function

In another terminal, with the local services running:

```powershell
pnpm supabase:functions:serve
```

Submit the form on Home, or invoke it from PowerShell:

```powershell
Invoke-RestMethod -Method Post `
  -Uri 'http://127.0.0.1:55321/functions/v1/hello-world' `
  -ContentType 'application/json' `
  -Body (@{ name = 'Ada' } | ConvertTo-Json)
```

Expected JSON: `{ "message": "Hello Ada!" }`.

The function accepts POST JSON with a nonblank name of at most 100 characters. It returns 400 for invalid input and 405 for unsupported methods. Supabase's wrapper handles browser CORS and OPTIONS requests.

**This sample is intentionally public:** `verify_jwt = false` and `auth: "none"`. It has no database access or sensitive behavior. Add authentication, authorization and appropriate origin/rate-limit controls before extending it to private or privileged operations. Do not copy this authentication setting to sensitive functions.

Stop local services without deleting data:

```powershell
pnpm supabase:stop
```

### Optional Hosted Deployment

Create a hosted Supabase project separately, then authenticate directly through the CLI/browser and link it. No deployment or remote database changes are performed automatically.

```powershell
pnpm exec supabase login
pnpm exec supabase link --project-ref YOUR_PROJECT_REF
pnpm exec supabase functions deploy hello-world
```

Update `.env.local` to the hosted project URL and publishable key, then restart Vite. This workflow deploys only the function; no `db push` is required.

## Components

JavaScript shadcn-vue components live in `src/components/ui`. Configuration is in `components.json`, the `cn` helper is in `src/lib/utils.js`, and the theme is in `src/assets/main.css`.

```powershell
pnpm exec shadcn-vue add dialog
```

## Verification

```powershell
pnpm test:unit --run
pnpm check:functions
pnpm test:functions
pnpm build
```

Deno is installed as a pinned project development dependency, so no global install is required. Function tests exercise the actual fetch wrapper, including CORS, with dummy runtime configuration and no Docker, credentials or network calls. The first Deno run downloads the function's npm dependencies; its lockfile is committed. Vitest excludes the Deno files and tests the frontend independently.
