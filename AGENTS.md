# cliplibrary

A single Next.js project for a library of Remotion animation clips and editable poster packs,
with a deep, schema-driven video editor and a canvas image editor in the browser.

## Layout

Everything lives in one package. Modules import each other through the `@/` alias
(`@/schemas`, `@/project`, `@/core`, `@/compositions`, `@/lib/...`).

- `src/app`, `src/components`, `src/lib` - Next.js App Router UI: clip gallery and per-clip
  editor (live `@remotion/player` preview, schema-driven properties panel, timeline, in-memory
  undo/redo and export). The editor never writes project state to the server.
- `src/render` - Bun render scripts (`@remotion/bundler` + `@remotion/renderer`) for the
  committed gallery previews. They run locally only. The app's one API route is the media agent.
- Editor export runs in the browser (`src/lib/use-project-export.ts`, `renderMediaOnWeb`), and
  picked media becomes an object URL. Keep compositions within what `@remotion/web-renderer`
  can draw: no `z-index`, `OffthreadVideo` or `Html5Video`, and prefer linear gradients over
  radial ones, blend modes, backdrop filters and 3D perspective, which only render when Chrome's
  HTML-in-canvas capture is available (`HTML_IN_CANVAS_ORIGIN_TRIAL_TOKEN`).
- `src/schemas` - per-clip Zod schemas, typed defaults, inferred types, the `ClipId` union and clip
  registry metadata. Pure, no React, no Node.
- `src/compositions` - the Remotion scenes, motion kit, `Root`, and the `registerRoot` entry.
- `src/project` - the layered `Project` model and its pure reducers.
- `src/design` - the image editor's typed `Design` model (pages of text, shape, path, line, image
  and icon elements, gradients, filters), pure mutations, geometry, the font catalog and the
  curated lucide icon set. Pure, no React.
- `src/components/design-editor` - the Konva image editor: canvas workspace, panels, shortcuts,
  offscreen page rendering and PNG, JPG, PDF and JSON export. Edits autosave to `localStorage`.
- `src/posters` - poster packs. Each pack (`packs/<category>/<pack-id>/`) is one multi-page
  `Design` built with the authoring kit in `src/posters/kit` (elements, blocks, devices,
  templates and shared listing slides). `photos.ts` lists the bundled Unsplash photos in
  `public/design-assets/photos`.
- `src/core` - domain types, the clip project seed and the Zod-schema-to-control introspection.
- `tests` - `bun test` suites, mirroring `src` (`tests/schemas`, `tests/core`, ...); top-level
  files and `tests/components` cover the UI. `e2e` holds the Playwright suite.

## Toolchain

- Bun only. No npm, pnpm or yarn.
- Biome for lint and format. Strict TypeScript (`tsconfig.json`, every strictness flag on).
- Tests: `bun test` with happy-dom + Testing Library for unit and component, Playwright for e2e.
- lefthook runs Biome and the no-comments, em-dash and repository checks pre-commit; typecheck and
  lint pre-push.

## Commands

- `bun run dev` - Next.js dev server.
- `bun run build` - production Next.js build.
- `bun run verify` - Biome, no-comments, no em-dashes, repository hygiene (files at most 400 lines,
  kebab-case paths), knip, typecheck and tests. CI also runs coverage, build, e2e, audit and the
  Markdown, YAML and workflow linters.
- `bun run lint` / `bun run lint:fix` - Biome.
- `bun run typecheck` - `tsc --noEmit`.
- `bun run test` / `bun run test:e2e` - unit/component / Playwright.
- `bun run render [clipId...]` - gallery previews: a half-size mp4 plus a 48px first-frame jpg per
  clip in `public/previews`. The previews are committed, so the deployed build never renders:
  the homepage is prerendered at build time with the first screen of cards server-rendered, then
  lays the cards out as a virtualized masonry grid (`@tanstack/react-virtual` lanes, each card at its
  clip or poster aspect ratio, only cards near the viewport stay mounted), lazily
  loads each card's first frame as a blurred background and plays the mp4 over it once the card
  nears the viewport. Every new clip,
  and every clip whose rendered output changes, must commit its re-rendered preview; `tests/render/gallery-previews.test.ts`
  fails when one is missing.
- The gallery lists the most recently updated clips first, from the per-clip ISO timestamps in
  `src/schemas/clip-updated-at.json`. `bun run render` stamps a clip there when it is named on
  the command line or has no entry yet, so a new or changed clip lands on top once its preview is
  re-rendered; a bare full re-render keeps existing timestamps.
  `tests/schemas/clip-updated-at.test.ts` fails when a clip has no timestamp.
