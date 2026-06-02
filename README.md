# AI Engineer Roadmap

Multi-page progress tracker for the 17-week AI engineering roadmap. Built with Vite + React + TypeScript. Persists per-item checkbox state in `localStorage`. Deploys to GitHub Pages with zero infra.

## Quick start

```bash
npm install
npm run dev         # http://localhost:5173
```

## Scripts

| Script | What it does |
|---|---|
| `npm run dev` | Start the local Vite dev server. |
| `npm run build` | Type-check + production bundle to `dist/`. |
| `npm run preview` | Serve the production bundle locally. |
| `npm test` | Run Vitest (watch). Use `npx vitest run` for a single pass. |
| `npm run parse` | Re-parse `scripts/source.html` into `src/data/roadmap.json`. |

## How it works

- **Content source**: `scripts/source.html` (the single-file tracker). The parser in `scripts/parse-html.mjs` turns it into `src/data/roadmap.json` — the runtime never touches the HTML.
- **Persistence**: each resource link and each hands-on task is a checkbox leaf with a deterministic ID (`${weekId}-${dayIdx}-r${resIdx}` or `…-h`). All state lives in `localStorage['ai-roadmap-progress-v1']`.
- **Backwards compat**: the leaf-ID scheme matches the original single-file tracker's, so an `ai-roadmap-progress.json` exported from the old tracker imports cleanly here.
- **Pages**: Overview (hero + visual roadmap + appendix) · Part I · Part II. Routes use HashRouter (`#/part-1`) so GH Pages serves them without a 404 fallback.
- **Theme**: light / dark toggle in the top bar. Defaults to your OS preference on first visit; choice persists in `localStorage['ai-roadmap-theme']`. An inline boot script in `index.html` paints the theme before React mounts to avoid FOUC.

## Deploy to GitHub Pages

1. Push this repo to GitHub.
2. **Settings → Pages → Source: GitHub Actions**.
3. Edit `vite.config.ts` and set `base` to `'/<your-repo-name>/'` if it isn't `ai-engineer-roadmap`.
4. Push to `main`. The workflow at `.github/workflows/deploy.yml` builds and publishes.

Site URL: `https://<user>.github.io/<repo>/`.

## Re-parsing the source

If you update `scripts/source.html`, re-run:

```bash
npm run parse
```

Then commit the regenerated `src/data/roadmap.json`.

## License

Personal project. Content is the user's own roadmap.
