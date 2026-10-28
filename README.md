# neuclip

An open library of [Remotion](https://www.remotion.dev) animation clips with a
schema-driven, in-browser editor. Browse the gallery, open any clip, tweak its
text, colors, timing and layers on a timeline, and export the result to video.

## Features

- A searchable gallery of clips grouped by category: kinetic type, text
  reveals, 3D phone reveals, screen demos, overlays, transitions and more.
- A timeline editor with layered tracks for text, image, video, shape and
  animation elements, plus trimming, resizing and restacking.
- Properties panels generated from each clip's Zod schema, with color, slider,
  multiline, image and easing controls.
- Undo and redo that collapse a whole drag or slider gesture into one step.
- Export to MP4 (H.264, H.265 or AV1) or WebM (VP9) at a chosen scale and
  quality, rendered in your browser with `@remotion/web-renderer`. Use a
  recent Chrome, Edge or Firefox; the format list shows what your browser can
  encode.
- An "Edit with AI" panel on every clip and poster: describe a change and
  Gemini streams it straight into the editor as one undoable step.

Edits live in the browser session. Nothing you change is stored on the
server, so reloading a clip starts from its defaults. Images and videos you
pick are loaded locally. When you message the AI editor, the current clip or
poster is sent to the app's `/api/agent` route, which swaps embedded media
for placeholders before it reaches Gemini through OpenRouter. Set
`OPENROUTER_API_KEY` (see `.env.example`) to enable it; everything else runs on
any Next.js host such as Netlify.

## Build videos from an AI agent (MCP)

The site serves an open [MCP](https://modelcontextprotocol.io) endpoint at `/mcp`. An agent can
search the clip library, read a clip's editable props, and assemble and edit a video from clips.
Every result includes an `editorUrl` that opens the video in the browser editor. The video
travels inside the link's `#` fragment, so nothing is stored on the server and browsers never
send it.

```bash
claude mcp add --transport http cliplibrary https://<your-site>/mcp
```

Then ask, for example, "make a 20 second launch video for my habit app".

## Export fidelity

The browser renderer redraws the DOM onto a canvas and skips some CSS:
radial gradients, blend modes, backdrop filters and 3D perspective. Chrome's
HTML-in-canvas capture renders those faithfully. It is used automatically when
the browser supports it, which today means Chrome with the origin trial or the
`chrome://flags/#canvas-draw-element` flag. To enable the trial for a
deployment, register the site for the HTML-in-Canvas origin trial and set the
token as `HTML_IN_CANVAS_ORIGIN_TRIAL_TOKEN` at build time; it is sent as an
`Origin-Trial` header.

## Requirements

- [Bun](https://bun.sh) 1.4 or newer. Bun is the only package manager.

## Getting started

```bash
bun install
bun run dev
```

Open the printed URL, pick a clip and start editing. Gallery previews are
committed under `public/previews`, so the gallery works without rendering
anything. After adding or changing a clip, re-render its preview with
`bun run render <clipId>` and commit it.

## Layout

- `src/app`, `src/components`, `src/lib`: the Next.js App Router UI (gallery,
  editor, preview, timeline, properties panel and export).
- `src/schemas`: per-clip Zod schemas, typed defaults and registry metadata.
- `src/compositions`: the Remotion scenes, motion kit and `registerRoot` entry.
- `src/project`: the layered project model and its pure reducers.
- `src/core`: domain types, the clip project seed and schema-to-control
  introspection.
- `src/render`: Bun scripts built on `@remotion/bundler` and
  `@remotion/renderer` that render the committed gallery previews.
- `tests`, `e2e`: unit and component tests, and the Playwright suite.

## Common commands

- `bun run dev`: run the Next.js dev server.
- `bun run build`: production Next.js build.
- `bun run render [clipId...]`: render gallery previews to `public/previews`.
- `bun run render --new`: render only clips whose previews are missing.
- `bun run test`: unit and component tests.
- `bun run test:e2e`: Playwright end-to-end suite.
- `bun run verify`: the full local gate (lint, no-comments, em-dashes,
  repository hygiene, dead code, typecheck and tests).

## Adding a clip

Clips are pluggable modules. Add a schema under `src/schemas/clips/<category>/`
and a scene under `src/compositions/scenes/<category>/`, then register each in
its category `index.ts`. [AGENTS.md](AGENTS.md) walks through every step.

## Contributing

See [CONTRIBUTING.md](CONTRIBUTING.md) for the workflow and
[SECURITY.md](SECURITY.md) for how to report vulnerabilities.

## License

Released under the [MIT License](LICENSE).
