"""
OddsPortal scraper for NBA moneyline data.

Scrapes game results and moneyline odds from OddsPortal.com for NBA regular seasons.
OddsPortal provides average moneyline odds across many bookmakers.

Created in November 2024. If OddsPortal changes their website structure, 
this scraper may need updates.
"""

from typing import List, Dict
from core.game import Game
from core.base_scraper import BaseScraper
from core.selenium_webdriver import SeleniumWebDriver
from oddsportal.helpers import makeUrl, getLastPageNum, getDateHeaderRow, isRegularSeason, scrapeGamesFromRow, reverseGameNumbers


class OddsPortalScraper(BaseScraper, SeleniumWebDriver):
    """
    Scraper for OddsPortal NBA moneyline data.
    
    Scrapes historical NBA game results with moneyline odds from oddsportal.com.
    Inherits WebDriver automation from SeleniumWebDriver for dynamic page handling.
    """
    
    # Initialize the OddsPortal scraper.
    def __init__(self, headless: bool = False):
        SeleniumWebDriver.__init__(self, headless)
    
    # Returns list of URLs for all pages of a season's results.
    def getSeasonScheduleLinks(self, seasonStartYear: int) -> List[str]:
        url = makeUrl(seasonStartYear, 1)
        self.loadWebPage(url)
        self.waitForElement('.pagination-link[data-number]')
        soup = self.makeSoup()
        lastPageNum = getLastPageNum(soup)
        return [makeUrl(seasonStartYear, pageNum) for pageNum in range(1, lastPageNum + 1)]
    
    # Scrapes all games from a single OddsPortal results page.
    def scrapeGamesFromPage(self, url: str, page_num: int,seasonStartYear: int, games: Dict[str, List[Game]]):
        # Launch oddsportal webpage
        self.loadWebPage(url)

        # Wait for the active pagination link to confirm page load
        self.waitForElement(f"a.pagination-link.active[data-number='{page_num}']")

        # Wait for "Add to My Leagues" button to confirm game table is loaded
        self.waitForElement('[data-testid="add-to-my-leagues-button"]')
        
        soup = self.makeSoup()        
        gameRows = soup.find_all(class_="eventRow")
        isRegularSeasonNow= False
        for gameRow in gameRows:
            dateHeaderRow= getDateHeaderRow(gameRow) 
            if dateHeaderRow is not None:
                isRegularSeasonNow= isRegularSeason(dateHeaderRow)
            if isRegularSeasonNow:
                scrapeGamesFromRow(gameRow, seasonStartYear, games, self.driver)
    
    # Scrapes all games for a season (with OddsPortal-specific handling).        
    def scrapeSeasonSchedule(self, seasonStartYear: int) -> Dict[str, List[Game]]:
        games = {}
        urls = self.getSeasonScheduleLinks(seasonStartYear)
        
        total_games_scraped = 0
        
        # Initialize driver once for the entire season
        self.initDriver()
        try:
            for i, url in enumerate(urls, start=1):
                print(f"Scraping page {i}/{len(urls)}...")
                games_before = sum(len(team_games) for team_games in games.values())
                self.scrapeGamesFromPage(url, i, seasonStartYear, games)
                games_after = sum(len(team_games) for team_games in games.values())
                games_on_page = games_after - games_before
                total_games_scraped += games_on_page
                print(f"  → {games_on_page} games scraped from page {i}")
        finally:
            self.quitDriver()
        
        print(f"\n{'='*60}")
        print(f"Total games scraped: {total_games_scraped}")
        print(f"Total game objects (2 per game): {sum(len(team_games) for team_games in games.values())}")
        print(f"Expected: 2460 games = 4920 game objects")
        print(f"{'='*60}\n")
        
        # Fix game numbers (OddsPortal lists games in reverse chronological order)
        reverseGameNumbers(games)
        
        return games
