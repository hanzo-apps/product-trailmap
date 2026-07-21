# product-trailmap — agent notes

Trailmap — a public product roadmap (Now / Next / Later) built on the canonical
Hanzo stack. Forked from `hanzo-apps/hanzo-starter`; the provider stack,
`vite.config.ts`, auth, and deploy contract are unchanged from the starter — only
the app (its three views + `schema.sql`) is Trailmap-specific.

Vite + React 19 + `@hanzo/gui` (UI) + `@hanzo/iam` (auth) + `@hanzo/base` (data).
Keep it minimal and REAL — every surface must build and run, no fabricated UI.

## The app

- **Model is one place** (`src/lib/model.ts`): the horizon lanes (`now`/`next`/
  `later`), the status ladder (`planned`/`building`/`shipped`), and the theme
  palette + `themeColor()`. The board, detail, and editor all import it.
- **Three views** (`src/views/`): `roadmap.tsx` is the signed-in shell + the
  Now/Next/Later board; `initiative.tsx` is the detail; `editor.tsx` creates and
  moves initiatives. `card.tsx` is the one initiative card, shared by the board
  and the landing preview. `signed-out.tsx` is the public landing.
- **One write path.** Every mutation goes through the editor's `initiatives`
  create/update/delete. The board and detail are read + navigation only.
- **Two collections** (`schema.sql`): `initiatives` (title, summary, horizon,
  status, theme) and `themes` (name, color). `DEFAULT_THEMES` keeps the board
  legible before any theme row is saved.

## One way, decomplected

- **Providers** (`src/providers.tsx`) mount in the canonical order every Hanzo
  surface ships: `GuiProvider` → `IamProvider` → `BaseProvider`. `BaseProvider`
  gets a `BaseClient` carrying the IAM access token; it is rebuilt when the token
  changes (`src/lib/base.ts` `baseAs`). That single seam is what makes every
  `useQuery`/`useMutation` org-scoped to the signed-in user. Trailmap fixes the
  **light** theme for its pastel look.
- **Env is one place** (`src/env.ts`), read from `import.meta.env.VITE_*`. The
  IAM client id is `VITE_IAM_CLIENT_ID` (fallback `hanzo-app`).
- **UI is one system** — `@hanzo/gui` primitives only (no second kit, no
  Tailwind).

## Gotchas (do not regress)

- **`@hanzo/gui` under Vite** needs three things in `vite.config.ts` (it is the
  Tamagui line; the in-browser builder runtime can't do this, which is the whole
  reason this ships as a real repo): (1) alias `react-native` →
  `react-native-web`, (2) `define` `process.env.TAMAGUI_TARGET` / `NODE_ENV` /
  `__DEV__`, (3) `dedupe` react/react-dom/react-native-web. No Tamagui compiler,
  no `one`, no Expo.
- **`@hanzo/gui` props are Tamagui LONGHAND** with this v5 config:
  `alignItems`/`justifyContent`/`backgroundColor`/`padding`/`paddingHorizontal`/
  `alignSelf`/`borderRadius`/`textAlign` — NOT the `items`/`justify`/`bg`/`p`/
  `self`/`rounded`/`text` shorthands. Shorthands pass at runtime but FAIL `tsc`.
- **`Button` is a Stack, not Text.** It does NOT accept text-style props
  (`color`/`fontWeight`/`letterSpacing`/`fontSize`). Put the label in a `<Text>`
  child and style that; keep only frame props (`backgroundColor`/`borderRadius`/
  `size`/`chromeless`/`hoverStyle`/`onPress`) on the `Button`. `Button` uses
  `onPress`; `Input`/`TextArea` use `value`/`onChangeText`.
- **PKCE storage is `localStorage`** (not sessionStorage) so the verifier/state
  survive the round-trip to hanzo.id.
- **`schema.sql` is the data contract.** It is the `databaseSchema` DDL the
  deploy translates into Base collections (`provisionBaseFromDDL`). Keep it in
  lockstep with `src/lib/model.ts`.

## Deploy contract (Hanzo Cloud)

- Static SPA: `npm run build` → `dist/`, served at `<slug>.hanzo.app` from
  object storage. No server process.
- On publish, `schema.sql` → `provisionBaseFromDDL` creates the collections
  (org-scoped, IAM-native). Runtime read/write is browser → `VITE_HANZO_BASE_URL`
  with the IAM token.
- **IAM redirect registration** is the one external requirement: the IAM client
  (`VITE_IAM_CLIENT_ID`, default `hanzo-app`) must allow this origin's
  `/auth/callback`. Production needs a `https://*.hanzo.app/auth/callback`
  wildcard on the shared client (or a per-app `hanzo-trailmap` client).

## Build

CI (`.github/workflows/ci.yml`) runs `npm ci && npm run typecheck && npm run
build` — build-verification only, NEVER a container image (Hanzo Cloud owns
deploys; do not build images locally).