- `bun run render --new` - same, but only clips whose preview files are missing from
  `public/previews` (`-new` also works).
- `bun run render:posters [packId...]` - renders poster previews (480px jpgs, one per page) into
  `public/poster-previews/<pack>/` with the editor's own renderer in headless Chromium, and stamps
  the pack in `src/posters/poster-updated-at.json` when it is named or has no entry yet, so the
  grid sorts posters and clips together by last update. `--pack-file <path> --out <dir> --width
  <px>` renders an unregistered pack to any folder for review. `tests/posters/posters.test.ts`
  fails when a pack has no preview, no timestamp, or uses a font, icon or photo outside the
  bundled sets.

## Rules

- No comments in code. Only functional directives (`biome-ignore`, `@ts-*`, `eslint-*`,
  `/// <reference`, `/*! license */`). Enforced by `scripts/strip-comments.ts --check`.
- Heavily typed. Zod schemas are the single source of truth for clip props; derive types with
  `z.infer`, never hand-duplicate them.

## Clip modules

Clips are pluggable, category-organized modules so that parallel authors rarely touch the same
file. Categories group clips by the type of animation and are defined once in
`src/schemas/taxonomy.ts` (`CLIP_CATEGORIES`): `kinetic-type`, `text-reveals`, `hand-drawn`,
`phone-reveals`, `phone-layouts`, `screen-demos`, `desk-scenes`, `overlays`, `list-pickers`, `brand`,
`ad-reveals`, `backgrounds`, `transitions`.
Each category also lists search `keywords` (synonyms the gallery search matches). Every
`ClipMeta` also carries `tags` (from `CLIP_TAGS`) and a `theme` (`light` or `dark`), which the
gallery search and filters read.

- Schema side: `src/schemas/clips/<category>/<id>.ts` exports `<name>Schema`,
  `<name>Defaults`, `<Name>Props` and `<name>Meta: ClipMeta` (metadata, including `category`, is
  co-located with the schema), with its editor layout in `<id>-controls.ts` beside it. Each
  category's `index.ts` exports a `ClipModule[]` (`{ id, schema, defaults, meta, controls }`), and
  `clips/index.ts` concatenates them into `CLIP_MODULES`, then derives `CLIP_REGISTRY`,
  `CLIP_SCHEMAS`, `CLIP_DEFAULTS`, `CLIP_IDS` and the `getClip*`/`isClipId` accessors.
- Composition side: `src/compositions/scenes/<category>/<id>.tsx` exports the scene
  component and a `<name>Scene: SceneModule` (`{ id, component, render }`). Each category's
  `index.ts` exports a `SceneModule[]`, and `scenes/index.ts` concatenates them into `CLIP_SCENES`,
  from which `CLIP_COMPONENTS` and `RemotionRoot` are built.

To add a clip:

1. Add the schema file under the chosen category (`<name>Schema`/`<name>Defaults`/`<Name>Props`/
   `<name>Meta`) and re-export it from `src/schemas/index.ts`.
2. Add its id and `Props` type to `ClipPropsMap` in `src/schemas/clip-props.ts` (this is
   the typed map of the built-in clips and the source of the `ClipId` union).
3. Add its control layout `clips/<category>/<id>-controls.ts` (`<name>Controls`, see Controls).
4. Register the module, with its `controls`, in that category's `clips/<category>/index.ts`.
5. Add the scene file under `scenes/<category>/` (component + `<name>Scene`).
6. Register the scene in `scenes/<category>/index.ts` (one line).
7. Run `bun run render <id>` and commit its preview files in `public/previews`.

## Controls

Every clip has a hand-written control layout that drives its editor panel, and a field tag on
the zod schema decides each control's widget.

- Layout: `clips/<category>/<id>-controls.ts` exports
  `<name>Controls = defineControls<<Name>Props>({ sections, hidden })`
  (`src/schemas/control-layout.ts`). Each section has a `title`, primary `fields` and optional
  `more` (behind "More options"). A field is a typed path, `{ path, label, hint, items }`, or
  `{ link: [paths], label, hint }`, one control that writes the same value to several paths of
  identical shape. `hidden` is only for shared sub-schema fields the scene never reads.
- `src/schemas/control-presets.ts` holds `LOOK`, `MOTION`, `PLACEMENT` and `STAGE` fields with
  standard labels; spread them to relabel for a specific clip.
