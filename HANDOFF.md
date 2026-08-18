# Handoff — NBA Moneyline redesign session

**Branch:** `sticky-app-header` (name is now stale/misleading — the sticky
header concept it started with was ripped out hours ago; consider renaming
before a PR, e.g. `redesign` or `light-theme`).
**Status:** Nothing committed. Everything below is uncommitted working-tree
changes on top of `main` (which is 2 commits ahead of `origin/main` itself,
a pre-existing no-op pin/revert pair unrelated to this work).
**Dev server:** `npm run dev` (nodemon, reads `.env.development.local`).

## ⚠️ Read this first — the "missing games" premise is wrong

A prompt came in mid-session asking to scrape oddsportal for teams with
sub-82 game counts in recent seasons (attributed to the in-season
tournament), reasoning it as missing data that should be filled in.
**Investigated this before doing anything — it's not a bug.** Queried the
DB directly:

- 2016–2018, 2021–2022: every team, exactly 82 games. Clean.
- **2019 (2019-20 season): 64–75 games, highly variable** — this is the
  real COVID-hiatus season teams entered the bubble with uneven games
  played. Already correctly excluded by the user's own stated caveat.
- **2020 (2020-21 season): uniformly 72 games** — the official
  COVID-shortened schedule that year. Correct, not missing anything.
- **2023, 2024, 2025 (2023-24 through 2025-26 — the IST era): exactly 22
  teams at 82, 4 teams at 81, 4 teams at 80, every season.**

That 22/4/4 split isn't a scraping gap — it's **already fully
documented, deliberately designed, and unit-tested** in
`data/util/constants.py`: the scraper intentionally excludes IST
knockout-round games (quarterfinal/semifinal/championship) because they
don't have "a clean single-opponent moneyline (neutral-site, etc.)" —
i.e., the odds/profit model this whole app is built on doesn't cleanly
apply to them. `data/scrape/verification.py` actively validates scraped
data against this exact expected distribution before it's trusted for
production. There's also a passing test
(`data/test/scrape/schedules/test_parser.py`) asserting this exact
exclusion logic (81 games for a quarterfinal loser, etc.).

**Queried the actual DB and it matches the documented distribution
exactly** (24 team-season combos across 2023/2024/2025, all landing on
80 or 81 as expected — checked, not assumed).

**So: do not scrape more games to "fill this in."** That would reverse a
deliberate, tested architectural decision, and would require solving the
"no clean single-opponent moneyline" problem for neutral-site tournament
games, which is a real, unsolved modeling question, not a scraping gap.

**What might still be worth doing** (a UX question, not a data one): the
user's actual concern — "this will look confusing when users know a
season had 82 games" — is still valid on its own terms. If it's worth
addressing, the fix is communicating the exclusion somewhere in the UI
(a footnote, or context in an about/info affordance if one gets built),
not changing the data. Wasn't touched this session; flagging as a real
open question, distinct from the (resolved, not-a-bug) data question
above.

## What this session actually was

Started as "the color scheme feels too heavy" and turned into a full
ground-up redesign of the app's layout, color system, and information
architecture. Read this doc top to bottom before touching anything — a lot
of early decisions were later reversed by later feedback, and the code
comments explain *why* at each point, but this doc is the fast version.

## Current state, high level

- **Layout:** filters + results always visible together, no full-screen
  takeover state. Wide screens (≥1000px): sticky white sidebar (380px) on
  the left. Narrow screens (<1000px): filter panel is `position: fixed`
  at the **bottom** of the viewport (not top — deliberately, for
  thumb-reachability), with two states — see "Narrow onboarding panel"
  below.
- **Color system:** one shared neutral (`--color-page-bg: #f8fafc`) for
  both the filter panel and the results area — NOT two different tinted
  zones. White cards float on top of that neutral for actual content.
  Accent color (`--color-brand`) is a near-black ink tone (`#1e293b`,
  literally same value as `--color-ink`), used only in small doses
  (button, focus rings, a couple of headings) — never as a background
  wash. Red/green (`--color-positive`/`--color-negative`) are the only
  real hues in the palette, reserved for bet outcomes; there's no third
  competing hue anymore (an earlier attempt used blue as the brand color
  — user felt 3 hues was too many, correctly).
- **Every text/background pairing was contrast-checked** (not eyeballed)
  against WCAG — see the computed values noted in `style.css` comments
  near `:root`.
- **Result sections:** each of the 4 result sections (`.result`) is now
  ONE shared white bordered card containing both the headline banner text
  AND its supporting chart/chips/bars — not a boxed banner with bare
  content floating below it. This was a deliberate late-session change;
  see the "Section layout" note below for why.
