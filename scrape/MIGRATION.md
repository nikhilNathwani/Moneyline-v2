# Migration Guide: Old Scraper → New Scraper

This document explains how to migrate from the old scraping scripts to the new modular architecture.

## What Changed?

### Old Structure (Deprecated)

```
scrape/
├── game.py           # Game object
├── scraper.py        # Selenium/BS4 wrapper
└── scrape_games.py   # Monolithic scraping script
```

### New Structure

```
scrape/
├── game.py                      # Updated Game object with to_dict()
├── main.py                      # New orchestration script
├── parsers/
│   ├── base_parser.py          # Abstract base class
│   └── oddsportal_parser.py    # Site-specific implementation
└── utils/
    └── export_data.py          # Data export utilities
```

## Key Improvements

1. **Separation of Concerns**: Parser logic is now separated from the scraping framework
2. **Extensibility**: Easy to add new data sources by implementing `BaseParser`
3. **Better Data Export**: Dedicated utilities for JSON and database export
4. **Command-Line Interface**: User-friendly CLI with argument parsing
5. **Data Verification**: Built-in verification functions
6. **Documentation**: Comprehensive README and inline documentation

## How to Use the New Scraper

Instead of running the old scripts, use the new `main.py`:

### Old Way (Deprecated)

```python
# In scrape_games.py, edit the main section:
if __name__ == '__main__':
    scrapeSeasons(2022, 2024)
```

### New Way

```bash
# Command-line interface - much easier!
python3 main.py --seasons 2022-2024 --output json

# Or specific seasons
python3 main.py --seasons 2022 2023 2024 --output both
```

## Migration Steps

1. **Install dependencies** (if not already installed):

    ```bash
    pip install -r requirements.txt
    ```

2. **Use the new CLI**:

    ```bash
    python3 main.py --seasons 2023 2024 --output json
    ```

3. **Data format is compatible**: The JSON output format matches the old structure, so your existing code should work with minimal changes.

## Old Files (Deprecated)

The following files are deprecated and kept for reference only:

-   `scraper.py` - Functionality moved to `parsers/oddsportal_parser.py`
-   `scrape_games.py` - Replaced by `main.py` + `parsers/oddsportal_parser.py`

**Do not use these files for new scraping.** They will be moved to an `archive/` folder in the future.

## Backward Compatibility

The new `Game` class is fully backward compatible with the old one, with these additions:

-   Added `to_dict()` method for JSON serialization
-   Better documentation
-   Consistent formatting

The data output format (JSON structure and database schema) remains the same, so existing analysis code should work without changes.

## Questions?

See `README.md` for full documentation on the new scraper architecture and usage.
