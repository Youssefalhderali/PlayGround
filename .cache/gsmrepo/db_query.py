#!/usr/bin/env python3
"""
Database Query Interface for GSMArena SQLite Database
Provides fast, optimized queries for device data
"""

import sqlite3
from pathlib import Path
from typing import Dict, List, Optional, Tuple
import json

class GSMArenaQuery:
    def __init__(self, db_path: str = "data/gsmarena.db"):
        self.db_path = db_path
        if not Path(db_path).exists():
            raise FileNotFoundError(f"Database not found: {db_path}")
        
        self.conn = sqlite3.connect(db_path)
        self.conn.row_factory = sqlite3.Row
    
    def get_stats(self) -> Dict:
        """Get database statistics"""
        stats = {}
        
        # Total counts
        stats['total_brands'] = self.conn.execute("SELECT COUNT(*) FROM brands").fetchone()[0]
        stats['total_devices'] = self.conn.execute("SELECT COUNT(*) FROM devices").fetchone()[0]
        stats['total_specs'] = self.conn.execute("SELECT COUNT(*) FROM device_specifications").fetchone()[0]
        
        # Brand breakdown
        cursor = self.conn.execute("""
            SELECT b.name, COUNT(d.id) as device_count
            FROM brands b
            LEFT JOIN devices d ON b.id = d.brand_id
            GROUP BY b.id
            ORDER BY device_count DESC
        """)
        stats['brands'] = [dict(row) for row in cursor.fetchall()]
        
        return stats
    
    def search_devices(self, 
                      query: str = "",
                      brand: str = "",
                      specs: Dict[str, str] = None,
                      limit: int = 100,
                      offset: int = 0) -> List[Dict]:
        """Advanced device search with multiple filters"""
        
        sql = """
            SELECT DISTINCT d.slug, d.name, b.name as brand, d.url, d.scraped_at,
                   d.display_size, d.chipset, d.memory, d.battery, d.camera
            FROM devices d
            JOIN brands b ON d.brand_id = b.id
        """
        
        joins = []
        conditions = ["1=1"]
        params = []
        
        # Brand filter
        if brand:
            conditions.append("LOWER(b.name) = LOWER(?)")
            params.append(brand)
        
        # Name search
        if query:
            conditions.append("LOWER(d.name) LIKE ?")
            params.append(f"%{query.lower()}%")
        
        # Specification filters
        if specs:
            for i, (spec_name, spec_value) in enumerate(specs.items()):
                alias = f"ds{i}"
                joins.append(f"""
                    JOIN device_specifications {alias} ON d.id = {alias}.device_id
                """)
                conditions.append(f"{alias}.spec_name = ? AND LOWER({alias}.spec_value) LIKE LOWER(?)")
                params.extend([spec_name, f"%{spec_value}%"])
        
        # Build final query
        if joins:
            sql += " " + " ".join(joins)
        
        sql += " WHERE " + " AND ".join(conditions)
        sql += " ORDER BY d.name LIMIT ? OFFSET ?"
        params.extend([limit, offset])
        
        cursor = self.conn.execute(sql, params)
        return [dict(row) for row in cursor.fetchall()]
    
    def get_device_details(self, device_slug: str) -> Optional[Dict]:
        """Get complete device details including all specifications"""
        
        # Get basic device info
        cursor = self.conn.execute("""
            SELECT d.*, b.name as brand_name, b.slug as brand_slug
            FROM devices d
            JOIN brands b ON d.brand_id = b.id
            WHERE d.slug = ?
        """, (device_slug,))
        
        device = cursor.fetchone()
        if not device:
            return None
        
        device_dict = dict(device)
        
        # Get all specifications grouped by category
        cursor = self.conn.execute("""
            SELECT category, spec_name, spec_value
            FROM device_specifications
            WHERE device_id = ?
            ORDER BY category, spec_name
        """, (device['id'],))
        
        specifications = {}
        for row in cursor.fetchall():
            category = row['category']
            if category not in specifications:
                specifications[category] = {}
            specifications[category][row['spec_name']] = row['spec_value']
        
        device_dict['specifications'] = specifications
        
        # Get device variants
        cursor = self.conn.execute("""
            SELECT dv.variant_type, d.slug, d.name
            FROM device_variants dv
            JOIN devices d ON dv.variant_device_id = d.id
            WHERE dv.base_device_id = ?
            ORDER BY dv.variant_type
        """, (device['id'],))
        
        device_dict['variants'] = [dict(row) for row in cursor.fetchall()]
        
        return device_dict
    
    def get_brand_devices(self, brand_name: str, limit: int = 100) -> List[Dict]:
        """Get all devices for a specific brand"""
        return self.search_devices(brand=brand_name, limit=limit)
    
    def get_similar_devices(self, device_slug: str, limit: int = 5) -> List[Dict]:
        """Find devices similar to the given device based on specs"""
        
        # Get device's key specs
        cursor = self.conn.execute("""
            SELECT d.chipset, d.memory, d.display_size, b.id as brand_id
            FROM devices d
            JOIN brands b ON d.brand_id = b.id
            WHERE d.slug = ?
        """, (device_slug,))
        
        device = cursor.fetchone()
        if not device:
            return []
        
        # Find similar devices (same brand, similar specs)
        cursor = self.conn.execute("""
            SELECT d.slug, d.name, b.name as brand,
                   d.display_size, d.chipset, d.memory
            FROM devices d
            JOIN brands b ON d.brand_id = b.id
            WHERE d.brand_id = ? 
            AND d.slug != ?
            AND (d.chipset = ? OR d.memory = ? OR d.display_size = ?)
            ORDER BY (
                CASE WHEN d.chipset = ? THEN 1 ELSE 0 END +
                CASE WHEN d.memory = ? THEN 1 ELSE 0 END +
                CASE WHEN d.display_size = ? THEN 1 ELSE 0 END
            ) DESC
            LIMIT ?
        """, (
            device['brand_id'], device_slug,
            device['chipset'], device['memory'], device['display_size'],
            device['chipset'], device['memory'], device['display_size'],
            limit
        ))
        
        return [dict(row) for row in cursor.fetchall()]
    
    def get_popular_specs(self, spec_name: str, limit: int = 10) -> List[Dict]:
        """Get most popular values for a specific specification"""
        cursor = self.conn.execute("""
            SELECT spec_value, COUNT(*) as count,
                   GROUP_CONCAT(DISTINCT b.name) as brands
            FROM device_specifications ds
            JOIN devices d ON ds.device_id = d.id
            JOIN brands b ON d.brand_id = b.id
            WHERE ds.spec_name = ?
            GROUP BY spec_value
            ORDER BY count DESC
            LIMIT ?
        """, (spec_name, limit))
        
        return [dict(row) for row in cursor.fetchall()]
    
    def get_brand_comparison(self) -> List[Dict]:
        """Compare brands by various metrics"""
        cursor = self.conn.execute("""
            SELECT 
                b.name,
                COUNT(d.id) as total_devices,
                COUNT(CASE WHEN d.name LIKE '%+%' THEN 1 END) as plus_models,
                COUNT(CASE WHEN d.name LIKE '%Ultra%' THEN 1 END) as ultra_models,
                COUNT(CASE WHEN d.name LIKE '%Pro%' THEN 1 END) as pro_models,
                MIN(d.scraped_at) as first_scraped,
                MAX(d.scraped_at) as last_scraped
            FROM brands b
            LEFT JOIN devices d ON b.id = d.brand_id
            GROUP BY b.id
            ORDER BY total_devices DESC
        """)
        
        return [dict(row) for row in cursor.fetchall()]
    
    def search_specs(self, spec_query: str, limit: int = 50) -> List[Dict]:
        """Search within device specifications"""
        cursor = self.conn.execute("""
            SELECT DISTINCT d.slug, d.name, b.name as brand,
                   ds.spec_name, ds.spec_value
            FROM device_specifications ds
            JOIN devices d ON ds.device_id = d.id
            JOIN brands b ON d.brand_id = b.id
            WHERE LOWER(ds.spec_value) LIKE LOWER(?)
            ORDER BY d.name
            LIMIT ?
        """, (f"%{spec_query}%", limit))
        
        return [dict(row) for row in cursor.fetchall()]
    
    def close(self):
        """Close database connection"""
        if self.conn:
            self.conn.close()


