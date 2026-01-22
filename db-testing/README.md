# Database Testing Tools

Quick scripts and queries for testing the Vercel Postgres database.

## Files

- **test-queries.sql** - Example SQL queries for SQLTools extension
- **query_db.py** - Python script for quick database queries

## Usage

### SQLTools (VS Code Extension)

1. Connect: `Cmd+Shift+P` → "SQLTools: Connect" → "Vercel Postgres"
2. Open `test-queries.sql`
3. Click on a query
4. Press `Cmd+E Cmd+E` to run

### Python Script

```bash
python3 db-testing/query_db.py
```

Edit the query in the script as needed.

### Terminal (psql)

```bash
# Load environment variable
source .env.development.local

# Connect directly
psql $POSTGRES_URL
```
