SELECT * FROM games
LIMIT 10;


SELECT 
    *,
    CAST(REPLACE(winodds,'+','') AS INTEGER) AS winodds_int
FROM games
WHERE team = 'Boston Celtics'
ORDER BY winodds_int DESC
LIMIT 3;
