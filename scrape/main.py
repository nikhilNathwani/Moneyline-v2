"""
NBA Moneyline Data Scraper

Scrapes NBA game results and moneyline odds from OddsPortal.com and saves to JSON/database.

Usage:
    python3 main.py --seasons 2022 2023 2024    # Scrape specific seasons
    python3 main.py --seasons 2022-2024         # Scrape range of seasons
    python3 main.py --output json               # Save as JSON (default)
    python3 main.py --output db                 # Save to SQLite database
    
Examples:
    # Scrape 2023-24 and 2024-25 seasons, save as JSON
    python3 main.py --seasons 2023 2024
    
    # Scrape all seasons from 2022 through 2024
    python3 main.py --seasons 2022-2024 --output json
"""

import os
import sys
import argparse
from typing import List
from scrapers.oddsportal_scraper import OddsPortalScraper
from utils.export_data import save_to_json, save_to_database


# Define output paths
PROJECT_ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
DATA_DIR = os.path.join(PROJECT_ROOT, "data")
JSON_PATH = os.path.join(DATA_DIR, "moneyline_data.json")
DB_PATH = os.path.join(DATA_DIR, "moneyline.db")


def parse_seasons(seasons_arg: List[str]) -> List[int]:
    """
    Parse season arguments into list of season start years.
    
    Args:
        seasons_arg: List of season arguments (e.g., ['2022', '2023'] or ['2022-2024'])
        
    Returns:
        List[int]: List of season start years
    """
    seasons = []
    for arg in seasons_arg:
        if '-' in arg:
            # Range format: "2022-2024"
            start, end = arg.split('-')
            seasons.extend(range(int(start), int(end) + 1))
        else:
            # Single season
            seasons.append(int(arg))
    
    return sorted(list(set(seasons)))  # Remove duplicates and sort


def main():
    arg_parser = argparse.ArgumentParser(
        description='Scrape NBA moneyline data from OddsPortal.com',
        formatter_class=argparse.RawDescriptionHelpFormatter,
        epilog=__doc__
    )
    arg_parser.add_argument(
        '--seasons',
        nargs='+',
        required=True,
        help='Season start years to scrape (e.g., 2022 2023 or 2022-2024)'
    )
    arg_parser.add_argument(
        '--output',
        choices=['json', 'db', 'both'],
        default='json',
        help='Output format: json, db (SQLite), or both (default: json)'
    )
    arg_parser.add_argument(
        '--headless',
        action='store_true',
        help='Run browser in headless mode'
    )
    
    args = arg_parser.parse_args()
    
    # Parse seasons
    seasons = parse_seasons(args.seasons)
    print(f"🏀 NBA Moneyline Scraper")
    print(f"Scraping seasons: {', '.join(f'{s}-{(s+1)%100:02d}' for s in seasons)}\n")
    
    # Initialize scraper
    scraper = OddsPortalScraper(headless=args.headless)
    
    # Scrape all seasons
    all_games = {}
    for season in seasons:
        print(f"\n{'='*60}")
        print(f"Scraping {season}-{(season+1)%100:02d} season...")
        print(f"{'='*60}\n")
        
        season_games = scraper.scrapeSeasonSchedule(season)
        
        print(f"\n✅ Scraped {season}-{(season+1)%100:02d} season: "
              f"{len(season_games)} teams, {sum(len(team_games) for team_games in season_games.values())} total games")
        
        all_games[season] = season_games
    
    # Print summary
    print(f"\n{'='*60}")
    print(f"SCRAPING COMPLETE")
    print(f"{'='*60}")
    total_games = sum(
        len(team_games) 
        for season_data in all_games.values() 
        for team_games in season_data.values()
    )
    print(f"Total seasons scraped: {len(seasons)}")
    print(f"Total games scraped: {total_games}")
    
    # Save data
    print(f"\n{'='*60}")
    print(f"SAVING DATA")
    print(f"{'='*60}\n")
    
    if args.output in ['json', 'both']:
        save_to_json(all_games, JSON_PATH)
        print(f"✅ Saved JSON to: {JSON_PATH}")
    
    if args.output in ['db', 'both']:
        save_to_database(all_games, DB_PATH)
        print(f"✅ Saved database to: {DB_PATH}")
    
    print(f"\n{'='*60}")
    print(f"✅ ALL DONE!")
    print(f"{'='*60}\n")


if __name__ == "__main__":
    main()
