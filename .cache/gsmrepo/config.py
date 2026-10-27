"""
Configuration file for GSMArena Scraper
"""

# ScraperAPI Configuration
SCRAPERAPI_KEY = "8a287981e97fdcbd2e37bf9b1ebef951"

# Scraping Configuration
REQUEST_DELAY = 2  # seconds between requests (increased to avoid rate limiting)
MAX_RETRIES = 3
BACKOFF_FACTOR = 2
TIMEOUT = 30

# Rate limiting strategy
USE_SCRAPERAPI_FIRST = False  # Start with direct requests, switch to ScraperAPI only when rate limited
MAX_API_CALLS = 3000  # ScraperAPI limit

# Data Configuration
DATA_DIR = "data"
LOG_FILE = "scraper.log"

# GSMArena URLs
BASE_URL = "https://www.gsmarena.com"
MAKERS_URL = "https://www.gsmarena.com/makers.php3"

# Top brands to prioritize (in order of preference)
TOP_BRANDS = [
    "Samsung", "Apple", "Xiaomi", "Oppo", "Vivo", 
    "Realme", "OnePlus", "Google", "Huawei", "Honor",
    "Motorola", "Nokia", "Nothing"
]
