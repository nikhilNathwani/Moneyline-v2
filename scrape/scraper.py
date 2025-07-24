from bs4 import BeautifulSoup
from selenium import webdriver
from selenium.webdriver.chrome.options import Options
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
import time

class OddsPortalScraper:
	def __init__(self, headless=False):
		options = Options()
		if headless:
			options.add_argument("--headless=new")
			options.add_argument("--disable-gpu")
			options.add_argument("--no-sandbox")
		prefs= {
			"profile.managed_default_content_settings.images": 2,
			"profile.managed_default_content_settings.stylesheets": 2,
			"profile.managed_default_content_settings.fonts": 2,
		}
		options.add_experimental_option("prefs", prefs)
		
		self.driver = webdriver.Chrome(options=options)
		self.wait_time = 10
		
	def makeSoup(self, url, wait_selector='[data-testid="add-to-my-leagues-button"]'):
		self.driver.get(url)

		WebDriverWait(self.driver, self.wait_time).until(
			EC.presence_of_element_located((By.CSS_SELECTOR, wait_selector))
		)

		# Scroll to the bottom to trigger lazy loading
		self.scrollToBottom()

		html = self.driver.page_source
		soup = BeautifulSoup(html, "lxml")
		return soup


	def scrollToBottom(self):
		last_height = self.driver.execute_script("return document.body.scrollHeight")
		while True:
			self.driver.execute_script("window.scrollTo(0, document.body.scrollHeight);")
			time.sleep(1)  # Give time for more content to load
			
			new_height = self.driver.execute_script("return document.body.scrollHeight")
			if new_height == last_height:
				break	
			last_height = new_height
			

	def __enter__(self):
		return self

	def __exit__(self, exc_type, exc_value, traceback):
		self.driver.quit()
		

		if exc_type is not None:
			print("An exception occurred while scraping!")
			print("Type:", exc_type)
			print("Value:", exc_value)
			import traceback as tb
			tb.print_tb(traceback)  

		# return False to propagate the exception, or True to suppress it
		return False