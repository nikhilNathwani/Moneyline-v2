"""
Selenium WebDriver automation utility.

Provides WebDriver functionality for scrapers that need to interact with
dynamic web pages. Handles driver setup, page loading, scrolling, etc.
"""

from bs4 import BeautifulSoup
from selenium import webdriver
from selenium.webdriver.chrome.options import Options
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
import time


class SeleniumWebDriver:
    """
    Utility class providing Selenium WebDriver automation.
    
    Scrapers that need to interact with dynamic pages can inherit from this
    to get WebDriver capabilities without reimplementing them.
    """
    
    def __init__(self, headless: bool = False):
        """
        Initialize the Selenium WebDriver utility.
        
        Args:
            headless (bool): If True, run Chrome in headless mode
        """
        self.headless = headless
        self.wait_time = 10
        self.driver = None
    
    def initDriver(self):
        """Initialize Selenium WebDriver with optimized settings."""
        if self.driver is not None:
            return self.driver
            
        options = Options()
        if self.headless:
            options.add_argument("--headless=new")
            options.add_argument("--disable-gpu")
            options.add_argument("--no-sandbox")
        
        # Disable images, stylesheets, and fonts for faster loading
        prefs = {
            "profile.managed_default_content_settings.images": 2,
            "profile.managed_default_content_settings.stylesheets": 2,
            "profile.managed_default_content_settings.fonts": 2,
        }
        options.add_experimental_option("prefs", prefs)
        
        self.driver = webdriver.Chrome(options=options)

        # --- IMPORTANT: Disable browser cache so single-page-apps (SPAs) fully reload ---
        self.driver.execute_cdp_cmd("Network.enable", {})
        self.driver.execute_cdp_cmd("Network.setCacheDisabled", {"cacheDisabled": True})

        return self.driver
    
    def quitDriver(self):
        """Close the WebDriver if it's open."""
        if self.driver is not None:
            self.driver.quit()
            self.driver = None
    
    def loadWebPage(self, url: str):
        """
        Load a web page using the WebDriver.
        
        Args:
            url (str): URL of the page to load
        """
        if self.driver is None:
            self.initDriver()
            
        self.driver.get(url)

        # --- IMPORTANT: Force a TRUE network reload to defeat Vue router caching ---
        self.driver.execute_script("location.reload(true);")
        
        time.sleep(4)

        # Scroll to load all lazy-loaded content
        self.scrollToBottom()   


    def makeSoup(self) -> BeautifulSoup:
        """
        Load a page and return BeautifulSoup object.
        
        Args:
            url (str): URL to load
            wait_selector (str): CSS selector to wait for before parsing (optional)
            
        Returns:
            BeautifulSoup: Parsed HTML content
        """
        html = self.driver.page_source
        return BeautifulSoup(html, "lxml")
    
    # def scrollToBottom(self):
    #     """
    #     Scroll to bottom of page to trigger lazy loading.
        
    #     Useful for pages that load content dynamically as you scroll.
    #     """
    #     if self.driver is None:
    #         raise RuntimeError("Driver not initialized. Call initDriver() first.")
            
    #     last_height = self.driver.execute_script("return document.body.scrollHeight")
    #     while True:
    #         self.driver.execute_script("window.scrollTo(0, document.body.scrollHeight);")
    #         time.sleep(1)
            
    #         new_height = self.driver.execute_script("return document.body.scrollHeight")
    #         if new_height == last_height:
    #             break
    #         last_height = new_height

    def scrollToBottom(self):
        """
        Scroll to bottom of page to trigger lazy loading.
        
        Scrolls in increments to ensure lazy-loaded content is triggered.
        Useful for pages that load content dynamically as you scroll.
        """
        if self.driver is None:
            raise RuntimeError("Driver not initialized. Call initDriver() first.")
        
        # Get initial page height
        last_height = self.driver.execute_script("return document.body.scrollHeight")
        
        # Scroll in smaller increments to trigger lazy loading
        current_position = 0
        scroll_increment = 200  # pixels to scroll at a time
        
        while current_position < last_height:
            # Scroll down by increment
            current_position += scroll_increment
            self.driver.execute_script(f"window.scrollTo(0, {current_position});")
            time.sleep(1.5)  # Wait for content to load
            
            # Check if page height increased (new content loaded)
            new_height = self.driver.execute_script("return document.body.scrollHeight")
            if new_height > last_height:
                last_height = new_height
        
        # Final scroll to absolute bottom
        self.driver.execute_script("window.scrollTo(0, document.body.scrollHeight);")
        time.sleep(2)


    def waitForElement(self, css_selector: str):
        """
        Wait for an element to be present on the page.
        
        Args:
            css_selector (str): CSS selector of the element to wait for
        """
        if self.driver is None:
            raise RuntimeError("Driver not initialized. Call initDriver() first.")
        
        WebDriverWait(self.driver, self.wait_time).until(
            EC.presence_of_element_located((By.CSS_SELECTOR, css_selector))
        )
        time.sleep(2) #Additional wait to ensure content is fully loaded