- **Dropdowns:** consistent pill styling (rounded, bordered, white/gray
  alternating with their container) across both breakpoints, real
  hover/focus states. Team dropdown now shows W-L record per team per
  season, e.g. "Boston Celtics (56-26)" — fetched from a new endpoint,
  refreshes when season changes.
- **New: cumulative profit line chart**, hand-rolled inline SVG (no
  library), showing the season trajectory under the hero banner. Diverging
  green/red area wash marks up/down stretches. Peak, trough, and the final
  (Game N) value are all directly labeled. See "Line chart" section below
  for the non-obvious bits.
- **New: win/loss diverging bar chart**, replacing what used to be 4 plain
  text chips — bars from a zero baseline, red left / green right, scaled
  relative to the largest magnitude across all 4 categories.
- **Default wager is now $100** (was $50) — `renderFilters.js`.

## Narrow onboarding panel (the newest, most involved piece)

Problem: landing on the app on a narrow screen showed results + a compact
filter pill bar, but with zero context — no app name, no explanation of
what the numbers mean. Fix: narrow screens now have two states, driven by
a `.filters-collapsed` class on `#app`:

- **Default (no class) = expanded.** Reuses the exact same
  stacked/labeled layout the wide sidebar uses (title, subtitle, full
  labeled dropdowns) — it's not a separate implementation, it's the SAME
  unconditional base CSS rules that wide mode also uses; the narrow media
  query for this state only adds `position: fixed; bottom: 0;
  min-height: 70vh; justify-content: center;` on top. This is what a
  first-time visitor sees before touching anything.
- **`.filters-collapsed` = the compact pill bar** (what used to be the
  only narrow state before this session). All the old compact-mode CSS
  (hide title/subtitle, flatten via `display: contents`, shrink dropdowns)
  now lives scoped under `#app.filters-collapsed` instead of being
  unconditional.
- **Transition triggers:** clicking "View Results" always collapses
  (`collapseNarrowFilters()`, called from `handleSubmit.js`'s click
  listener — deliberately NOT from the automatic first-load
  `updateResults()` call, so the auto-populated default results on page
  load don't immediately collapse the onboarding view before the user's
  even seen it). A toggle button (`#filters-expand-toggle`, chevron icon)
  lets the user manually re-expand/re-collapse afterward.
- **Known layout gotcha already fixed once, watch for regressions:** the
  toggle button is `position: absolute` (top-right corner) in the
  expanded state, which works fine in the tall panel — but in the short
  collapsed bar that same absolute position overlapped the pills next to
  it. Fixed by making it `position: static; order: 1;` (a normal flex
  item, pushed to the end) specifically under `.filters-collapsed`. If
  you touch this again, re-check both states.

New files: `public/js/events/handleFiltersExpandToggle.js`. Touched:
`handleSubmit.js`, `index.html`, `style.css` (the whole
`@media (max-width: 999px)` block for `#filter-panel`).

## Line chart — non-obvious implementation details

`public/js/view/renderProfitChart.js`, hand-rolled inline SVG,
`viewBox="0 0 600 168"` with `preserveAspectRatio="none"`.

- **New backend endpoint**, `GET/POST /api/per-game-profit` →
  `app/queries/perGameProfit.sql` — same betting-odds math as
  `resultSummary.sql`, minus the final `GROUP BY`, returns one row per
  game in order. **Verified its sum matches the existing aggregate query
  exactly** (ran both against the DB directly, byte-for-byte match) — if
  you ever touch the odds math in one, check the other.
- **`aspect-ratio` CSS, not a fixed pixel height** on `.profit-chart-svg`.
  A responsive width against a fixed height made x/y scale factors
  diverge (since `preserveAspectRatio="none"` allows independent
  scaling), stretching text non-uniformly. This bit us once already —
  if the chart ever looks squished again, this is the first thing to
  check.
- **paddingX/paddingY exist specifically so markers don't get clipped.**
  A marker centered exactly on the SVG boundary only half-renders (the
  default `overflow: hidden` clips the rest) — this was reported as "a
  stray red dot peeking out" before the padding fix.
- **Peak/trough are searched over indices 1..lastIndex**, deliberately
  excluding the synthetic index-0 "$0 before any games" anchor point.
- **The end marker (Game N) always renders, bigger than peak/trough**
  (r=5 vs r=3), always labeled — this is deliberate, it's what visually
  ties the chart to the hero banner's number above it. If the peak or
  trough happens to land on the exact same final point (a season that
  ends on its high, say — this genuinely happens, caught it with a
  Celtics test case), the peak/trough's own marker is suppressed rather
  than drawing two overlapping dots/labels at the same spot
  (`skipPeak`/`skipTrough` in the JS).
