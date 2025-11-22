# Annual NBA Season Update Workflow

When a new NBA season ends and you want to add that year's data to your app.

## Quick Start

```bash
cd scrape
python3 main.py --seasons 2025
```

Replace `2025` with the season start year (e.g., for 2025-26 season, use 2025).

## What Happens

### Step 1: Scraping

-   Opens Chrome browser (or runs headless with `--headless` flag)
-   Navigates to OddsPortal.com NBA results pages
-   Scrapes all games for each team in the season
-   Saves to temporary SQLite file: `scrape/moneyline_XX.db`

### Step 2: Verification

Displays comprehensive stats for you to review:

```
📊 Total Games Scraped: 2460

📋 Games Per Team:
  Atlanta Hawks................................. 82 games
  Boston Celtics................................ 82 games
  [... all 30 teams ...]
```

**What to check:**

-   Total should be ~2,460 games (30 teams × 82 games)
-   Each team should have exactly 82 games

### Step 3: Confirmation

You'll be prompted:

```
Ready to migrate 2024-25 data to Vercel Postgres? (Y/n):
```

-   Review the stats above
-   Type `Y` and press Enter to proceed
-   Type `n` to cancel and investigate issues

### Step 4: Migration to Database

-   Deletes any existing data for this season in Postgres
-   Converts data types:
    -   `outcome`: INTEGER (0/1) → BOOLEAN
    -   `winOdds/loseOdds`: INTEGER → VARCHAR with +/- prefix
-   Inserts all games into production database
-   Shows count of inserted games
-   Deletes temporary SQLite file

### Step 5: Update Frontend

-   Adds the new season to the dropdown in the web app (via public/js/view/renderFilters.js)
-   Git commits and pushes the change automatically
-   Message: "Add 2024-25 season to web app"

### Step 6: Final Verification

Displays all seasons in your database:

```
📊 Games Per Season in Database:
  2016-17:......................................... 2460 games
  2017-18:......................................... 2460 games
  ...
  2025-26:......................................... 2460 games ✨ NEW
  ─────────────────────────────────────────────────────────
  TOTAL:........................................... 24600 games
```

## Options

```bash
# Run in headless mode (no browser window)
python3 main.py --seasons 2025 --headless

# Scrape multiple seasons at once
python3 main.py --seasons 2024 2025

# Scrape a range of seasons
python3 main.py --seasons 2020-2024

# Skip scraping, just verify and migrate existing SQLite file
python3 main.py --seasons 2025 --skip-scrape
```

## After Migration

1. **Check Vercel deployment** - Changes should auto-deploy, new season will appear in dropdown
2. **Test the web app** - Visit your site and verify the new season works correctly
3. **Check database** - Use the SQL scripts in `app/queries/sampleQueries.sql` if needed

## Troubleshooting

### Fewer than 2,460 games scraped

-   Check if regular season is actually complete
-   In-season tournament quarterfinals/semifinals are excluded (expected)
-   Some end-of-season games may not have odds on OddsPortal

### Invalid odds warnings

-   Review the specific games mentioned
-   May need to manually check those games on OddsPortal
-   Fix data in SQLite before migrating: `sqlite3 data/moneyline_XX.db`

### Migration fails

-   Check `.env.development.local` has valid `POSTGRES_URL`
-   Verify network connection to Vercel
-   Check error message for specific issue

### Browser automation issues

-   Make sure Chrome/Chromium is installed
-   Try without `--headless` flag to see what's happening
-   Check if OddsPortal changed their site structure (may need code updates)

## Prerequisites (One-time Setup)

### Python Packages

```bash
cd scrape
pip install -r requirements.txt
```

Required packages:

-   beautifulsoup4
-   selenium
-   lxml
-   psycopg2-binary
-   python-dotenv

### Chrome Browser

```bash
# macOS
brew install --cask chromedriver
```

### Environment File

Create `.env.development.local` in project root:

```
POSTGRES_URL=postgres://username:password@host/database
```

## Notes

-   **Timing**: Wait until regular season is completely finished
-   **In-Season Tournament**: Quarterfinal/semifinal games are excluded (this is noted in the app)
-   **Backups**: SQLite files serve as temporary storage; Postgres is the source of truth
-   **Idempotent**: Safe to re-run if something goes wrong (deletes old data first)
-   **Web App**: New season will automatically appear in dropdown after migration

## Need Help?

Check the main script for detailed error messages:

```bash
python3 main.py --help
```
