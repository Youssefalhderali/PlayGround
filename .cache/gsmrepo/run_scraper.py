#!/usr/bin/env python3
"""
Simple CLI runner for GSMArena scraper with predefined API key
"""

import sys
import argparse
from pathlib import Path

# Add current directory to path
sys.path.insert(0, str(Path(__file__).parent))

from gsmarena_scraper_db import GSMArenaScraperDBIntegrated as GSMArenaScraperAPI
import config
import logging

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(levelname)s - %(message)s',
    handlers=[
        logging.FileHandler(config.LOG_FILE),
        logging.StreamHandler()
    ]
)

logger = logging.getLogger(__name__)


def main():
    parser = argparse.ArgumentParser(
        description='GSMArena Web Scraper with ScraperAPI',
        formatter_class=argparse.RawDescriptionHelpFormatter,
        epilog="""
Examples:
  python run_scraper.py                          # Scrape all top 12 brands
  python run_scraper.py --scrape-brand Samsung   # Scrape only Samsung devices
  python run_scraper.py --resume                 # Resume from last stopped point
  python run_scraper.py --update-index           # Rebuild index from existing files
  python run_scraper.py --verbose                # Enable debug logging
        """
    )
    
    parser.add_argument(
        '--data-dir', 
        default=config.DATA_DIR, 
        help=f'Data directory (default: {config.DATA_DIR})'
    )
    parser.add_argument(
        '--update-index', 
        action='store_true', 
        help='Rebuild index.json without rescraping'
    )
    parser.add_argument(
        '--scrape-brand', 
        help='Scrape only a specific brand (e.g., Samsung, Apple, Xiaomi)'
    )
    parser.add_argument(
        '--resume', 
        action='store_true', 
        help='Resume scraping from last saved state'
    )
    parser.add_argument(
        '--verbose', '-v', 
        action='store_true', 
        help='Enable verbose (debug) logging'
    )
    parser.add_argument(
        '--force-scraperapi', 
        action='store_true', 
        help='Force use of ScraperAPI from the start (uses more API calls)'
    )
    
    parser.add_argument(
        '--list-brands', 
        action='store_true', 
        help='List the top 12 brands and exit'
    )
    
    args = parser.parse_args()
    
    if args.verbose:
        logging.getLogger().setLevel(logging.DEBUG)
        logger.debug("Debug logging enabled")
    
    # Initialize scraper with API key from config
    logger.info("Initializing GSMArena scraper...")
    scraper = GSMArenaScraperAPI(config.SCRAPERAPI_KEY, args.data_dir)
    
    # Force ScraperAPI mode if requested
    if args.force_scraperapi:
        logger.info("Forcing ScraperAPI mode from start")
        scraper.use_scraperapi = True
        scraper.request_delay = 1
    
    try:
        if args.list_brands:
            # List top brands
            brands = scraper.get_top_brands()
            if brands:
                print("\nTop 12 GSMArena brands:")
                for i, (name, url) in enumerate(brands, 1):
                    print(f"{i:2d}. {name}")
                print(f"\nTotal: {len(brands)} brands")
            else:
                print("Failed to fetch brand list")
            return
        
        if args.update_index:
            logger.info("Rebuilding index from existing files...")
            scraper.rebuild_index()
            logger.info("Index rebuild completed")
        
        elif args.scrape_brand:
            logger.info(f"Scraping specific brand: {args.scrape_brand}")
            scraper.scrape_brand(args.scrape_brand)
            logger.info(f"Brand scraping completed: {args.scrape_brand}")
        
        else:
            logger.info("Starting full scraping of all top 12 brands...")
            scraper.scrape_all_brands(resume=args.resume)
            logger.info("Full scraping completed")
        
        # Show final statistics
        total_brands = len(scraper.brand_index)
        total_devices = len(scraper.device_index)
        api_stats = scraper.get_api_usage_stats()
        
        logger.info(f"Final statistics: {total_brands} brands, {total_devices} devices")
        logger.info(f"API Usage: {api_stats['scraperapi_calls_used']}/3000 ScraperAPI calls used")
        logger.info(f"Mode used: {'ScraperAPI' if api_stats['using_scraperapi'] else 'Direct requests (optimal)'}")
        
    except KeyboardInterrupt:
        logger.info("Scraping interrupted by user (Ctrl+C)")
        logger.info("Saving current progress...")
        scraper.save_index()
        print("\nGracefully stopped. Progress has been saved.")
        
    except Exception as e:
        logger.error(f"Scraping failed with error: {e}")
        logger.info("Saving current progress...")
        scraper.save_index()
        print(f"\nError occurred: {e}")
        print("Progress has been saved. You can resume with --resume flag.")
        sys.exit(1)


if __name__ == "__main__":
    main()