- **No axis ticks/labels — tried and deliberately abandoned.** Two rounds
  of attempts: floating HTML text below the SVG (felt visually
  disconnected from the chart), then in-SVG ticks dropping from the
  line's exact start/end x-coordinates (still read as detached from the
  data, and the ticks were briefly invisible entirely — `--color-border`
  has almost no contrast at 1px against the page background). Rather
  than keep tuning it, the game range moved into the chart title text
  instead: `"Cumulative profit across the season (Game 1 through N)"`,
  where N is `perGameProfitRows.length` (so it's automatically correct
  for the 80/81/82-game IST-affected seasons — see the box at the top of
  this doc). If axis ticks come up again, this was tried twice and
  didn't land either time — worth a genuinely different approach, not a
  third tuning pass on the same idea.
- **Deferred, not built:** hover tooltip + crosshair (would show exact
  $ value at any point on hover/touch). Explicitly discussed and put off
  — this is a materially bigger feature than anything else built this
  session (the app's first continuous-pointer-tracking interaction,
  needs real mouse+touch handling and in-bounds tooltip positioning).
  Also deferred: win/loss streak stats (e.g. "8 in a row at one point") —
  would reuse the same per-game data this chart already fetches.

## Section layout — why cards changed shape mid-session

Earlier in the session, the line chart and diverging bar chart were
deliberately placed OUTSIDE their banner cards (bare on the page
background), reasoning "match the established pattern." Later, prompted
by the user noticing every section now has both a banner AND a
chart/table, we revisited that pattern entirely: each section's `.result`
wrapper (already the shared parent of banner + metadata in every section)
now owns ONE white card (background/border/radius/padding), with the
banner text and its chart/chips/bars both living inside it, unstyled at
the banner level. This was informed directly by the bundled dataviz
skill's "chart container" component principle (a container owns its
title AND its content as one unit). If you're wondering why
`.profit-chart-dot`'s ring color is `--color-white` and not
`--color-page-bg` — this is why; it flipped once already when the chart
moved outside the banner, then flipped back when sections were unified.

## Team records feature

`app/routes/teamRecords.js` (`GET /api/team-records?seasonStartYear=X`,
custom route — doesn't fit `createQueryRoute`'s fixed 4-param signature
since it only needs a season) + `app/queries/teamRecords.sql`. Frontend:
`handleSeasonChange.js` fetches on load and on season change, rewrites
every `<option>`'s `textContent` (never touches `.value`, which stays the
plain team name — this matters, `option.value` is what
`getFilterValues()` reads).

## Things discussed but NOT implemented — don't assume these are done

1. **Merging the "Total Profit" and "ROI" banners into one section.**
   Discussed and the user agreed to it in principle ("I'm open to just
   removing [ROI] completely and moving its chips to be under the
   [profit] banner") but this was never actually built — got sidetracked
   into the chart work. Currently still 4 separate sections
   (`#total-profit-result`, `#roi-result`, `#win-loss-result`,
   `#top-bets-result`). If picking this up: fold `#roi-banner`'s content
   into `#total-profit-banner` (or delete the ROI sentence and keep just
   its 4 chips under the profit banner), delete `#roi-result` as a
   separate `.result` card, renumber/adjust JS in
   `renderResultSummary.js`'s `makeROISection` accordingly.
2. Hover tooltip + crosshair on the line chart (see above).
3. Win/loss streak stats (see above).
4. A "biggest single loss" callout to pair with "Top 3 highest-earning
   bets" for symmetry — floated once, not pursued.

## How this was verified throughout

No test suite exists for this app. Every visual change in this session
was verified with a headless Chromium (`playwright-core`, launched
directly against the cached Playwright Chromium binary — see any
`verify-*.js` script for the exact executablePath pattern) driving the
real dev server, screenshotting both a wide (1400×900) and narrow
(390×844) viewport, and checking `console` for errors. Scratch verification
scripts live in the session's scratchpad dir (not in this repo) — none of
that tooling is committed, it was throwaway. If continuing this work,
worth spinning up the same pattern rather than eyeballing changes in a
real browser only.

## Nothing has been committed

All of the above is sitting as uncommitted changes on `sticky-app-header`.
Recommend reviewing `git diff --stat` and deciding on commit granularity
before it grows further — it's a big diff (~750 insertions in
`style.css` alone) and squashing into one commit vs. several logical ones
is a real decision, not just cleanup.
