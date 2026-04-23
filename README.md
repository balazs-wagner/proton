# Proton

Low-fidelity prototyping setup for quickly sketching product ideas. Built on Chakra UI v3 + Vite + React. All prototypes live in one repo and auto-deploy to GitHub Pages via Bitrise.

**Live:** https://balazs-wagner.github.io/proton/#/

## What's inside

- **`src/framework/`** — the reusable bits: wireframe theme (grayscale, mono font, flat borders), a `ProtoFrame` shell, and low-fi primitives (`Placeholder`, `Frame`, `Annotate`)
- **`src/components/`** — shared UI wrappers (`Switch`, `Select`) built on Chakra v3 compound components
- **`src/prototypes/`** — one folder per prototype
- **`src/prototypes/registry.js`** — the single place where prototypes are registered
- **Index page** — lists every prototype, auto-generated from the registry

## Getting started

```bash
npm install
npm run dev
```

Open http://localhost:5173

## Creating a new prototype

1. Create a folder: `src/prototypes/my-new-idea/`
2. Add a component file, e.g. `MyNewIdea.jsx`:

   ```jsx
   import { ProtoFrame, Frame, Annotate } from '../../framework'
   import { Stack, Text, Button } from '@chakra-ui/react'

   export function MyNewIdea() {
     return (
       <ProtoFrame title="My new idea">
         <Stack p={8}>
           <Frame label="Main area">
             <Text>Your UI here</Text>
           </Frame>
           <Annotate>Design note visible only in the prototype</Annotate>
         </Stack>
       </ProtoFrame>
     )
   }
   ```

3. Register it in `src/prototypes/registry.js`:

   ```js
   import { MyNewIdea } from './my-new-idea/MyNewIdea'

   export const prototypes = [
     // ...existing,
     {
       slug: 'my-new-idea',
       title: 'My new idea',
       description: 'Short description for the index.',
       component: MyNewIdea,
     },
   ]
   ```

Done. It appears on the index and at `/#/my-new-idea`.

## Framework primitives

- `<ProtoFrame title>` — wraps every prototype with a full-bleed canvas. A small home icon appears when hovering the bottom-left corner to navigate back to the index.
- `<Frame label>` — bordered region with optional label, for grouping UI
- `<Placeholder label>` — dashed grey box for "something goes here"
- `<Annotate>` — italic margin note for design rationale (visible to reviewers)

Anything from `@chakra-ui/react` is available — `Button`, `Input`, `Stack`, `Menu`, `Dialog`, `Tabs`, etc. The wireframe theme flattens them automatically.

## CI/CD with Bitrise

Deployment is managed by Bitrise. The `bitrise.yml` in the repo root defines a `deploy` workflow that:

1. Clones the repo
2. Installs Node 18 via nvm
3. Runs `npm install`
4. Runs `npm run build`
5. Pushes the `dist/` output to the `gh-pages` branch

The workflow triggers automatically on every push to `main`. GitHub Pages serves the `gh-pages` branch at the live URL above.

> **Requires** a `GITHUB_TOKEN` secret in Bitrise with write access to the repo.

## Sharing individual prototypes

Each prototype has a stable URL after deploy. Just send the link — no login, no build, no Figma needed.
