#!/usr/bin/env python3
"""
SQLite Database Schema and Setup for GSMArena Scraper
Optimized for fast access times with proper indexing
"""

import sqlite3
import json
import os
from pathlib import Path
import time
import re
from typing import Dict, List, Tuple, Optional

class GSMArenaDB:
    def __init__(self, db_path: str = "data/gsmarena.db"):
        self.db_path = db_path
        self.conn = None
        self._init_database()
    
    def _init_database(self):
        """Initialize database connection and create tables"""
        # Ensure data directory exists
        Path(self.db_path).parent.mkdir(exist_ok=True)
        
        self.conn = sqlite3.connect(self.db_path)
        self.conn.row_factory = sqlite3.Row  # Enable dict-like access
        
        # Enable foreign keys and performance optimizations
        self.conn.execute("PRAGMA foreign_keys = ON")
        self.conn.execute("PRAGMA journal_mode = WAL")  # Better concurrent access
        self.conn.execute("PRAGMA synchronous = NORMAL")  # Faster writes
        self.conn.execute("PRAGMA cache_size = 10000")  # 10MB cache
        self.conn.execute("PRAGMA temp_store = MEMORY")  # Store temp data in memory
        
        self._create_tables()
        self._create_indexes()
    
    def _create_tables(self):
        """Create database tables with optimized schema"""
        
        # Brands table
        self.conn.execute("""
            CREATE TABLE IF NOT EXISTS brands (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                slug VARCHAR(50) UNIQUE NOT NULL,
                name VARCHAR(100) NOT NULL,
                device_count INTEGER DEFAULT 0,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        """)
        
        # Devices table with optimized columns
        self.conn.execute("""
            CREATE TABLE IF NOT EXISTS devices (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                brand_id INTEGER NOT NULL,
                slug VARCHAR(200) UNIQUE NOT NULL,
                name VARCHAR(200) NOT NULL,
                url VARCHAR(500),
                file_path VARCHAR(500),
                scraped_at TIMESTAMP,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                
                -- Cached common specs for faster queries
                display_size VARCHAR(50),
                chipset VARCHAR(100),
                memory VARCHAR(100),
                battery VARCHAR(50),
                camera VARCHAR(100),
                
                FOREIGN KEY (brand_id) REFERENCES brands(id) ON DELETE CASCADE
            )
        """)
        
        # Device specifications table (normalized for complex specs)
        self.conn.execute("""
            CREATE TABLE IF NOT EXISTS device_specifications (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                device_id INTEGER NOT NULL,
                category VARCHAR(50) NOT NULL,  -- Network, Display, Platform, etc.
                spec_name VARCHAR(100) NOT NULL,
                spec_value TEXT,
                
                FOREIGN KEY (device_id) REFERENCES devices(id) ON DELETE CASCADE,
                UNIQUE(device_id, spec_name)
            )
        """)
        
        # Device variants table (for Plus, Ultra, FE relationships)
        self.conn.execute("""
            CREATE TABLE IF NOT EXISTS device_variants (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                base_device_id INTEGER NOT NULL,
                variant_device_id INTEGER NOT NULL,
                variant_type VARCHAR(20) NOT NULL,  -- plus, ultra, fe, pro, etc.
                
                FOREIGN KEY (base_device_id) REFERENCES devices(id) ON DELETE CASCADE,
                FOREIGN KEY (variant_device_id) REFERENCES devices(id) ON DELETE CASCADE,
                UNIQUE(base_device_id, variant_device_id)
            )
        """)
        
        self.conn.commit()
    
    def _create_indexes(self):
        """Create optimized indexes for fast queries"""
        
        indexes = [
            # Brand indexes
            "CREATE INDEX IF NOT EXISTS idx_brands_slug ON brands(slug)",
            "CREATE INDEX IF NOT EXISTS idx_brands_name ON brands(name)",
            
            # Device indexes
            "CREATE INDEX IF NOT EXISTS idx_devices_brand_id ON devices(brand_id)",
            "CREATE INDEX IF NOT EXISTS idx_devices_slug ON devices(slug)",
            "CREATE INDEX IF NOT EXISTS idx_devices_name ON devices(name)",
            "CREATE INDEX IF NOT EXISTS idx_devices_name_lower ON devices(LOWER(name))",
            "CREATE INDEX IF NOT EXISTS idx_devices_scraped_at ON devices(scraped_at)",
            
            # Cached specs indexes for common queries
            "CREATE INDEX IF NOT EXISTS idx_devices_display ON devices(display_size)",
            "CREATE INDEX IF NOT EXISTS idx_devices_chipset ON devices(chipset)",
            "CREATE INDEX IF NOT EXISTS idx_devices_memory ON devices(memory)",
            
            # Specifications indexes
            "CREATE INDEX IF NOT EXISTS idx_specs_device_id ON device_specifications(device_id)",
            "CREATE INDEX IF NOT EXISTS idx_specs_category ON device_specifications(category)",
            "CREATE INDEX IF NOT EXISTS idx_specs_name ON device_specifications(spec_name)",
            "CREATE INDEX IF NOT EXISTS idx_specs_value ON device_specifications(spec_value)",
            "CREATE INDEX IF NOT EXISTS idx_specs_category_name ON device_specifications(category, spec_name)",
            
            # Variant indexes
            "CREATE INDEX IF NOT EXISTS idx_variants_base ON device_variants(base_device_id)",
            "CREATE INDEX IF NOT EXISTS idx_variants_variant ON device_variants(variant_device_id)",
            "CREATE INDEX IF NOT EXISTS idx_variants_type ON device_variants(variant_type)",
            
            # Composite indexes for common queries
            "CREATE INDEX IF NOT EXISTS idx_devices_brand_name ON devices(brand_id, LOWER(name))",
            "CREATE INDEX IF NOT EXISTS idx_specs_device_category ON device_specifications(device_id, category)",
        ]
        
        for index_sql in indexes:
            self.conn.execute(index_sql)
        
        self.conn.commit()
    
    def slugify(self, text: str) -> str:
        """Create URL-friendly slug with proper variant handling"""
        slug = text.lower()
        
        # Handle variants first
        slug = slug.replace('+', '_plus')
        slug = slug.replace(' ultra', '_ultra')
        slug = slug.replace(' fe', '_fe')
        slug = slug.replace(' pro', '_pro')
        slug = slug.replace(' max', '_max')
        slug = slug.replace(' mini', '_mini')
        slug = slug.replace(' lite', '_lite')
        slug = slug.replace(' edge', '_edge')
        slug = slug.replace(' note', '_note')
        
        # Replace spaces and special characters
        slug = slug.replace(' ', '_').replace('-', '_')
        slug = re.sub(r'[^\w_]', '', slug)
        slug = re.sub(r'_+', '_', slug)
        slug = slug.strip('_')
        
        return slug
    
    def ensure_brand(self, brand_name: str) -> int:
        """Ensure brand exists and return its ID"""
        brand_slug = self.slugify(brand_name)
        
        # Try to get existing brand
        cursor = self.conn.execute(
            "SELECT id FROM brands WHERE slug = ?", (brand_slug,)
        )
        result = cursor.fetchone()
        
        if result:
            return result['id']
        
        # Create new brand
        cursor = self.conn.execute(
            "INSERT INTO brands (slug, name) VALUES (?, ?)",
            (brand_slug, brand_name)
        )
        self.conn.commit()
        return cursor.lastrowid
    
    def extract_cached_specs(self, specifications: Dict) -> Dict:
        """Extract commonly queried specs for caching"""
        cached = {}
        
        # Map common spec names to our cached fields
        spec_mapping = {
            'display_size': ['Display', 'Size', 'Display Size'],
            'chipset': ['Chipset', 'Platform', 'CPU'],
            'memory': ['Memory', 'Internal', 'Storage'],
            'battery': ['Battery', 'Capacity'],
            'camera': ['Camera', 'Primary', 'Main Camera']
        }
        
        for field, possible_keys in spec_mapping.items():
            for key in possible_keys:
                if key in specifications:
                    cached[field] = str(specifications[key])[:100]  # Limit length
                    break
        
        return cached
    
    def add_device(self, brand_name: str, device_data: Dict) -> int:
        """Add a device to the database"""
        brand_id = self.ensure_brand(brand_name)
        
        # Create device slug
        device_name = device_data.get('name', '')
        device_slug = self.slugify(device_name)
        
        # Ensure unique slug within brand
        base_slug = device_slug
        counter = 1
        while True:
            existing = self.conn.execute(
                "SELECT id FROM devices WHERE slug = ?", (device_slug,)
            ).fetchone()
            
            if not existing:
                break
            
            device_slug = f"{base_slug}_{counter}"
            counter += 1
        
        # Extract cached specifications
        specifications = device_data.get('specifications', {})
        cached_specs = self.extract_cached_specs(specifications)
        
        # Insert device
        cursor = self.conn.execute("""
            INSERT INTO devices (
                brand_id, slug, name, url, file_path, scraped_at,
                display_size, chipset, memory, battery, camera
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        """, (
            brand_id, device_slug, device_name,
            device_data.get('url', ''),
            device_data.get('file_path', ''),
            device_data.get('scraped_at', ''),
            cached_specs.get('display_size'),
            cached_specs.get('chipset'),
            cached_specs.get('memory'),
            cached_specs.get('battery'),
            cached_specs.get('camera')
        ))
        
        device_id = cursor.lastrowid
        
        # Add detailed specifications
        self.add_specifications(device_id, specifications)
        
        # Update brand device count
        self.conn.execute("""
            UPDATE brands 
            SET device_count = (SELECT COUNT(*) FROM devices WHERE brand_id = ?),
                updated_at = CURRENT_TIMESTAMP
            WHERE id = ?
        """, (brand_id, brand_id))
        
        self.conn.commit()
        return device_id
    
    def add_specifications(self, device_id: int, specifications: Dict):
        """Add device specifications to the database"""
        
        # Group specifications by category
        categories = {
            'Network': ['Technology', '2G bands', '3G bands', '4G bands', '5G bands', 'Speed'],
            'Launch': ['Announced', 'Status'],
            'Body': ['Dimensions', 'Weight', 'Build', 'SIM'],
            'Display': ['Type', 'Size', 'Resolution', 'Protection', 'Display'],
            'Platform': ['OS', 'Chipset', 'CPU', 'GPU'],
            'Memory': ['Card slot', 'Internal', 'Memory'],
            'Camera': ['Primary', 'Features', 'Video', 'Secondary', 'Selfie camera'],
            'Sound': ['Loudspeaker', '3.5mm jack'],
            'Comms': ['WLAN', 'Bluetooth', 'Positioning', 'NFC', 'Radio', 'USB'],
            'Features': ['Sensors', 'Features'],
            'Battery': ['Type', 'Charging', 'Battery'],
            'Misc': ['Colors', 'Models', 'Price']
        }
        
        # Create reverse mapping
        spec_to_category = {}
        for category, specs in categories.items():
            for spec in specs:
                spec_to_category[spec] = category
        
        # Insert specifications
        for spec_name, spec_value in specifications.items():
            category = spec_to_category.get(spec_name, 'Other')
            
            self.conn.execute("""
                INSERT OR REPLACE INTO device_specifications 
                (device_id, category, spec_name, spec_value)
                VALUES (?, ?, ?, ?)
            """, (device_id, category, spec_name, str(spec_value)))
    
    def get_device_count(self) -> Dict:
        """Get device counts by brand"""
        cursor = self.conn.execute("""
            SELECT b.name, b.device_count, COUNT(d.id) as actual_count
            FROM brands b
            LEFT JOIN devices d ON b.id = d.brand_id
            GROUP BY b.id
            ORDER BY actual_count DESC
        """)
        
        return [dict(row) for row in cursor.fetchall()]
    
    def search_devices(self, query: str = "", brand: str = "", limit: int = 100) -> List[Dict]:
        """Search devices with optimized query"""
        sql = """
            SELECT d.slug, d.name, b.name as brand, d.url, d.scraped_at,
                   d.display_size, d.chipset, d.memory, d.battery, d.camera
            FROM devices d
            JOIN brands b ON d.brand_id = b.id
            WHERE 1=1
        """
        params = []
        
        if brand:
            sql += " AND b.slug = ?"
            params.append(brand.lower())
        
        if query:
            sql += " AND LOWER(d.name) LIKE ?"
            params.append(f"%{query.lower()}%")
        
        sql += " ORDER BY d.name LIMIT ?"
        params.append(limit)
        
        cursor = self.conn.execute(sql, params)
        return [dict(row) for row in cursor.fetchall()]
    
    def close(self):
        """Close database connection"""
        if self.conn:
            self.conn.close()


