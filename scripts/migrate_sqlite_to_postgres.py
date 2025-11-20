"""
Migrate data from SQLite databases to Vercel Postgres database.

This script reads game data from SQLite files and inserts it into the Postgres database.
"""

import sqlite3
import psycopg2
import os
from dotenv import load_dotenv

# Load environment variables
load_dotenv('.env.development.local')

def get_postgres_connection():
    """Create connection to Vercel Postgres database."""
    return psycopg2.connect(os.getenv('POSTGRES_URL'))

def get_sqlite_data(sqlite_path, season_filter=None):
    """Extract all games from SQLite database."""
    conn = sqlite3.connect(sqlite_path)
    cursor = conn.cursor()
    
    # Get all games from the SQLite database (without opponent since Postgres doesn't have it)
    if season_filter:
        cursor.execute("""
            SELECT team, seasonStartYear, gameNumber, outcome, winOdds, loseOdds
            FROM games
            WHERE seasonStartYear = ?
            ORDER BY team, gameNumber
        """, (season_filter,))
    else:
        cursor.execute("""
            SELECT team, seasonStartYear, gameNumber, outcome, winOdds, loseOdds
            FROM games
            ORDER BY team, gameNumber
        """)
    
    games = cursor.fetchall()
    conn.close()
    
    return games

def insert_games_to_postgres(games, pg_conn):
    """Insert games into Postgres database."""
    cursor = pg_conn.cursor()
    
    # Check if games table exists and get its structure
    cursor.execute("""
        SELECT column_name 
        FROM information_schema.columns 
        WHERE table_name = 'games'
        ORDER BY ordinal_position
    """)
    columns = [row[0] for row in cursor.fetchall()]
    
    print(f"Postgres table columns: {columns}")
    
    # Insert each game
    inserted = 0
    skipped = 0
    
    for game in games:
        team, season, game_num, outcome, win_odds, lose_odds = game
        
        try:
            # Check if game already exists
            cursor.execute("""
                SELECT COUNT(*) FROM games 
                WHERE team = %s AND seasonstartyear = %s AND gamenumber = %s
            """, (team, season, game_num))
            
            if cursor.fetchone()[0] > 0:
                skipped += 1
                continue
            
            # Convert SQLite types to Postgres types
            # outcome: INTEGER (0/1) -> BOOLEAN
            # winOdds/loseOdds: INTEGER -> VARCHAR (with + sign for positive odds)
            outcome_bool = bool(outcome)
            
            # Format odds with + sign for positive values
            win_odds_str = f"+{win_odds}" if win_odds > 0 else str(win_odds)
            lose_odds_str = f"+{lose_odds}" if lose_odds > 0 else str(lose_odds)
            
            # Insert the game (without opponent column)
            cursor.execute("""
                INSERT INTO games (team, seasonstartyear, gamenumber, outcome, winodds, loseodds)
                VALUES (%s, %s, %s, %s, %s, %s)
            """, (team, season, game_num, outcome_bool, win_odds_str, lose_odds_str))
            
            inserted += 1
            
        except Exception as e:
            print(f"Error inserting game {team} #{game_num}: {e}")
            pg_conn.rollback()  # Rollback the failed transaction
            continue
    
    pg_conn.commit()
    cursor.close()
    
    return inserted, skipped

def main():
    """Main migration function."""
    print("="*80)
    print("SQLite to Postgres Migration Tool")
    print("="*80)
    
    # SQLite database files with season filters
    sqlite_files = [
        ('data/moneyline_22.db', '2022-23', 2022),
        ('data/moneyline_23.db', '2023-24', 2023),
        ('data/moneyline_24.db', '2024-25', 2024)
    ]
    
    # Connect to Postgres
    print("\nConnecting to Vercel Postgres...")
    pg_conn = get_postgres_connection()
    print("✓ Connected to Postgres")
    
    total_inserted = 0
    total_skipped = 0
    
    for sqlite_path, season_name, season_year in sqlite_files:
        if not os.path.exists(sqlite_path):
            print(f"\n⚠️  {sqlite_path} not found, skipping...")
            continue
        
        print(f"\n{'='*80}")
        print(f"Processing {season_name} season ({sqlite_path})")
        print(f"{'='*80}")
        
        # First, delete any existing games for this season
        cursor = pg_conn.cursor()
        print(f"Checking for existing {season_year} games in Postgres...")
        cursor.execute("SELECT COUNT(*) FROM games WHERE seasonstartyear = %s", (season_year,))
        existing_count = cursor.fetchone()[0]
        
        if existing_count > 0:
            print(f"⚠️  Found {existing_count} existing games for season {season_year}")
            print(f"Deleting existing {season_year} games...")
            cursor.execute("DELETE FROM games WHERE seasonstartyear = %s", (season_year,))
            pg_conn.commit()
            print(f"✓ Deleted {existing_count} existing games")
        else:
            print(f"✓ No existing games for season {season_year}")
        
        cursor.close()
        
        # Get data from SQLite
        print(f"Reading games from {sqlite_path} (season {season_year})...")
        games = get_sqlite_data(sqlite_path, season_year)
        print(f"✓ Found {len(games)} games")
        
        # Insert into Postgres
        print(f"Inserting games into Postgres...")
        inserted, skipped = insert_games_to_postgres(games, pg_conn)
        print(f"✓ Inserted: {inserted} games")
        print(f"✓ Skipped (duplicates): {skipped} games")
        
        total_inserted += inserted
        total_skipped += skipped
    
    pg_conn.close()
    
    print(f"\n{'='*80}")
    print("Migration Complete!")
    print(f"{'='*80}")
    print(f"Total inserted: {total_inserted} games")
    print(f"Total skipped: {total_skipped} games")
    print(f"{'='*80}\n")

if __name__ == "__main__":
    main()
