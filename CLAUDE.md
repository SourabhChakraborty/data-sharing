# NYC Interagency MOU Visualizer

React + D3 + Vite app visualizing NYC agency data-sharing agreements under Local Law 40 of 2011. Deployed to GitHub Pages.

## Commands

```bash
npm run dev      # dev server (usually binds to :5173 or :5174 if port taken)
npm run build    # production build → dist/
npm run lint     # eslint
npm run preview  # preview the dist/ build locally
```

## Deployment

Pushes to `main` auto-deploy via GitHub Actions (`.github/workflows/deploy.yml`). No manual step needed. The Vite base is `/data-sharing/` — this must stay set in `vite.config.js` or GitHub Pages routing breaks.

## Data

`src/data/agreements.json` is the authoritative data file. Two entry types:
- `"data_source": "confirmed"` — manually curated with a verified published PDF link
- `"data_source": "scraped"` — extracted directly from agency MOU pages; `pdfUrl` links to the actual published document

**NEVER invent agreement data.** Any new entry must have a real `pdfUrl` pointing to a published NYC government PDF. Do not add entries without a primary source.

### Re-scraping

The full pipeline:

```bash
# 1. Scrape PDF links from all agency MOU pages → /tmp/scraped.json
node scraper/scrape.cjs --output /tmp/scraped.json --verbose

# 2. Post-process: clean titles, infer parties/categories, dedup
#    (inline Python — see previous session for the processing script)

# 3. Enrich with vision-based descriptions from Claude API
#    Requires ANTHROPIC_API_KEY; uses claude-haiku-4-5 for cost efficiency
python3 scraper/describe.py --data src/data/agreements.json

# 4. Manual review before committing
```

`scraper/describe.py` downloads each PDF, renders the first 2 pages as PNG images via PyMuPDF, and sends them to the Claude vision API asking for: a 1–2 sentence description, the actual parties named in the document, and the data types being shared. This is the right approach because most NYC agency PDFs are scanned — plain text extraction yields only signature blocks.

Known issues to watch for after re-scraping:
- `DSS` and `HRA` may both appear as parties for the same entity — if an entry has both, remove `DSS` (HRA is the source-page name). DSS-only entries (newer docs) are fine.
- `DOH` should be `DOHMH`
- `Contact Information` tends to be over-extracted by the vision model (every MOU mentions addresses); strip it from `dataTypes`
- Years extracted from PDF text can be wrong (e.g. 1983 for a 2023 agreement); treat any year before 2011 as suspect
- nyc.gov returns 403 on some pages; the scraper logs warnings and skips those

## Architecture

All filter/view state lives in `App.jsx`. Components are stateless except NetworkGraph (D3 sim + domain filter + tooltip state).

- `NetworkGraph` — D3 force simulation. Uses a transparent wide hit-line layer (`stroke-width: 20`) on top of visible edges for fat touch targets. Visible lines have `pointer-events: none`.
- `AgreementTable` — sortable table view
- `DataTypesView` — bubble chart by data domain
- `AgreementDetail` — side panel (full-screen overlay on mobile)
- `FilterBar` — controlled by App.jsx state

## Mobile

Breakpoint: `640px` in `App.css`. Key mobile behaviors:
- Detail panel becomes `position: fixed; inset: 0` (full-screen overlay)
- Domain filter panel collapses to a single tappable header row
- Legend hidden (`network-legend--desktop`)
- All interactive controls meet 44px touch target minimum

## Skills

Use these skills proactively — don't wait to be asked:

- `/verify` — after any UI change, screenshot the live site at desktop (1440×900) and mobile (390×844) and check all four tabs. Caught the detail-panel-persisting-on-tab-switch bug, bad year display, and Contact Information dominating the bubble chart.
- `/code-review` — before PRs touching data logic or the scraper pipeline
- `/simplify` — after larger refactors to the filter or render logic

## UX Reviews

After batches of UI changes, run `/verify` against the live GitHub Pages URL (`https://sourabhchakraborty.github.io/data-sharing/`). Check all four tabs (Network, Data Types, Table, About) at both viewport sizes. Things that have bitten us before:

- Detail panel state persisting across tab switches
- Year filter silently dropping entries (check that header count matches total)
- Data type bubbles dominated by a single over-extracted type
- Mobile table title overflow
- Party tags referencing agencies not in the agencies list (renders as orphan node in network)
