#!/usr/bin/env python3
"""
GSMArena Web Scraper using ScraperAPI
Scrapes device information from GSMArena with rate limiting protection
"""

import os
import json
import re
import time
import sqlite3
import argparse
import logging
from pathlib import Path
from typing import Dict, List, Optional, Tuple, Any
from urllib.parse import urljoin, urlparse
import unicodedata

import requests
from bs4 import BeautifulSoup
from tqdm import tqdm

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(levelname)s - %(message)s',
    handlers=[
        logging.FileHandler('scraper.log'),
        logging.StreamHandler()
    ]
)
logger = logging.getLogger(__name__)


class GSMArenaScraperAPI:
    """GSMArena scraper using ScraperAPI for rate limiting protection"""
    
    def __init__(self, api_key: str, data_dir: str = "data"):
        self.api_key = api_key
        self.data_dir = Path(data_dir)
        self.base_url = "https://www.gsmarena.com"
        self.scraperapi_url = "http://api.scraperapi.com"
        self.session = requests.Session()
        
        # Set user agent to appear as regular browser
        self.session.headers.update({
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/119.0.0.0 Safari/537.36',
            'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
            'Accept-Language': 'en-US,en;q=0.5',
            'Accept-Encoding': 'gzip, deflate',
            'Connection': 'keep-alive',
            'Upgrade-Insecure-Requests': '1',
        })
        
        # Create data directory
        self.data_dir.mkdir(exist_ok=True)
        
        # Initialize in-memory index
        self.brand_index = {}
        self.device_index = {}
        
        # Load existing index if available
        self.load_index()
        
        # Request configuration
        self.request_delay = 2  # seconds between requests (increased for rate limit prevention)
        self.max_retries = 3
        self.backoff_factor = 2
        self.use_scraperapi = False  # Start with direct requests
        self.rate_limited_count = 0  # Track consecutive rate limits
        self.api_calls_used = 0  # Track ScraperAPI usage
        
        # IP session management
        self.current_ip_session = None
        self.current_ip_requests = 0
        self.ip_rate_limited = False
        self.max_requests_per_ip = 30  # Conservative limit before switching IP
        self.scraperapi_session = requests.Session()  # Separate session for ScraperAPI
    
    def get_api_usage_stats(self) -> Dict[str, Any]:
        """Get API usage statistics"""
        return {
            'scraperapi_calls_used': self.api_calls_used,
            'scraperapi_calls_remaining': max(0, 3000 - self.api_calls_used),
            'using_scraperapi': self.use_scraperapi,
            'rate_limited_count': self.rate_limited_count,
            'current_delay': self.request_delay,
            'current_ip_requests': self.current_ip_requests,
            'max_requests_per_ip': self.max_requests_per_ip,
            'ip_rate_limited': self.ip_rate_limited
        }
    
    def log_api_usage(self):
        """Log current API usage"""
        stats = self.get_api_usage_stats()
        logger.info(f"API Usage: {stats['scraperapi_calls_used']}/3000 calls used, "
                   f"Mode: {'ScraperAPI' if stats['using_scraperapi'] else 'Direct'}")
    
    def slugify(self, text: str) -> str:
        """Convert text to a filesystem-safe slug with proper variant handling"""
        # Normalize unicode characters
        text = unicodedata.normalize('NFKD', text)
        # Remove non-ascii characters
        text = text.encode('ascii', 'ignore').decode('ascii')
        
        # Convert to lowercase for processing
        slug = text.lower()
        
        # Handle Samsung prefix consistency for Samsung devices
        if slug.startswith('samsung '):
            slug = slug[8:]  # Remove 'samsung ' prefix temporarily
        
        # Handle special variant symbols BEFORE removing special characters
        slug = slug.replace('+', '_plus')
        
        # Handle other common variants
        slug = slug.replace(' ultra', '_ultra')
        slug = slug.replace(' fe', '_fe')
        slug = slug.replace(' pro', '_pro')
        slug = slug.replace(' max', '_max')
        slug = slug.replace(' mini', '_mini')
        slug = slug.replace(' lite', '_lite')
        slug = slug.replace(' edge', '_edge')
        slug = slug.replace(' note', '_note')
        
        # Replace spaces and hyphens with underscores
        slug = slug.replace(' ', '_').replace('-', '_')
        
        # Remove special characters except underscores
        slug = re.sub(r'[^\w_]', '', slug)
        
        # Remove multiple consecutive underscores
        slug = re.sub(r'_+', '_', slug)
        
        # Remove leading/trailing underscores
        slug = slug.strip('_')
        
        # Add samsung prefix back for Samsung devices (check original text)
        if text.lower().startswith('samsung ') or 'galaxy' in text.lower():
            if not slug.startswith('samsung_'):
                slug = f'samsung_{slug}'
        
        return slug
    
    def make_request(self, url: str, retries: int = None) -> Optional[requests.Response]:
        """Make a request with intelligent IP session management"""
        if retries is None:
            retries = self.max_retries
        
        # First, try direct request if not using ScraperAPI
        if not self.use_scraperapi:
            return self._make_direct_request(url, retries)
        else:
            return self._make_scraperapi_request(url, retries)
        
        logger.error(f"Failed to fetch {url} after {retries + 1} attempts")
        return None
    
    def _make_direct_request(self, url: str, retries: int) -> Optional[requests.Response]:
        """Make direct request to GSMArena"""
        for attempt in range(retries + 1):
            try:
                response = self.session.get(url, timeout=30)
                
                if response.status_code == 200:
                    time.sleep(self.request_delay)
                    return response
                elif response.status_code == 429:  # Rate limited
                    logger.warning(f"Direct request rate limited. Switching to ScraperAPI.")
                    self.use_scraperapi = True
                    self.rate_limited_count += 1
                    return self._make_scraperapi_request(url, retries - attempt)
                elif response.status_code == 403:  # Blocked
                    logger.warning(f"Direct request blocked (403). Switching to ScraperAPI.")
                    self.use_scraperapi = True
                    return self._make_scraperapi_request(url, retries - attempt)
                else:
                    logger.warning(f"Direct request failed with status {response.status_code}")
                    
            except requests.exceptions.RequestException as e:
                logger.warning(f"Direct request error: {e}")
                if attempt == retries:
                    logger.info("Direct requests failing, switching to ScraperAPI")
                    self.use_scraperapi = True
                    return self._make_scraperapi_request(url, 1)
                
                wait_time = self.backoff_factor ** attempt
                time.sleep(wait_time)
        
        return None
    
    def _make_scraperapi_request(self, url: str, retries: int) -> Optional[requests.Response]:
        """Make request through ScraperAPI with IP session management"""
        # Check if we need a new IP session (only when necessary)
        if (self.current_ip_session is None or self.ip_rate_limited):
            self._get_new_ip_session()
        # Check if we've hit the request limit for this IP
        elif self.current_ip_requests >= self.max_requests_per_ip:
            logger.info(f"IP session limit reached ({self.current_ip_requests} requests). Getting new IP...")
            self._get_new_ip_session()
        
        for attempt in range(retries + 1):
            try:
                params = {
                    'api_key': self.api_key,
                    'url': url,
                    'render': 'false',
                    'country_code': 'us'
                }
                
                # Use the current IP session
                response = self.scraperapi_session.get(
                    self.scraperapi_url,
                    params=params,
                    timeout=30
                )
                
                self.api_calls_used += 1
                self.current_ip_requests += 1
                
                if response.status_code == 200:
                    self.ip_rate_limited = False  # Reset rate limit flag
                    time.sleep(self.request_delay)
                    logger.debug(f"ScraperAPI success: IP used {self.current_ip_requests}/{self.max_requests_per_ip} times, API calls: {self.api_calls_used}")
                    return response
                elif response.status_code == 429:  # Rate limited on this IP
                    logger.warning(f"ScraperAPI IP rate limited after {self.current_ip_requests} requests. Getting new IP...")
                    self.ip_rate_limited = True
                    self._get_new_ip_session()
                    # Don't count this as a retry, just try with new IP
                    continue
                else:
                    logger.warning(f"ScraperAPI returned status {response.status_code}")
                    
            except requests.exceptions.RequestException as e:
                logger.error(f"ScraperAPI request error: {e}")
                if attempt < retries:
                    wait_time = self.backoff_factor ** attempt
                    time.sleep(wait_time)
        
        logger.error(f"Failed to fetch {url} after {retries + 1} attempts")
        return None
    
    def _get_new_ip_session(self):
        """Get a new IP session from ScraperAPI"""
        logger.info(f"Getting new IP session (previous IP used for {self.current_ip_requests} requests)")
        
        # Reset session tracking
        self.current_ip_requests = 0
        self.ip_rate_limited = False
        
        # Create new session (this will get a new IP from ScraperAPI)
        self.scraperapi_session = requests.Session()
        self.current_ip_session = f"session_{time.time()}"  # Just for tracking
        
        # Make a test request to "warm up" the new IP
        try:
            test_params = {
                'api_key': self.api_key,
                'url': 'https://httpbin.org/ip',
                'render': 'false'
            }
            test_response = self.scraperapi_session.get(
                self.scraperapi_url,
                params=test_params,
                timeout=10
            )
            self.api_calls_used += 1
            
            if test_response.status_code == 200:
                ip_info = test_response.json()
                logger.info(f"New IP session active: {ip_info.get('origin', 'Unknown IP')}")
            else:
                logger.warning(f"IP test failed with status {test_response.status_code}")
                
        except Exception as e:
            logger.warning(f"Failed to test new IP: {e}")
        
        time.sleep(1)  # Brief pause before using new IP
    
    def _extract_base_model_name(self, device_name: str) -> str:
        """Extract base model name without variant suffixes"""
        name = device_name.lower()
        
        # Remove common variant suffixes
        suffixes = [' plus', '+', ' ultra', ' fe', ' pro', ' max', ' mini', ' lite', ' edge']
        base_name = device_name
        
        for suffix in suffixes:
            if name.endswith(suffix):
                base_name = device_name[:len(device_name) - len(suffix)].strip()
                break
        
        return base_name
    
    def _detect_variant_type(self, device_name: str) -> str:
        """Detect the variant type of a device"""
        name = device_name.lower()
        
        if ' plus' in name or '+' in name:
            return 'plus'
        elif ' ultra' in name:
            return 'ultra'
        elif ' fe' in name:
            return 'fe'
        elif ' pro' in name:
            return 'pro'
        elif ' max' in name:
            return 'max'
        elif ' mini' in name:
            return 'mini'
        elif ' lite' in name:
            return 'lite'
        elif ' edge' in name:
            return 'edge'
        else:
            return 'base'
    
    def _ensure_correct_variant_naming(self, device_name: str, variant_type: str) -> str:
        """Ensure device name correctly reflects its variant"""
        if variant_type == 'base':
            # For base models, remove any variant suffixes that might be incorrectly attached
            base_name = self._extract_base_model_name(device_name)
            return base_name
        elif variant_type == 'plus':
            # Ensure Plus models have proper naming
            base_name = self._extract_base_model_name(device_name)
            if '+' in device_name:
                return device_name  # Already has + symbol
            elif 'plus' in device_name.lower():
                return device_name  # Already has Plus in name
            else:
                return f"{base_name}+"  # Add + suffix
        elif variant_type in ['ultra', 'fe', 'pro', 'max', 'mini', 'lite', 'edge']:
            # Ensure other variants have proper naming
            base_name = self._extract_base_model_name(device_name)
            variant_suffix = variant_type.capitalize()
            if variant_type.lower() not in device_name.lower():
                return f"{base_name} {variant_suffix}"
            else:
                return device_name
        
        return device_name
    
    def _search_missing_base_models(self, brand_name: str, found_devices: List[Tuple[str, str]]) -> List[Tuple[str, str]]:
        """Search for missing base models that might not appear in brand listings"""
        if brand_name.lower() != 'samsung':
            return found_devices  # Only apply this fix to Samsung for now
        
        # Check if we have Plus models but missing base models
        plus_models = [device for device in found_devices if '+' in device[0] or 'plus' in device[0].lower()]
        base_candidates = []
        
        for device_name, device_url in plus_models:
            base_name = self._extract_base_model_name(device_name)
            
            # Check if base model already exists in found devices
            base_exists = any(self._extract_base_model_name(d[0]) == base_name and 
                            self._detect_variant_type(d[0]) == 'base' 
                            for d in found_devices)
            
            if not base_exists:
                # Search for base model using GSMArena search
                base_url = self._search_for_base_model(base_name)
                if base_url:
                    base_candidates.append((base_name, base_url))
                    logger.info(f"Found missing base model: {base_name}")
        
        # Add found base models to the beginning of the list (higher priority)
        return base_candidates + found_devices
    
    def _search_for_base_model(self, base_model_name: str) -> Optional[str]:
        """Search for a specific base model using GSMArena search"""
        try:
            search_query = base_model_name.replace(' ', '+')
            search_url = f"https://www.gsmarena.com/results.php3?sQuickSearch=yes&sName={search_query}"
            
            response = self.make_request(search_url)
            if not response or response.status_code != 200:
                return None
            
            soup = BeautifulSoup(response.content, 'html.parser')
            
            # Look for device links in search results
            makers_divs = soup.find_all('div', class_='makers')
            
            for makers_div in makers_divs:
                links = makers_div.find_all('a', href=True)
                
                for link in links:
                    href = link.get('href', '')
                    text = link.get_text(strip=True)
                    
                    if '.php' in href:
                        # Check if this is the exact base model we want
                        if (base_model_name.lower() in text.lower() and 
                            '+' not in text and 'plus' not in text.lower() and
                            'ultra' not in text.lower() and 'fe' not in text.lower()):
                            
                            return urljoin(self.base_url, href)
            
        except Exception as e:
            logger.warning(f"Failed to search for base model {base_model_name}: {e}")
        
        return None
    
    def get_top_brands(self) -> List[Tuple[str, str]]:
        """Get the top 13 brands from GSMArena makers page (including NOTHING)"""
        logger.info("Fetching top brands from GSMArena...")
        
        response = self.make_request(f"{self.base_url}/makers.php3")
        if not response:
            return []
        
        soup = BeautifulSoup(response.content, 'html.parser')
        brands = []
        
        # Find brand links - GSMArena structure: look for links ending with -phones-\d+.php
        brand_links = soup.find_all('a', href=re.compile(r'.*-phones-\d+\.php$'))
        
        # Process brand links
        seen_brands = set()
        brand_priority = {
            'samsung': 1, 'apple': 2, 'xiaomi': 3, 'oppo': 4, 'vivo': 5,
            'realme': 6, 'oneplus': 7, 'google': 8, 'huawei': 9, 'honor': 10,
            'motorola': 11, 'nokia': 12, 'nothing': 13
        }
        
        brand_candidates = []
        
        for link in brand_links:
            brand_text = link.get_text().strip()
            href = link.get('href', '')
            
            # Extract brand name (remove device count numbers)
            brand_name = re.sub(r'\d+\s*devices?', '', brand_text).strip()
            
            # Skip empty names
            if not brand_name or brand_name.lower() in seen_brands:
                continue
            
            # Skip non-brand links
            if any(skip in brand_name.lower() for skip in ['news', 'review', 'compare', 'search']):
                continue
            
            brand_url = urljoin(self.base_url, href)
            
            # Get priority (lower number = higher priority)
            priority = brand_priority.get(brand_name.lower(), 999)
            
            brand_candidates.append((priority, brand_name, brand_url))
            seen_brands.add(brand_name.lower())
        
        # Sort by priority and take top 13 (added NOTHING)
        brand_candidates.sort(key=lambda x: x[0])
        brands = [(name, url) for _, name, url in brand_candidates[:13]]
        
        logger.info(f"Found {len(brands)} top brands")
        if brands:
            logger.debug("Brands found: " + ", ".join([name for name, _ in brands]))
        
        return brands
    
    def get_brand_devices(self, brand_name: str, brand_url: str) -> List[Tuple[str, str]]:
        """Get all devices for a specific brand"""
        logger.info(f"Fetching devices for {brand_name}...")
        
        devices = []
        page = 1
        
        while True:
            # Handle pagination - GSMArena uses different formats for different pages
            if page == 1:
                url = brand_url
            else:
                # Extract brand ID from original URL (e.g., apple-phones-48.php -> 48)
                brand_id_match = re.search(r'-phones-(\d+)\.php', brand_url)
                if brand_id_match:
                    brand_id = brand_id_match.group(1)
                    # GSMArena pagination format: brand-phones-f-ID-0-p2.php
                    url = brand_url.replace(f'-phones-{brand_id}.php', f'-phones-f-{brand_id}-0-p{page}.php')
                else:
                    logger.error(f"Could not extract brand ID from URL: {brand_url}")
                    break
            
            logger.debug(f"Fetching page {page}: {url}")
            response = self.make_request(url)
            if not response:
                logger.warning(f"Failed to fetch page {page} for {brand_name}")
                break
            
            soup = BeautifulSoup(response.content, 'html.parser')
            
            # Find device links on the page - GSMArena device pages have specific patterns
            # Look for links that are actual device pages, not filter pages or brand pages
            all_links = soup.find_all('a', href=re.compile(r'.+-\d+\.php$'))
            
            page_devices = []
            device_variants = {}  # Track variants of same model (base, plus, ultra)
            
            for link in all_links:
                href = link.get('href', '')
                device_name = link.get_text().strip()
                
                # Skip filter/category links (they contain 'f-' in the URL)
                if '-f-' in href or '/f-' in href:
                    continue
                
                # Skip brand page links (pattern: brandname-phones-number.php)
                if re.match(r'.*-phones-\d+\.php$', href):
                    continue
                
                # Skip links that are clearly not devices
                if not device_name or any(skip in device_name.lower() for skip in [
                    'news', 'review', 'compare', 'search', 'filter', 'sort',
                    'wireless charging', '3.5mm jack', 'esim', 'card slot',
                    '120hz', 'foldable', 'tablet', 'watch', 'camera', 'battery'
                ]):
                    continue
                
                # Skip brand names (common brand names that might appear as links)
                brand_names = ['samsung', 'apple', 'xiaomi', 'oppo', 'vivo', 'realme', 
                             'oneplus', 'google', 'huawei', 'honor', 'motorola', 'nokia',
                             'htc', 'sony', 'lg', 'lenovo', 'asus', 'blackberry', 'nothing']
                if device_name.lower().strip() in brand_names:
                    continue
                
                # Additional check: device names should contain brand name or model info
                # and not be generic feature names
                if len(device_name) < 3 or device_name.lower() in [
                    'wireless charging', '3.5mm jack', 'esim', 'card slot',
                    '120hz+ display', 'foldables', 'tablets', 'watches'
                ]:
                    continue
                
                # Must be an actual device model (should contain letters and numbers/spaces)
                if not re.search(r'[a-zA-Z].*[0-9a-zA-Z]', device_name):
                    continue
                
                device_url = urljoin(self.base_url, href)
                
                # Group device variants (base, plus, ultra) to ensure proper naming
                base_name = self._extract_base_model_name(device_name)
                variant_type = self._detect_variant_type(device_name)
                
                if base_name not in device_variants:
                    device_variants[base_name] = {}
                
                device_variants[base_name][variant_type] = (device_name, device_url)
            
            # Process variants to ensure correct naming and prioritize base models
            for base_name, variants in device_variants.items():
                # Add variants in priority order: base, plus, ultra, fe, others
                priority_order = ['base', 'plus', 'ultra', 'fe', 'other']
                
                for variant_type in priority_order:
                    if variant_type in variants:
                        device_name, device_url = variants[variant_type]
                        # Ensure proper naming with variant suffix
                        corrected_name = self._ensure_correct_variant_naming(device_name, variant_type)
                        page_devices.append((corrected_name, device_url))
            
            if not page_devices:
                logger.debug(f"No devices found on page {page}, stopping pagination")
                break  # No more actual devices
            
            devices.extend(page_devices)
            logger.info(f"Found {len(page_devices)} devices on page {page} for {brand_name}")
            
            # Check if there's a next page by looking for pagination
            next_page = soup.find('a', class_='prevnextbutton', title='Next page')
            if not next_page:
                logger.debug(f"No next page found, stopping pagination")
                break
            
            page += 1
            
            # Safety limit to prevent infinite loops
            if page > 20:  # Most brands shouldn't have more than 20 pages
                logger.warning(f"Reached page limit (20) for {brand_name}")
                break
        
        logger.info(f"Total devices found for {brand_name}: {len(devices)}")
        
        # Search for missing base models (especially for Samsung)
        devices = self._search_missing_base_models(brand_name, devices)
        
        logger.info(f"Final device count for {brand_name} (with base models): {len(devices)}")
        return devices
    
    def scrape_device_specs(self, device_name: str, device_url: str) -> Dict:
        """Scrape detailed specifications for a device"""
        response = self.make_request(device_url)
        if not response:
            return {}
        
        soup = BeautifulSoup(response.content, 'html.parser')
        
        # Get the actual device name from the page title (more accurate than link text)
        title_elem = soup.find('h1', class_='specs-phone-name-title')
        actual_device_name = title_elem.get_text(strip=True) if title_elem else device_name
        
        specs = {
            'name': actual_device_name,  # Use actual name from page
            'url': device_url,
            'scraped_at': time.strftime('%Y-%m-%d %H:%M:%S'),
            'specifications': {}
        }
        
        # Extract specifications table
        spec_tables = soup.find_all('table', {'cellspacing': '0'})
        
        for table in spec_tables:
            rows = table.find_all('tr')
            
            for row in rows:
                header = row.find('td', class_='ttl')
                data = row.find('td', class_='nfo')
                
                if header and data:
                    key = header.get_text().strip()
                    value = data.get_text().strip()
                    specs['specifications'][key] = value
        
        # Extract basic info if available
        overview = soup.find('div', class_='article-info-line')
        if overview:
            specs['overview'] = overview.get_text().strip()
        
        # Extract images
        img_tags = soup.find_all('img', {'src': re.compile(r'\.jpg|\.png')})
        specs['images'] = [urljoin(self.base_url, img.get('src')) for img in img_tags[:5]]  # First 5 images
        
        return specs
    
    def save_device_data(self, brand_name: str, device_name: str, specs: Dict) -> str:
        """Save device specifications to JSON file"""
        brand_slug = self.slugify(brand_name)
        
        # Use actual device name from specs if available (more accurate)
        actual_device_name = specs.get('name', device_name)
        device_slug = self.slugify(actual_device_name)
        
        # Create brand directory
        brand_dir = self.data_dir / brand_slug
        brand_dir.mkdir(exist_ok=True)
        
        # Save device data
        device_file = brand_dir / f"{device_slug}.json"
        
        with open(device_file, 'w', encoding='utf-8') as f:
            json.dump(specs, f, indent=2, ensure_ascii=False)
        
        return str(device_file)
    
    def update_index(self, brand_name: str, device_name: str, file_path: str):
        """Update in-memory index"""
        brand_slug = self.slugify(brand_name)
        device_slug = self.slugify(device_name)
        
        if brand_slug not in self.brand_index:
            self.brand_index[brand_slug] = {
                'name': brand_name,
                'devices': [],
                'device_count': 0
            }
        
        self.brand_index[brand_slug]['devices'].append(device_slug)
        self.brand_index[brand_slug]['device_count'] += 1
        
        self.device_index[device_slug] = {
            'name': device_name,
            'brand': brand_name,
            'file_path': file_path
        }
    
    def save_index(self):
        """Save index to JSON file"""
        index_data = {
            'generated_at': time.strftime('%Y-%m-%d %H:%M:%S'),
            'total_brands': len(self.brand_index),
            'total_devices': len(self.device_index),
            'brands': self.brand_index,
            'devices': self.device_index
        }
        
        index_file = self.data_dir / 'index.json'
        with open(index_file, 'w', encoding='utf-8') as f:
            json.dump(index_data, f, indent=2, ensure_ascii=False)
        
        logger.info(f"Index saved with {len(self.brand_index)} brands and {len(self.device_index)} devices")
    
    def load_index(self):
        """Load existing index from JSON file"""
        index_file = self.data_dir / 'index.json'
        
        if index_file.exists():
            try:
                with open(index_file, 'r', encoding='utf-8') as f:
                    index_data = json.load(f)
                
                self.brand_index = index_data.get('brands', {})
                self.device_index = index_data.get('devices', {})
                
                logger.info(f"Loaded index with {len(self.brand_index)} brands and {len(self.device_index)} devices")
            except Exception as e:
                logger.error(f"Failed to load index: {e}")
    
    def get_resume_state(self) -> Tuple[Optional[str], int]:
        """Get the last brand and device index to resume from"""
        state_file = self.data_dir / 'resume_state.json'
        
        if state_file.exists():
            try:
                with open(state_file, 'r') as f:
                    state = json.load(f)
                return state.get('last_brand'), state.get('last_device_index', 0)
            except Exception as e:
                logger.error(f"Failed to load resume state: {e}")
        
        return None, 0
    
    def save_resume_state(self, brand_name: str, device_index: int):
        """Save current progress for resume functionality"""
        state = {
            'last_brand': brand_name,
            'last_device_index': device_index,
            'timestamp': time.strftime('%Y-%m-%d %H:%M:%S')
        }
        
        state_file = self.data_dir / 'resume_state.json'
        with open(state_file, 'w') as f:
            json.dump(state, f, indent=2)
    
    def scrape_brand(self, brand_name: str, brand_url: str = None):
        """Scrape all devices for a specific brand"""
        if not brand_url:
            # Find brand URL from top brands
            brands = self.get_top_brands()
            brand_url = next((url for name, url in brands if name.lower() == brand_name.lower()), None)
            
            if not brand_url:
                logger.error(f"Brand '{brand_name}' not found in top 12 brands")
                return
        
        logger.info(f"Starting to scrape brand: {brand_name}")
        self.log_api_usage()
        
        devices = self.get_brand_devices(brand_name, brand_url)
        
        if not devices:
            logger.warning(f"No devices found for {brand_name}")
            return
        
        # Progress bar for devices
        pbar = tqdm(devices, desc=f"Scraping {brand_name}", unit="device")
        
        for i, (device_name, device_url) in enumerate(pbar):
            pbar.set_postfix(device=device_name[:30])
            
            # Log API usage every 10 devices
            if i % 10 == 0 and i > 0:
                self.log_api_usage()
                if self.api_calls_used >= 2900:  # Warning when approaching limit
                    logger.warning(f"Approaching API limit: {self.api_calls_used}/3000 calls used")
            
            try:
                # Check if device already exists
                device_slug = self.slugify(device_name)
                if device_slug in self.device_index:
                    logger.debug(f"Device {device_name} already exists, skipping")
                    continue
                
                # Scrape device specifications
                specs = self.scrape_device_specs(device_name, device_url)
                
                if specs:
                    # Use actual device name from specs (more accurate than link text)
                    actual_device_name = specs.get('name', device_name)
                    
                    # Save device data with actual name
                    file_path = self.save_device_data(brand_name, actual_device_name, specs)
                    
                    # Update index with actual name
                    self.update_index(brand_name, actual_device_name, file_path)
                    
                    logger.debug(f"Saved: {actual_device_name}")
                else:
                    logger.warning(f"Failed to scrape: {device_name}")
                
                # Save progress periodically
                if i % 10 == 0:
                    self.save_resume_state(brand_name, i)
                    self.save_index()
                
                # Check if we're running out of API calls
                if self.api_calls_used >= 2950:
                    logger.error("API limit nearly reached, stopping scraping")
                    break
                
            except Exception as e:
                logger.error(f"Error scraping {device_name}: {e}")
                continue
        
        # Final save and API usage report
        self.save_index()
        self.log_api_usage()
        logger.info(f"Completed scraping {brand_name}: {len(devices)} devices processed")
    
    def scrape_all_brands(self, resume: bool = False):
        """Scrape all top 12 brands"""
        brands = self.get_top_brands()
        
        if not brands:
            logger.error("Failed to fetch brand list")
            return
        
        start_brand = None
        if resume:
            start_brand, _ = self.get_resume_state()
            if start_brand:
                logger.info(f"Resuming from brand: {start_brand}")
        
        found_start = not resume or start_brand is None
        
        # Progress bar for brands
        pbar = tqdm(brands, desc="Scraping brands", unit="brand")
        
        for brand_name, brand_url in pbar:
            if not found_start:
                if brand_name == start_brand:
                    found_start = True
                else:
                    continue
            
            pbar.set_postfix(brand=brand_name)
            
            try:
                self.scrape_brand(brand_name, brand_url)
            except Exception as e:
                logger.error(f"Error scraping brand {brand_name}: {e}")
                continue
        
        # Clean up resume state
        state_file = self.data_dir / 'resume_state.json'
        if state_file.exists():
            state_file.unlink()
        
        logger.info("Completed scraping all brands")
    
    def rebuild_index(self):
        """Rebuild index from existing JSON files"""
        logger.info("Rebuilding index from existing files...")
        
        self.brand_index = {}
        self.device_index = {}
        
        for brand_dir in self.data_dir.iterdir():
            if brand_dir.is_dir() and brand_dir.name != '__pycache__':
                brand_slug = brand_dir.name
                
                for device_file in brand_dir.glob('*.json'):
                    try:
                        with open(device_file, 'r', encoding='utf-8') as f:
                            data = json.load(f)
                        
                        device_name = data.get('name', device_file.stem)
                        # Infer brand name from directory or data
                        brand_name = data.get('brand', brand_slug.replace('_', ' ').title())
                        
                        self.update_index(brand_name, device_name, str(device_file))
                        
                    except Exception as e:
                        logger.error(f"Error processing {device_file}: {e}")
        
        self.save_index()
        logger.info(f"Index rebuilt: {len(self.brand_index)} brands, {len(self.device_index)} devices")


