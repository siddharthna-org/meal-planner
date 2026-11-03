# Meal Planner

Vue 3, Vue Router, shadcn-vue, and Tailwind CSS v4. The frontend stays in JavaScript. The existing PWA integration is retained.

## Install and Run

Use Node.js 20.19+ or 22.12+ and the pnpm version specified in `package.json`.

```powershell
pnpm install
pnpm dev
```

## Components

JavaScript shadcn-vue components live in `src/components/ui`. Configuration is in `components.json`, the `cn` helper is in `src/lib/utils.js`, and the theme is in `src/assets/main.css`.

```powershell
pnpm exec shadcn-vue add dialog
```

## Verification

```powershell
pnpm test:unit --run
pnpm build
```
