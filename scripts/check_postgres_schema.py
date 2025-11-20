"""Check Postgres database schema and existing data."""

import psycopg2
import os
from dotenv import load_dotenv

load_dotenv('.env.development.local')

# Connect to Postgres
conn = psycopg2.connect(os.getenv('POSTGRES_URL'))
cursor = conn.cursor()

# Check if games table exists
cursor.execute("""
    SELECT table_name 
    FROM information_schema.tables 
    WHERE table_schema = 'public'
""")

tables = cursor.fetchall()
print("Tables in database:")
for table in tables:
    print(f"  - {table[0]}")

# If games table exists, show its structure
cursor.execute("""
    SELECT column_name, data_type 
    FROM information_schema.columns 
    WHERE table_name = 'games'
    ORDER BY ordinal_position
""")

columns = cursor.fetchall()
if columns:
    print("\nGames table schema:")
    for col, dtype in columns:
        print(f"  {col}: {dtype}")
    
    # Count existing games by season
    cursor.execute("""
        SELECT seasonstartyear, COUNT(*) 
        FROM games 
        GROUP BY seasonstartyear 
        ORDER BY seasonstartyear
    """)
    
    seasons = cursor.fetchall()
    print("\nExisting games by season:")
    for season, count in seasons:
        print(f"  {season}-{season+1}: {count} games")
else:
    print("\nNo 'games' table found")

conn.close()
