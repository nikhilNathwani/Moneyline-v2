# NBA Moneyline Scraper - Project Summary

## 🎯 What Was Built

A modular, extensible NBA moneyline data scraper following the same architecture pattern as the Todoist NBA Schedule Saver project. The scraper fetches game results and betting odds from OddsPortal.com.

## 📁 Project Structure

```
scrape/
├── README.md                    # Comprehensive documentation
├── MIGRATION.md                 # Migration guide from old scraper
├── requirements.txt             # Python dependencies
│
├── game.py                      # ✨ Game data model (updated)
├── main.py                      # ✨ NEW: Orchestration script with CLI
├── test_architecture.py         # ✨ NEW: Architecture verification tests
│
├── parsers/                     # ✨ NEW: Parser implementations
│   ├── __init__.py
│   ├── base_parser.py          # Abstract base class (like Todoist)
│   └── oddsportal_parser.py    # Site-specific implementation
│
├── utils/                       # ✨ NEW: Helper utilities
│   ├── __init__.py
│   └── export_data.py          # JSON/DB export + verification
│
└── [OLD FILES - DEPRECATED]
    ├── scraper.py              # ⚠️ Deprecated (functionality moved)
    └── scrape_games.py         # ⚠️ Deprecated (replaced by main.py)
```

## ✨ Key Features

### 1. Modular Architecture

-   **Abstract Base Class**: `BaseParser` defines the interface for any scraper
-   **Site-Specific Implementation**: `OddsPortalParser` implements OddsPortal.com scraping
-   **Easy Extension**: Add new data sources by implementing `BaseParser`

### 2. Command-Line Interface

```bash
# Simple and intuitive
python3 main.py --seasons 2022 2023 2024 --output json

# Range syntax
python3 main.py --seasons 2022-2024 --output both --headless
```

### 3. Multiple Export Formats

-   **JSON**: Structured data for web app consumption
-   **SQLite Database**: Optimized for queries with indexes
-   **Both**: Export to both formats simultaneously

### 4. Data Verification

-   Validates game number sequences
-   Checks outcome values
-   Verifies odds are in reasonable ranges
-   Reports errors with details

### 5. Comprehensive Documentation

-   `README.md`: Full usage guide and architecture explanation
-   `MIGRATION.md`: Migration guide from old scraper
-   Inline code documentation
-   Test script for verification

## 🚀 Quick Start

### Installation

```bash
# Install Python dependencies
pip install -r requirements.txt

# Install ChromeDriver (macOS)
brew install --cask chromedriver
```

### Usage

```bash
# Scrape 2023-24 and 2024-25 seasons
python3 main.py --seasons 2023 2024

# Scrape range of seasons, save to database
python3 main.py --seasons 2022-2024 --output db

# Run tests to verify architecture
python3 test_architecture.py
```

## 📊 Data Model

Each `Game` object represents one team's perspective of a game:

```python
{
    "team": "Lakers",              # Team name
    "seasonStartYear": 2023,       # Season start year
    "gameNumber": 1,               # Sequential game number
    "outcome": true,               # True = win, False = loss
    "winOdds": -150,              # Moneyline for this team
    "loseOdds": 130,              # Opponent's moneyline
    "opponent": "Warriors"         # Opponent team
}
```

## 🔄 Migration from Old Scraper

### Before (Old Way)

```python
# Edit scrape_games.py
if __name__ == '__main__':
    scrapeSeasons(2022, 2024)
```

### After (New Way)

```bash
python3 main.py --seasons 2022-2024 --output json
```

See `MIGRATION.md` for complete migration guide.

## 🧪 Architecture Pattern

Follows the same pattern as Todoist NBA Schedule Saver:

1. **Game Object**: Data model (`game.py`)
2. **Base Parser**: Abstract interface (`parsers/base_parser.py`)
3. **Site-Specific Parser**: Implementation (`parsers/oddsportal_parser.py`)
4. **Orchestration**: Main script (`main.py`)
5. **Utilities**: Helper functions (`utils/`)

This makes it easy to:

-   Add new data sources (just implement `BaseParser`)
-   Maintain code (clear separation of concerns)
-   Test components (each part is independent)
-   Extend functionality (add new parsers without breaking existing code)

## 📈 Output Examples

### JSON Output (`data/moneyline_data.json`)

```json
{
	"2023": {
		"Lakers": [
			{
				"team": "Lakers",
				"seasonStartYear": 2023,
				"gameNumber": 1,
				"outcome": true,
				"winOdds": -150,
				"loseOdds": 130,
				"opponent": "Warriors"
			}
		]
	}
}
```

### Database Schema

```sql
CREATE TABLE games (
    team TEXT NOT NULL,
    seasonStartYear INTEGER NOT NULL,
    gameNumber INTEGER NOT NULL,
    outcome INTEGER NOT NULL,
    winOdds INTEGER NOT NULL,
    loseOdds INTEGER NOT NULL,
    opponent TEXT NOT NULL,
    PRIMARY KEY (team, seasonStartYear, gameNumber)
);
```

## 🎓 What You Can Learn From This

This project demonstrates:

-   **Object-Oriented Design**: Abstract base classes and inheritance
-   **Separation of Concerns**: Parser, data model, and utilities separated
-   **CLI Design**: Argparse for user-friendly command-line interface
-   **Data Export**: Multiple output formats from same data
-   **Web Scraping**: Selenium + BeautifulSoup for dynamic pages
-   **Code Documentation**: Comprehensive README and inline docs
-   **Testing**: Architecture verification tests

## 🔮 Future Enhancements

Easy to add:

-   New data sources (ESPN, Basketball Reference, etc.)
-   Additional export formats (CSV, Parquet, etc.)
-   Data analysis utilities
-   Automated scheduling (cron jobs)
-   API endpoint for data access

## 📝 Files Created/Updated

### New Files (7)

1. `main.py` - Orchestration script
2. `parsers/base_parser.py` - Abstract base class
3. `parsers/oddsportal_parser.py` - OddsPortal implementation
4. `utils/export_data.py` - Export utilities
5. `README.md` - Documentation
6. `MIGRATION.md` - Migration guide
7. `test_architecture.py` - Tests
8. `requirements.txt` - Dependencies

### Updated Files (1)

1. `game.py` - Added `to_dict()` method and better docs

### Deprecated Files (2)

1. `scraper.py` - Moved to parsers
2. `scrape_games.py` - Replaced by main.py

## ✅ Ready to Use

The scraper is ready to use for scraping NBA seasons 2022-2024 (and beyond). Just run:

```bash
python3 main.py --seasons 2022 2023 2024
```

All data will be saved to `data/moneyline_data.json` and can be consumed by your web app!
