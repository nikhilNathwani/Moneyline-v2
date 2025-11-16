"""
Abstract base class defining the interface for NBA moneyline data scrapers.

Any site-specific scraper must implement these methods to work with the main scraping orchestration.
"""

from abc import ABC, abstractmethod
from typing import List, Dict
import sys
import os
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
from game import Game


class BaseScraper(ABC):
    """Base class that defines the interface any moneyline scraper must implement."""
    
    @abstractmethod
    def getSeasonScheduleLinks(self, seasonStartYear: int) -> List[str]:
        """
        Returns list of URLs to scrape for a given season's game data.
        
        For sites with pagination, this should return one URL per page.
        For sites without pagination, this should return a single URL.
        
        Args:
            seasonStartYear (int): Calendar year in which the season started
                                  (e.g., 2023 for the 2023-24 season)
            
        Returns:
            List[str]: List of URLs to scrape for the season's games
        """
        pass
    
    @abstractmethod
    def scrapeGamesFromPage(self, url: str, seasonStartYear: int, games: Dict[str, List[Game]]):
        """
        Scrapes all games from a single URL and adds them to the games dictionary.
        
        Args:
            url (str): URL to scrape games from
            seasonStartYear (int): Calendar year in which the season started
            games (Dict[str, List[Game]]): Dictionary to accumulate games into.
                                          Maps team names to their list of Game objects.
        """
        pass
    
    def scrapeSeasonSchedule(self, seasonStartYear: int) -> Dict[str, List[Game]]:
        """
        Scrapes all games for a season by orchestrating the full scraping workflow.
        
        Default implementation:
        1. Gets all schedule URLs via getSeasonScheduleLinks()
        2. Scrapes games from each URL via scrapeGamesFromPage()
        3. Returns the accumulated games
        
        Override this method if you need:
        - Driver/session initialization and cleanup (e.g., Selenium)
        - Post-processing (e.g., fixing game numbers, sorting)
        - Progress logging for multi-page scraping
        - Custom error handling or retry logic
        
        Example override pattern:
            def scrapeSeasonSchedule(self, seasonStartYear: int) -> Dict[str, List[Game]]:
                games = {}
                urls = self.getSeasonScheduleLinks(seasonStartYear)
                
                self.initDriver()  # Setup
                try:
                    for url in urls:
                        self.scrapeGamesFromPage(url, seasonStartYear, games)
                finally:
                    self.quitDriver()  # Cleanup
                
                # Post-processing
                self._fixGameNumbers(games)
                return games
        
        Args:
            seasonStartYear (int): Calendar year in which the season started
            
        Returns:
            Dict[str, List[Game]]: Dictionary mapping team names to their list of Game objects
        """
        games = {}
        urls = self.getSeasonScheduleLinks(seasonStartYear)
        
        for url in urls:
            self.scrapeGamesFromPage(url, seasonStartYear, games)
        
        return games