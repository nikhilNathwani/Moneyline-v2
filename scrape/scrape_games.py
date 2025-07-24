from scraper import *
from game import Game

# Scrape game results and odds from NBA regular seasons
# Using oddsportal.com, which takes an average moneyline across many bookers

#Global variables
currentSeasonStartYear= 0
games= {}


def scrapeSeasons(firstStartYear, lastStartYear):
	for year in range(firstStartYear, lastStartYear+1):	
		games[year] = {}
		scrapeSeason(year)

def scrapeSeason(seasonStartYear):
	lastPageNum= getLastPageNum(seasonStartYear)
	for pageNum in range(1, lastPageNum+1):
		scrapeGamesFromPage(seasonStartYear, pageNum)
	# fixGameNumbers(gameObjectsFromSeason) #comment in scrapeGame() explains why
	print(f"Scraped {games} games from season {seasonStartYear}-{seasonStartYear+1}")	

def scrapeGamesFromPage(seasonStartYear, pageNum):
	url = makeUrl(seasonStartYear, pageNum)

	with OddsPortalScraper() as scraper:
		soup = scraper.makeSoup(url)
		gameRows = soup.find_all(class_="eventRow")
		isRegularSeasonNow= False
		for gameRow in gameRows:
			headerRow= getHeaderRow(gameRow) 
			if headerRow is not None:
				isRegularSeasonNow= isRegularSeason(headerRow)
			if isRegularSeasonNow:
				scrapeGame(gameRow, seasonStartYear)
	print(f"Scraped {games} games from page {pageNum} of season {seasonStartYear}-{seasonStartYear+1}")
	return games



# Given a table row (which corresponds to an NBA game), this function 
# returns a list [homeGame,awayGame], where 'homeGame' and 'awayGame' 
# are Game objects corresponding to each game: one object from the perspective 
# of the Home team, and one from the perspective of the Away team).
def scrapeGame(row, seasonStartYear):
	#reference the global teamGames variable
	global games

	# DONE self.team = team
	# self.seasonStartYear= seasonStartYear
	# self.gameNumber = gameNumber
	# DONE self.outcome = outcome
	# DONE self.winOdds = winOdds
	# DONE self.loseOdds = loseOdds
	# DONE self.opponent = opponent
	
	homeGame= Game()
	awayGame= Game()

	gameRow= row.select_one('[data-testid="game-row"]')

	odds_elements= gameRow.select('p[data-testid^="odd-container"]')
	teams= gameRow.select('p.participant-name')
	[homeTeam, awayTeam]= [ teams[0], teams[1] ]

	#Team names
	homeGame.team= homeTeam.text.strip()
	awayGame.team= awayTeam.text.strip()

	#Opponent names
	homeGame.opponent= awayTeam.text.strip()
	awayGame.opponent= homeTeam.text.strip()

	#Outcome: 1 if team won, 0 if lost
	homeGame.outcome= "winning" in odds_elements[0].get("data-testid", "")
	awayGame.outcome= "winning" in odds_elements[1].get("data-testid", "")

	#Odds: winOdds and loseOdds (both int)
	[homeWinOdds, awayWinOdds] = [int(odds.text.strip()) for odds in odds_elements]

	homeGame.winOdds= homeWinOdds
	homeGame.loseOdds= awayWinOdds

	awayGame.winOdds= awayWinOdds
	awayGame.loseOdds= homeWinOdds


	#SeasonStartYear
	homeGame.seasonStartYear= seasonStartYear
	awayGame.seasonStartYear= seasonStartYear

	#Add game to games dictionary for both teams
	for game in [homeGame, awayGame]:
		if game.team not in games[seasonStartYear]:
			games[seasonStartYear][game.team] = []
		games[seasonStartYear][game.team].append(game)

	print(f"Scraped home game: {str(homeGame)}")
	print(f"Scraped away game: {str(awayGame)}")	


# -------------------------------------------------------- 
#
#    Helper functions for scraping games
# 
# --------------------------------------------------------

def makeUrl(seasonStartYear, pageNum):
	return f"https://www.oddsportal.com/basketball/usa/nba-{seasonStartYear}-{seasonStartYear+1}/results/#/page/{pageNum}/"

# For pagination, get the last page number for a given season
def getLastPageNum(seasonStartYear):
	url= makeUrl(seasonStartYear, 1)
	with OddsPortalScraper() as scraper:
		soup = scraper.makeSoup(url)
		# Get last pagination element with data-number attribute
		pagination_links = soup.select('.pagination-link[data-number]')
		if pagination_links:
			last_link = pagination_links[-1]
			last_page_num = last_link.get('data-number')
			print(f"Last page number: {last_page_num}")
			return int(last_page_num)
		else:
			print("No pagination links found.")
			return None

def getHeaderRow(gameRow):
	subRows = gameRow.find_all('div', recursive=False)
	# ^recursive=False ensures only direct children are fetched
	if len(subRows) >= 2: #game includes date header
		return subRows[-2]
	else:
		return None
	
def isRegularSeason(headerRow):
	text = headerRow.get_text(strip=True)
	#date header has "[date] - [gameType]" for non-reg season games
	return "-" not in text 


#Reverse gameNumbers so that they're written in ascending chronological order.
def fixGameNumbers(gameObjects):
	for game in gameObjects:
		game.gameNumber= teamGames[game.team] - game.gameNumber + 1



if __name__ == '__main__':
	# gameObjects= scrapeSeasons(2016,2022)
	# endScrape()
	# con.close()
	# scrapeGamesFromPage(0, 0)
	# getLastPageNum(2024)
	scrapeSeasons(2024, 2024)