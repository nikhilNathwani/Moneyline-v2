"""
Console output formatting utilities for the NBA Moneyline data pipeline.
"""

from typing import Dict


def print_verification_results(season: int, results: Dict):
    """Print scraped data verification results."""
    print(f"\n{'='*70}")
    print(f"VERIFICATION RESULTS - {season}-{(season+1)%100:02d} Season")
    print(f"{'='*70}\n")
    
    print(f"📊 Total Games Scraped: {results['total_games']}\n")
    
    print(f"📋 Games Per Team:")
    print(f"{'─'*70}")
    for team, count in results['team_counts']:
        print(f"  {team:.<50} {count:>3} games")
    print(f"{'─'*70}\n")


def print_postgres_verification(results: Dict):
    """Print Postgres database verification results."""
    print(f"\n{'='*70}")
    print(f"POSTGRES DATABASE VERIFICATION")
    print(f"{'='*70}\n")
    
    if 'error' in results:
        print(f"❌ Error connecting to database: {results['error']}\n")
        return
    
    print(f"📊 Games Per Season in Database:")
    print(f"{'─'*70}")
    total_games = 0
    for season, count in results['season_counts']:
        print(f"  {season}-{(season+1)%100:02d}:{'.'*(50-len(f'{season}-{(season+1)%100:02d}:'))} {count:>5} games")
        total_games += count
    print(f"{'─'*70}")
    print(f"  TOTAL:{'.'*55} {total_games:>5} games")
    print(f"{'─'*70}\n")
