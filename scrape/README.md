# NBA Moneyline Scraper

Scrapes NBA game results and moneyline odds from OddsPortal.com for data visualization and analysis.

## Architecture

This scraper follows a modular, object-oriented architecture with clear separation of concerns:

```
scrape/
├── game.py                      # Game data model
├── main.py                      # Orchestration script
├── selenium_scraper.py          # Selenium/BeautifulSoup base class
├── parsers/                     # Parser implementations
│   ├── base_parser.py          # Abstract base class defining parser interface
│   └── oddsportal_parser.py    # OddsPortal-specific implementation
└── utils/                       # Helper utilities
    └── export_data.py          # JSON/database export functions
```

### Components

-   **`game.py`**: Defines the `Game` class representing a single NBA game from one team's perspective, including outcome and moneyline odds.

-   **`selenium_scraper.py`**: Base class providing Selenium WebDriver functionality. Any parser that needs browser automation inherits from this to get `makeSoup()`, `scrollToBottom()`, etc. without reimplementing them.

-   **`parsers/base_parser.py`**: Abstract base class that defines the interface any scraper must implement. Ensures consistency across different data sources.

-   **`parsers/oddsportal_parser.py`**: Site-specific implementation for OddsPortal.com. Inherits from both `BaseParser` (interface) and `SeleniumScraper` (browser automation), focusing purely on parsing logic.

-   **`utils/export_data.py`**: Utilities for saving scraped data to JSON or SQLite database, plus verification functions.

-   **`main.py`**: Main orchestration script that coordinates scraping and data export.

## Setup

### Prerequisites

```bash
# Install Python dependencies
pip install beautifulsoup4 selenium lxml

# Install Chrome WebDriver (required for Selenium)
# macOS:
brew install --cask chromedriver

# Or download from: https://chromedriver.chromium.org/
```

## Usage

### Basic Usage

```bash
# Scrape specific seasons
python3 main.py --seasons 2022 2023 2024

# Scrape a range of seasons
python3 main.py --seasons 2022-2024

# Save to JSON
python3 main.py --seasons 2023 --output json

# Save to database instead of JSON
python3 main.py --seasons 2023 --output db

# Save to both JSON and database
python3 main.py --seasons 2023 2024 --output both

# Run in headless mode (no browser window)
python3 main.py --seasons 2023 --headless
```

### Examples

```bash
# Scrape 2023-24 and 2024-25 seasons, save as JSON
python3 main.py --seasons 2023 2024

# Scrape all seasons from 2022 through 2024, save to database
python3 main.py --seasons 2022-2024 --output db

# Scrape 2024-25 season in headless mode, save to both formats
python3 main.py --seasons 2024 --output both --headless
```

## Data Output

### JSON Format

Saved to `data/moneyline_data.json`:

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
      },
      ...
    ],
    "Celtics": [...]
  }
}
```

### Database Format

Saved to `data/moneyline.db` with the following schema:

```sql
CREATE TABLE games (
    team TEXT NOT NULL,
    seasonStartYear INTEGER NOT NULL,
    gameNumber INTEGER NOT NULL,
    outcome INTEGER NOT NULL,        -- 1 for win, 0 for loss
    winOdds INTEGER NOT NULL,
    loseOdds INTEGER NOT NULL,
    opponent TEXT NOT NULL,
    PRIMARY KEY (team, seasonStartYear, gameNumber)
);

-- Indexes for common queries
CREATE INDEX idx_team ON games(team);
CREATE INDEX idx_season ON games(seasonStartYear);
CREATE INDEX idx_team_season ON games(team, seasonStartYear);
```

## Adding New Data Sources

To add a new scraper for a different website:

1. Create a new parser class in `parsers/` (e.g., `parsers/espn_parser.py`)
2. Inherit from `BaseParser` for the interface and optionally `SeleniumScraper` if you need browser automation
3. Implement the required methods from `BaseParser`:
    - `scrapeSeasonGames(seasonStartYear)`: Scrape all games for a season
    - `getLastPageNum(seasonStartYear)`: Get pagination info (if applicable)
4. Update `main.py` to use the new parser

### Example with Selenium (for dynamic sites):

```python
from parsers.base_parser import BaseParser
from selenium_scraper import SeleniumScraper

class ESPNParser(BaseParser, SeleniumScraper):
    def __init__(self, headless: bool = False):
        SeleniumScraper.__init__(self, headless)

    def scrapeSeasonGames(self, seasonStartYear: int) -> Dict[str, List[Game]]:
        self.initDriver()
        try:
            # Use self.makeSoup(), self.scrollToBottom(), etc.
            url = f"https://espn.com/nba/{seasonStartYear}"
            soup = self.makeSoup(url, wait_selector=".game-list")
            # Parse the soup...
        finally:
            self.quitDriver()

    def getLastPageNum(self, seasonStartYear: int) -> int:
        return 1  # If no pagination
```

### Example without Selenium (for static sites):

```python
from parsers.base_parser import BaseParser
import requests
from bs4 import BeautifulSoup

class StaticParser(BaseParser):
    def scrapeSeasonGames(self, seasonStartYear: int) -> Dict[str, List[Game]]:
        url = f"https://example.com/nba/{seasonStartYear}"
        response = requests.get(url)
        soup = BeautifulSoup(response.content, "html.parser")
        # Parse the soup...

    def getLastPageNum(self, seasonStartYear: int) -> int:
        return 1
```

The `SeleniumScraper` base class provides these methods automatically:

-   `initDriver()` - Set up Chrome WebDriver
-   `quitDriver()` - Close the browser
-   `makeSoup(url, wait_selector)` - Load a page and return BeautifulSoup
-   `scrollToBottom()` - Scroll page to trigger lazy loading

## Data Model

Each `Game` object contains:

-   **`team`** (str): Team name
-   **`seasonStartYear`** (int): Calendar year the season started (e.g., 2023 for 2023-24 season)
-   **`gameNumber`** (int): Sequential game number within the season (1, 2, 3, ...)
-   **`outcome`** (bool): `True` if team won, `False` if lost
-   **`winOdds`** (int): Moneyline odds for this team winning
-   **`loseOdds`** (int): Moneyline odds for this team losing (opponent's winOdds)
-   **`opponent`** (str): Opponent team name

## Troubleshooting

### WebDriver Issues

If you get a "chromedriver not found" error:

```bash
# macOS
brew install --cask chromedriver

# Verify installation
which chromedriver
```

### Slow Scraping

The scraper intentionally waits for pages to load fully and scrolls to trigger lazy loading. This is necessary for complete data but can be slow. To speed up:

-   Use `--headless` flag
-   Scrape fewer seasons at once
-   Check your internet connection

### OddsPortal Website Changes

If the scraper stops working, OddsPortal may have changed their website structure. You'll need to:

1. Inspect the current website HTML structure
2. Update CSS selectors in `parsers/oddsportal_parser.py`
3. Update wait conditions if page loading changed

## Notes

-   OddsPortal shows **average** moneyline odds across multiple bookmakers
-   Only **regular season** games are scraped (playoffs excluded)
-   Games are stored from **each team's perspective** (2 Game objects per matchup)
-   Game numbers are assigned in **chronological order** (1 = first game of season)