def main():
    """Demo the query interface"""
    db = GSMArenaQuery()
    
    print("🗄️ GSMArena Database Query Interface")
    print("=" * 50)
    
    # Show statistics
    stats = db.get_stats()
    print(f"📊 Database Statistics:")
    print(f"  Total brands: {stats['total_brands']}")
    print(f"  Total devices: {stats['total_devices']}")
    print(f"  Total specifications: {stats['total_specs']}")
    
    print(f"\n📱 Brand breakdown:")
    for brand in stats['brands']:
        print(f"  {brand['name']}: {brand['device_count']} devices")
    
    # Test searches
    print(f"\n🔍 Sample searches:")
    
    # Samsung devices
    samsung_devices = db.search_devices(brand="Samsung", limit=5)
    print(f"\n📱 Samsung devices ({len(samsung_devices)} shown):")
    for device in samsung_devices:
        print(f"  • {device['name']}")
    
    # Plus models across all brands
    plus_models = db.search_devices(query="plus", limit=5)
    print(f"\n➕ Plus models ({len(plus_models)} shown):")
    for device in plus_models:
        print(f"  • {device['name']} ({device['brand']})")
    
    # Search by chipset
    snapdragon_devices = db.search_specs("Snapdragon", limit=5)
    print(f"\n⚡ Snapdragon devices ({len(snapdragon_devices)} shown):")
    for device in snapdragon_devices:
        print(f"  • {device['name']} - {device['spec_value']}")
    
    # Brand comparison
    print(f"\n📊 Brand comparison:")
    comparison = db.get_brand_comparison()
    for brand in comparison[:8]:  # Top 8 brands
        print(f"  {brand['name']}: {brand['total_devices']} total, "
              f"{brand['plus_models']} plus, {brand['ultra_models']} ultra")
    
    db.close()


if __name__ == "__main__":
    main()
