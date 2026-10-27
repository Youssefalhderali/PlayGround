#!/usr/bin/env python3
"""
Database-Integrated GSMArena Scraper
Updated main scraper that saves to both SQLite database and JSON files
"""

import sys
from pathlib import Path

# Import existing scraper and database components
sys.path.append(str(Path(__file__).parent))

from gsmarena_scraper import GSMArenaScraperAPI
from db_setup import GSMArenaDB
from db_query import GSMArenaQuery
import config
import json
import logging
from typing import Dict, Optional

# Set up logger
logger = logging.getLogger(__name__)

class GSMArenaScraperDBIntegrated(GSMArenaScraperAPI):
    """
    Enhanced scraper that integrates with SQLite database
    Saves to both database (primary) and JSON files (backup)
    """
    
    def __init__(self, api_key: str = None, *args, **kwargs):
        """Initialize with database integration"""
        # Use config API key if not provided
        if api_key is None:
            api_key = config.SCRAPERAPI_KEY
            
        super().__init__(api_key, *args, **kwargs)
        
        # Initialize database
        self.db = GSMArenaDB()
        self.query = GSMArenaQuery()
        
        logger.info("Database integration initialized")
    
    def save_device_data(self, brand_name: str, device_name: str, specs: Dict) -> str:
        """Enhanced save method that uses database + JSON backup"""
        try:
            # Get the actual device name from specs
            actual_device_name = specs.get('name', device_name)
            
            # Save to JSON file first (existing functionality)
            json_file_path = super().save_device_data(brand_name, device_name, specs)
            
            # Add file path to specs for database
            specs_with_path = specs.copy()
            specs_with_path['file_path'] = json_file_path
            
            # Save to database
            try:
                device_id = self.db.add_device(brand_name, specs_with_path)
                logger.debug(f"Saved to database: {actual_device_name} (ID: {device_id})")
            except Exception as db_error:
                logger.error(f"Database save failed for {actual_device_name}: {db_error}")
                # Continue even if database save fails - we still have JSON backup
            
            return json_file_path
            
        except Exception as e:
            logger.error(f"Failed to save device data for {device_name}: {e}")
            raise
    
    def device_already_exists(self, device_name: str, brand_name: str) -> bool:
        """Check device existence using database (much faster than file system)"""
        try:
            # Use database for faster existence check
            devices = self.query.search_devices(query=device_name, brand=brand_name, limit=1)
            exists_in_db = len(devices) > 0
            
            if exists_in_db:
                logger.debug(f"Device exists in database: {device_name}")
                return True
            
            # Also check if file exists (fallback)
            brand_slug = self.slugify(brand_name)
            device_slug = self.slugify(device_name)
            brand_dir = self.data_dir / brand_slug
            device_file = brand_dir / f"{device_slug}.json"
            
            return device_file.exists()
            
        except Exception as e:
            logger.warning(f"Database existence check failed for {device_name}: {e}")
            # Fallback to file-based check
            brand_slug = self.slugify(brand_name)
            device_slug = self.slugify(device_name)
            brand_dir = self.data_dir / brand_slug
            device_file = brand_dir / f"{device_slug}.json"
            return device_file.exists()
    
    def get_brand_device_count(self, brand_name: str) -> int:
        """Get device count from database (faster than file counting)"""
        try:
            devices = self.query.get_brand_devices(brand_name, limit=10000)
            db_count = len(devices)
            
            logger.debug(f"Database shows {db_count} devices for {brand_name}")
            return db_count
            
        except Exception as e:
            logger.warning(f"Database count failed for {brand_name}: {e}")
            # Fallback to file-based counting
            brand_slug = self.slugify(brand_name)
            brand_dir = self.data_dir / brand_slug
            if brand_dir.exists():
                return len(list(brand_dir.glob("*.json")))
            return 0
    
    def save_index(self):
        """Enhanced index saving that uses database data"""
        try:
            # Generate index from database
            stats = self.query.get_stats()
            
            index_data = {
                'generated_at': self.get_timestamp(),
                'total_brands': stats['total_brands'],
                'total_devices': stats['total_devices'],
                'brands': {},
                'devices': {}
            }
            
            # Build brands structure from database
            for brand_info in stats['brands']:
                brand_name = brand_info['name']
                brand_slug = brand_name.lower()
                
                devices = self.query.get_brand_devices(brand_name, limit=10000)
                device_slugs = [device['slug'] for device in devices]
                
                index_data['brands'][brand_slug] = {
                    'name': brand_name,
                    'devices': sorted(device_slugs),
                    'device_count': len(device_slugs)
                }
                
                # Add devices to global index
                for device in devices:
                    index_data['devices'][device['slug']] = {
                        'name': device['name'],
                        'brand': brand_name,
                        'file_path': f"data/{brand_slug}/{device['slug']}.json"
                    }
            
            # Save index file
            index_file = self.data_dir / 'index.json'
            with open(index_file, 'w', encoding='utf-8') as f:
                json.dump(index_data, f, indent=2, ensure_ascii=False)
            
            logger.info(f"Index saved with {len(index_data['devices'])} devices from database")
            
        except Exception as e:
            logger.error(f"Enhanced index saving failed: {e}")
            # Fallback to original index saving
            super().save_index()
    
    def get_scraping_stats(self) -> Dict:
        """Get comprehensive scraping statistics from database"""
        try:
            stats = self.query.get_stats()
            
            # Get brand comparison
            comparison = self.query.get_brand_comparison()
            
            return {
                'total_devices': stats['total_devices'],
                'total_brands': stats['total_brands'],
                'total_specifications': stats['total_specs'],
                'brands': {brand['name']: brand['device_count'] for brand in stats['brands']},
                'variant_counts': {
                    brand['name']: {
                        'plus_models': brand['plus_models'],
                        'ultra_models': brand['ultra_models'],
                        'pro_models': brand['pro_models']
                    }
                    for brand in comparison
                }
            }
        except Exception as e:
            logger.error(f"Failed to get database stats: {e}")
            return {}
    
    def close(self):
        """Clean up database connections"""
        try:
            if hasattr(self, 'db'):
                self.db.close()
            if hasattr(self, 'query'):
                self.query.close()
            logger.info("Database connections closed")
        except Exception as e:
            logger.error(f"Error closing database connections: {e}")


def main():
    """Test the database-integrated scraper"""
    print("🗄️ Testing Database-Integrated GSMArena Scraper")
    print("=" * 50)
    
    # Initialize integrated scraper
    scraper = GSMArenaScraperDBIntegrated()
    
    try:
        # Show current statistics
        stats = scraper.get_scraping_stats()
        if stats:
            print(f"📊 Current Database Status:")
            print(f"  Total devices: {stats['total_devices']}")
            print(f"  Total brands: {stats['total_brands']}")
            print(f"  Total specifications: {stats['total_specifications']}")
            
            print(f"\n📱 Top brands:")
            for brand, count in list(stats['brands'].items())[:8]:
                print(f"  {brand}: {count} devices")
        
        # Test device existence check
        test_device = "Samsung Galaxy S24"
        exists = scraper.device_already_exists(test_device, "Samsung")
        print(f"\n🔍 Device existence test:")
        print(f"  '{test_device}' exists: {exists}")
        
        # Test brand device count
        samsung_count = scraper.get_brand_device_count("Samsung")
        print(f"  Samsung device count: {samsung_count}")
        
        print(f"\n✅ Database integration working correctly!")
        
    except Exception as e:
        print(f"❌ Error testing integrated scraper: {e}")
    
    finally:
        scraper.close()


if __name__ == "__main__":
    main()
