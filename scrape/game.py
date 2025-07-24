#Game object must contain: 
#	"team": <team name (str)>
#	"seasonStartYear": <calendar year in which the season started (int)>
#	"gameNumber": <num of game within the season i.e. 1st game is 1, 2nd is 2, etc. (int)>
#   "date": <date of game (datetime)>
#   "outcome": <1 if team won, 0 if lost (int/bool)>
#   "winOdds": <moneyline (int)> 
#   "loseOdds": <moneyline (int)>
#   "opponent": <team name of opponent (str)>
class Game:
	def __init__(self, team=None, seasonStartYear= None, gameNumber=None, 
		outcome=None, winOdds=None, loseOdds=None, opponent=None):
		self.team = team
		self.seasonStartYear= seasonStartYear
		self.gameNumber = gameNumber
		self.outcome = outcome
		self.winOdds = winOdds
		self.loseOdds = loseOdds
		self.opponent = opponent

	def __str__(self):
		return f"Season: {self.seasonStartYear}-{(self.seasonStartYear + 1) % 100:02d}, Team: {self.team}, Opponent: {self.opponent}, Outcome: {self.outcome}, WinOdds: {self.winOdds}, LoseOdds: {self.loseOdds}, GameNumber: {self.gameNumber}"