- `src/core/clip-controls.ts` resolves layouts for the editor. `tests/core/clip-controls.test.ts`
  requires every schema path to appear exactly once as a single field or in `hidden` (a path
  inside a `link` still needs its own single entry), no unknown paths, unique section titles and
  every link to resolve.
- Layouts are personal to the clip: sections named after what the viewer sees, content first,
  2 to 6 primary fields per section, linked controls for values people change together, accurate
  plain-English labels and hints, and no hard-coded value a user would want to change.

Field tags are read back by `src/core/schema-introspect.ts`:

- `zColor()`, `zMultiline()`, `zSlider({ min, max, step })`, `zImage()` and `zVideo()` (a URL,
  data-URI or object URL string; empty is allowed and renders a placeholder), and
  `z.enum(EASING_IDS)` for an easing curve picker.
- `EASING_IDS`/`EasingId` live in `@/schemas` and are the single source consumed by the
  compositions motion kit (`kit/easing.ts`).

## Projects and layering

A `Project` (in `@/project`) is `{ fps, width, height, durationInFrames, background,
tracks }`. Each `Track` holds ordered `Element`s (`text | image | video | shape | composition`),
and every element is independently selectable, movable, trimmable and animatable in the timeline
editor.

- Stacking order: the FIRST track in `tracks` is the TOP visual layer and the TOP row of the
  timeline. `ProjectComposition` renders tracks in reverse DOM order, never `z-index` (the browser
  renderer ignores it), so earlier tracks sit on top; within a track, later elements paint over
  earlier ones. Project videos use `<Video>` from `@remotion/media`, not `OffthreadVideo`. The
  timeline UI, `moveTrack` (up = toward the top layer) and the render stay consistent with this.
- Pure reducers in `src/project/mutations.ts`: `moveElementToTrack` (reassign an element's
  layer, optionally re-clamping `from`), `moveTrack` (restack a whole track up/down) and
  `trimElementStart` (left-edge trim: moves `from` while holding the right edge fixed, min one
  frame). Right-edge drag uses `resizeElement`. All are frame-snapped and clamped.
- `seedProjectForClip(id)` (in `@/core`) opens a clip as a one-track project holding it as a
  `composition` element. The homepage lists `CLIP_REGISTRY`, and `/clips/[clipId]` validates
  with `isClipId`.
- The `@/schemas` scenes are reusable building blocks: the timeline
  toolbar's "Animation" picker inserts one as a `composition` element (its `clipId` is a schema
  `ClipId`, rendered through `CLIP_COMPONENTS`), layerable alongside the primitive elements.

## Media agent

Every clip and poster page has an "Edit with AI" panel (`src/components/media-agent`) that streams
a chat with `useChat` from `@ai-sdk/react`. The editor sends its current document with each
message to `POST /api/agent` (`src/app/api/agent/route.ts`), which runs `streamText` on Gemini 3.7
Flash and falls back to Gemini 3.5 Flash when 3.7 is overloaded or rate limited
(`src/agent/model.ts`). The route needs `GOOGLE_GENERATIVE_AI_API_KEY` (see `.env.example`).

- The model edits through one tool, `editMedia`, which takes RFC 6902 JSON Patch operations
  (`src/agent/edits.ts`, `fast-json-patch`). Each patch is validated with `checkMedia`
  (`src/agent/media.ts`): the `Project` or `Design` schema, every composition's clip schema,
  unique ids, bundled fonts and icons. A failed patch goes back to the model as an error to fix.
- The browser applies each successful tool output with the same `applyEdits` as one undoable step,
  so the agent never owns state.
- `src/agent/assets.ts` swaps data and object URLs for `asset://N` before the document reaches the
  model and swaps them back in the returned operations.
- `src/agent/instructions.ts` builds the system prompt: the document, its JSON schema and, for
  clips, each composition's control layout as a field guide.
- `e2e/media-agent.spec.ts` replays a recorded stream, so CI never calls Gemini.

## Poster packs and the image editor

The home grid lists clips and poster packs together. A pack card shows a carousel of its pages,
and clicking a page opens `/posters/<pack>?page=<n>` in the image editor.

To add a pack:

1. Create `src/posters/packs/<category>/<pack-id>/` (categories are `POSTER_CATEGORIES` in
   `src/schemas/taxonomy.ts`) with a `posts.ts` of `Template`s and an `index.ts` that exports
   `definePack({...})` with one page thunk per page.
2. Add it to that category's `index.ts`.
3. Run `bun run render:posters <pack-id>` and commit the previews and the timestamp.

Keep every template element inside the template's own bounds (use `poly` for diagonal bands), and
only use the bundled fonts, icons and photos.
