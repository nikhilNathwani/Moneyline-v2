-- Team Records Query:
--      Win-loss record for every team in a given season
-- Parameters:
--      $1 = seasonStartYear
--
-- Sample Output:
--      team              | wins | losses
--      ------------------|------|-------
--      Boston Celtics    |  56  |   26

SELECT
	team,
	COUNT(*) FILTER (WHERE outcome = true) AS wins,
	COUNT(*) FILTER (WHERE outcome = false) AS losses
FROM games
WHERE seasonstartyear = CAST($1 AS integer)
GROUP BY team
ORDER BY team;