def main():
    parser = argparse.ArgumentParser(description='GSMArena Web Scraper')
    parser.add_argument('--api-key', required=True, help='ScraperAPI key')
    parser.add_argument('--data-dir', default='data', help='Data directory (default: data)')
    parser.add_argument('--update-index', action='store_true', help='Rebuild index without rescraping')
    parser.add_argument('--scrape-brand', help='Scrape only a specific brand')
    parser.add_argument('--resume', action='store_true', help='Resume scraping from last saved state')
    parser.add_argument('--verbose', '-v', action='store_true', help='Verbose logging')
    
    args = parser.parse_args()
    
    if args.verbose:
        logging.getLogger().setLevel(logging.DEBUG)
    
    # Initialize scraper
    scraper = GSMArenaScraperAPI(args.api_key, args.data_dir)
    
    try:
        if args.update_index:
            scraper.rebuild_index()
        elif args.scrape_brand:
            scraper.scrape_brand(args.scrape_brand)
        else:
            scraper.scrape_all_brands(resume=args.resume)
    
    except KeyboardInterrupt:
        logger.info("Scraping interrupted by user")
        scraper.save_index()
    except Exception as e:
        logger.error(f"Scraping failed: {e}")
        scraper.save_index()


if __name__ == "__main__":
    main()
