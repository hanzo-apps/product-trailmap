-- Hanzo Base schema for Trailmap (the `databaseSchema` DDL).
--
-- On publish, Hanzo Cloud translates each CREATE TABLE into a Hanzo Base
-- collection via `provisionBaseFromDDL` (additive + idempotent). Base manages
-- `id`/`created`/`updated`/`owner`/`org` itself, so they are never re-declared
-- here; every row is stamped with the verified IAM `owner`+`org` and is
-- org-scoped — the org-isolation rule `@request.auth.org_id = org` is enforced
-- by Base, so a member of your org reads/writes it and other orgs cannot see it.
--
-- Keep this file in lockstep with what the app reads/writes
-- (src/lib/model.ts, src/views/roadmap.tsx, editor.tsx).

-- Roadmap initiatives, placed on a horizon (now | next | later), moving up a
-- status ladder (planned | building | shipped), tagged with a theme name.
CREATE TABLE IF NOT EXISTS initiatives (
  title   TEXT NOT NULL,
  summary TEXT NOT NULL DEFAULT '',
  horizon TEXT NOT NULL DEFAULT 'now',
  status  TEXT NOT NULL DEFAULT 'planned',
  theme   TEXT NOT NULL DEFAULT ''
);

-- Named themes with a colour; an initiative's `theme` references a theme name,
-- and the card's colour-bar is painted from it.
CREATE TABLE IF NOT EXISTS themes (
  name  TEXT NOT NULL,
  color TEXT NOT NULL DEFAULT '#4C8DF6'
);
