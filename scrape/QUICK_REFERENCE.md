# Quick Reference Guide

## Setup (One-Time)

```bash
cd "/Users/nikhilnathwani/Documents/Projects/NBA Moneyline/scrape"

# Install dependencies
pip install -r requirements.txt

# Install ChromeDriver (macOS)
brew install --cask chromedriver
```

## Common Commands

### Scrape Recent Seasons (2022-2024)

```bash
python3 main.py --seasons 2022-2024
```

### Scrape Specific Seasons

```bash
python3 main.py --seasons 2023 2024
```

### Save to Database

```bash
python3 main.py --seasons 2023 --output db
```

### Save to Both JSON and Database

```bash
python3 main.py --seasons 2022-2024 --output both
```

### Run in Headless Mode (No Browser Window)

```bash
python3 main.py --seasons 2023 --headless
```

## Test the Architecture

```bash
python3 test_architecture.py
```

## Output Locations

-   **JSON**: `data/moneyline_data.json`
-   **Database**: `data/moneyline.db`

## Get Help

```bash
python3 main.py --help
```

## File Structure Quick Reference

```
scrape/
├── main.py              # Run this to scrape
├── game.py              # Game data model
├── parsers/
│   ├── base_parser.py          # Abstract interface
│   └── oddsportal_parser.py    # OddsPortal scraper
└── utils/
    └── export_data.py   # Save to JSON/DB

Documentation:
├── README.md            # Full documentation
├── MIGRATION.md         # Migration from old scraper
├── PROJECT_SUMMARY.md   # What was built
└── QUICK_REFERENCE.md   # This file
```

## Typical Workflow

1. **Update data for current season**:

    ```bash
    python3 main.py --seasons 2024 --output both
    ```

2. **Verify the data**:

    - Check `data/moneyline_data.json` was created
    - Check `data/moneyline.db` was created (if using --output both or db)

3. **Use in your web app**:
    - Your app can read from `data/moneyline_data.json`
    - Or query `data/moneyline.db` directly

## Troubleshooting

### "chromedriver not found"

```bash
brew install --cask chromedriver
```

### "Module not found"

```bash
pip install -r requirements.txt
```

### Scraper runs too slow

```bash
# Use headless mode
python3 main.py --seasons 2023 --headless
```

### Need more help?

See `README.md` for comprehensive documentation.
