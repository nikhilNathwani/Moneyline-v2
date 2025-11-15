"""
OddsPortal scraper for NBA moneyline data.

Scrapes game results and moneyline odds from OddsPortal.com for NBA regular seasons.
OddsPortal provides average moneyline odds across many bookmakers.

Created in November 2024. If OddsPortal changes their website structure, 
this scraper may need updates.
"""

from typing import List, Dict
import sys
import os

# Add parent directory to path for imports
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
from game import Game
from scrapers.base_scraper import BaseScraper
from selenium_webdriver import SeleniumWebDriver


class OddsPortalScraper(BaseScraper, SeleniumWebDriver):
    """
    Scraper for OddsPortal NBA moneyline data.
    
    Scrapes historical NBA game results with moneyline odds from oddsportal.com.
    Inherits WebDriver automation from SeleniumWebDriver for dynamic page handling.
    """
    
    def __init__(self, headless: bool = False):
        """
        Initialize the OddsPortal scraper.
        
        Args:
            headless (bool): If True, run Chrome in headless mode
        """
        SeleniumWebDriver.__init__(self, headless)
    
    def getSeasonScheduleLinks(self, seasonStartYear: int) -> List[str]:
        """
        Returns list of URLs for all pages of a season's results.
        
        OddsPortal uses pagination, so this returns one URL per page.
        
        Args:
            seasonStartYear (int): Calendar year in which the season started
            
        Returns:
            List[str]: List of URLs to scrape for the season's games
        """
        lastPageNum = self._getLastPageNum(seasonStartYear)
        return [self._makeUrl(seasonStartYear, pageNum) for pageNum in range(1, lastPageNum + 1)]
    
    def scrapeGames(self, url: str, seasonStartYear: int, games: Dict[str, List[Game]]):
        """
        Scrapes all games from a single OddsPortal results page.
        
        Args:
            url (str): URL to scrape games from
            seasonStartYear (int): Calendar year in which the season started
            games (Dict[str, List[Game]]): Dictionary to accumulate games into
        """
        soup = self.makeSoup(url, wait_selector='[data-testid="add-to-my-leagues-button"]')
        
        # Scroll to load all lazy-loaded content
        self.scrollToBottom()
        
        # Get fresh soup after scrolling
        from bs4 import BeautifulSoup
        soup = BeautifulSoup(self.driver.page_source, "lxml")
        
        gameRows = soup.find_all(class_="eventRow")
        isRegularSeasonNow = False
        
        for gameRow in gameRows:
            headerRow = self._getHeaderRow(gameRow)
            if headerRow is not None:
                isRegularSeasonNow = self._isRegularSeason(headerRow)
            
            if isRegularSeasonNow:
                self._scrapeGame(gameRow, seasonStartYear, games)
    
    def scrapeSeasonSchedule(self, seasonStartYear: int) -> Dict[str, List[Game]]:
        """
        Scrapes all games for a season with OddsPortal-specific handling.
        
        Handles:
        - Driver initialization/cleanup
        - Pagination through all result pages
        - Fixing game numbers (OddsPortal lists in reverse chronological order)
        
        Args:
            seasonStartYear (int): Calendar year in which the season started
            
        Returns:
            Dict[str, List[Game]]: Dictionary mapping team names to their list of Game objects
        """
        games = {}
        urls = self.getSeasonScheduleLinks(seasonStartYear)
        
        # Initialize driver once for the entire season
        self.initDriver()
        try:
            for i, url in enumerate(urls, start=1):
                print(f"Scraping page {i}/{len(urls)}...")
                self.scrapeGames(url, seasonStartYear, games)
        finally:
            self.quitDriver()
        
        # Fix game numbers (OddsPortal lists games in reverse chronological order)
        self._fixGameNumbers(games)
        
        return games
    
    def _fixGameNumbers(self, games: Dict[str, List[Game]]):
        """
        Fix game numbers to be in chronological order.
        
        OddsPortal lists games in reverse chronological order, so we reverse
        and renumber them.
        
        Args:
            games (Dict[str, List[Game]]): Dictionary of team games to fix
        """
        for team, team_games in games.items():
            # Reverse the list so it's in chronological order
            team_games.reverse()
            # Assign game numbers
            for i, game in enumerate(team_games, start=1):
                game.gameNumber = i
    
    def _getLastPageNum(self, seasonStartYear: int) -> int:
        """
        Get the last page number for pagination (internal method).
        
        Args:
            seasonStartYear (int): Calendar year in which the season started
            
        Returns:
            int: Last page number for the season's results
        """
        url = self._makeUrl(seasonStartYear, 1)
        soup = self.makeSoup(url, wait_selector='[data-testid="add-to-my-leagues-button"]')
        
        # Get last pagination element with data-number attribute
        pagination_links = soup.select('.pagination-link[data-number]')
        if pagination_links:
            last_link = pagination_links[-1]
            last_page_num = int(last_link.get('data-number'))
            print(f"Last page number for {seasonStartYear}-{seasonStartYear+1}: {last_page_num}")
            return last_page_num
        else:
            print(f"No pagination links found for {seasonStartYear}-{seasonStartYear+1}, defaulting to 1 page")
            return 1
    
    def _scrapeGame(self, row, seasonStartYear: int, games: Dict[str, List[Game]]):
        """
        Scrape a single game from a table row and add to games dictionary.
        
        Creates two Game objects (one for each team's perspective) and adds them
        to the games dictionary.
        
        Args:
            row: BeautifulSoup element representing the game row
            seasonStartYear (int): Calendar year in which the season started
            games (Dict[str, List[Game]]): Dictionary to add games to
        """
        gameRow = row.select_one('[data-testid="game-row"]')
        
        # Extract odds elements and team names
        odds_elements = gameRow.select('p[data-testid^="odd-container"]')
        teams = gameRow.select('p.participant-name')
        homeTeamName = teams[0].text.strip()
        awayTeamName = teams[1].text.strip()
        
        # Parse outcomes and odds
        homeWon = "winning" in odds_elements[0].get("data-testid", "")
        awayWon = "winning" in odds_elements[1].get("data-testid", "")
        homeWinOdds = int(odds_elements[0].text.strip())
        awayWinOdds = int(odds_elements[1].text.strip())
        
        # Create game objects (gameNumber will be set later during post-processing)
        homeGame = Game(
            team=homeTeamName,
            opponent=awayTeamName,
            outcome=homeWon,
            winOdds=homeWinOdds,
            loseOdds=awayWinOdds,
            seasonStartYear=seasonStartYear
        )
        
        awayGame = Game(
            team=awayTeamName,
            opponent=homeTeamName,
            outcome=awayWon,
            winOdds=awayWinOdds,
            loseOdds=homeWinOdds,
            seasonStartYear=seasonStartYear
        )
        
        # Add games to dictionary (game numbers will be set later)
        for game in [homeGame, awayGame]:
            if game.team not in games:
                games[game.team] = []
            games[game.team].append(game)
    
    def _makeUrl(self, seasonStartYear: int, pageNum: int) -> str:
        """
        Construct URL for a given season and page number.
        
        Args:
            seasonStartYear (int): Calendar year in which the season started
            pageNum (int): Page number
            
        Returns:
            str: Full URL to the results page
        """
        return f"https://www.oddsportal.com/basketball/usa/nba-{seasonStartYear}-{seasonStartYear+1}/results/#/page/{pageNum}/"
    
    def _getHeaderRow(self, gameRow):
        """
        Extract header row from a game row element.
        
        Args:
            gameRow: BeautifulSoup element
            
        Returns:
            Header row element or None
        """
        subRows = gameRow.find_all('div', recursive=False)
        if len(subRows) >= 2:  # Game includes date header
            return subRows[-2]
        else:
            return None
    
    def _isRegularSeason(self, headerRow) -> bool:
        """
        Determine if games under this header are regular season games.
        
        Args:
            headerRow: BeautifulSoup element representing the header
            
        Returns:
            bool: True if regular season, False otherwise
        """
        text = headerRow.get_text(strip=True)
        # Date header has "[date] - [gameType]" for non-regular season games
        return "-" not in text