def migrate_json_to_db():
    """Migrate existing JSON data to SQLite database"""
    print("🔄 Starting migration from JSON to SQLite database...")
    
    # Initialize database
    db = GSMArenaDB()
    
    # Clear existing data
    db.conn.execute("DELETE FROM device_specifications")
    db.conn.execute("DELETE FROM device_variants")
    db.conn.execute("DELETE FROM devices")
    db.conn.execute("DELETE FROM brands")
    db.conn.commit()
    
    data_dir = Path("data")
    total_devices = 0
    total_brands = 0
    
    # Process each brand directory
    for brand_dir in data_dir.iterdir():
        if not brand_dir.is_dir() or brand_dir.name.startswith('.'):
            continue
        
        brand_name = brand_dir.name.capitalize()
        if brand_name in ['__pycache__', 'Index']:
            continue
        
        print(f"📱 Processing {brand_name}...")
        
        device_files = list(brand_dir.glob("*.json"))
        if not device_files:
            continue
        
        brand_devices = 0
        
        for device_file in device_files:
            try:
                with open(device_file, 'r', encoding='utf-8') as f:
                    device_data = json.load(f)
                
                # Add file path to device data
                device_data['file_path'] = str(device_file)
                
                # Add device to database
                db.add_device(brand_name, device_data)
                brand_devices += 1
                
            except Exception as e:
                print(f"  ⚠️  Error processing {device_file}: {e}")
                continue
        
        if brand_devices > 0:
            print(f"  ✅ Added {brand_devices} devices")
            total_devices += brand_devices
            total_brands += 1
    
    # Final statistics
    print("\n" + "="*50)
    print("✅ Migration completed successfully!")
    print(f"📊 Total brands: {total_brands}")
    print(f"📱 Total devices: {total_devices}")
    
    # Show brand breakdown
    print("\n📋 Brand breakdown:")
    counts = db.get_device_count()
    for brand_info in counts:
        print(f"  {brand_info['name']}: {brand_info['actual_count']} devices")
    
    # Test some queries
    print("\n🔍 Testing database queries...")
    
    # Test Samsung search
    samsung_devices = db.search_devices(brand="samsung", limit=5)
    if samsung_devices:
        print("\n📱 Sample Samsung devices:")
        for device in samsung_devices:
            print(f"  • {device['name']}")
    
    # Test Plus model search
    plus_devices = db.search_devices(query="plus", limit=5)
    if plus_devices:
        print("\n➕ Sample Plus models:")
        for device in plus_devices:
            print(f"  • {device['name']} ({device['brand']})")
    
    db.close()
    print(f"\n💾 Database saved to: {db.db_path}")


if __name__ == "__main__":
    migrate_json_to_db()
