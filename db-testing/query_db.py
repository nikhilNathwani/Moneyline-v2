#!/usr/bin/env python3
"""
Quick database query tester.
Usage: python3 query_db.py
"""

import os
import sys
import psycopg2
from dotenv import load_dotenv

# Load environment variables
env_path = os.path.join(os.path.dirname(os.path.dirname(__file__)), '.env.development.local')
load_dotenv(env_path)

def run_query(query):
    """Execute query and print results."""
    try:
        conn = psycopg2.connect(os.getenv('POSTGRES_URL'))
        cursor = conn.cursor()
        
        cursor.execute(query)
        
        # Get column names
        columns = [desc[0] for desc in cursor.description]
        print("\t".join(columns))
        print("-" * 80)
        
        # Print rows
        for row in cursor.fetchall():
            print("\t".join(str(val) for val in row))
        
        conn.close()
        
    except Exception as e:
        print(f"❌ Error: {e}")


if __name__ == "__main__":
    # Example query - modify as needed
    query = """
        SELECT 
            seasonStartYear,
            COUNT(*) as game_count
        FROM games
        GROUP BY seasonStartYear
        ORDER BY seasonStartYear;
    """
    
    print("Running query...")
    run_query(query)
