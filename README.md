# Proton

Low-fidelity prototyping setup for quickly sketching product ideas. Built on Chakra UI v3 + Vite + React. All prototypes live in one repo and auto-deploy to GitHub Pages.

## What's inside

- **`src/framework/`** — the reusable bits: wireframe theme (grayscale, mono font, flat borders), a `ProtoFrame` shell, and low-fi primitives (`Placeholder`, `Frame`, `Annotate`)
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
       <ProtoFrame title="My new idea" note="v1 — first pass">
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

- `<ProtoFrame title note>` — wraps every prototype with a consistent top bar
- `<Frame label>` — bordered region with optional label, for grouping UI
- `<Placeholder label>` — dashed grey box for "something goes here"
- `<Annotate>` — italic margin note for design rationale (visible to reviewers)

Anything from `@chakra-ui/react` is available — `Button`, `Input`, `Stack`, `Menu`, `Dialog`, `Tabs`, etc. The wireframe theme flattens them automatically.

## Deploying to GitHub Pages

1. Push this repo to GitHub as `proton` (or rename — see note below)
2. In the repo settings → **Pages**, set source to **GitHub Actions**
3. Push to `main` and the included workflow builds and deploys automatically
4. Each prototype is shareable at `https://<your-username>.github.io/proton/#/<slug>`

> **If your repo name is not `proton`**, update `base` in `vite.config.js` to match (e.g. `/my-repo-name/`).

## Sharing individual prototypes

Each prototype has a stable URL after deploy. Just send the link — no login, no build, no Figma needed.
