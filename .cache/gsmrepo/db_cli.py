#!/usr/bin/env python3
"""
GSMArena Database CLI Tool
Comprehensive command-line interface for managing the SQLite database
"""

import argparse
import sys
from pathlib import Path
from db_setup import GSMArenaDB
from db_query import GSMArenaQuery
import json
import time

def cmd_stats(args):
    """Show database statistics"""
    db = GSMArenaQuery(args.database)
    stats = db.get_stats()
    
    print("📊 GSMArena Database Statistics")
    print("=" * 40)
    print(f"Total brands: {stats['total_brands']}")
    print(f"Total devices: {stats['total_devices']}")
    print(f"Total specifications: {stats['total_specs']}")
    
    print(f"\n📱 Brand breakdown:")
    for brand in stats['brands']:
        print(f"  {brand['name']:<12}: {brand['device_count']:>4} devices")
    
    db.close()

def cmd_search(args):
    """Search devices"""
    db = GSMArenaQuery(args.database)
    
    print(f"🔍 Searching for: '{args.query}'")
    if args.brand:
        print(f"   Brand filter: {args.brand}")
    
    devices = db.search_devices(
        query=args.query,
        brand=args.brand,
        limit=args.limit
    )
    
    print(f"\n📱 Found {len(devices)} devices:")
    for device in devices:
        brand_info = f" ({device['brand']})" if not args.brand else ""
        print(f"  • {device['name']}{brand_info}")
        if args.verbose:
            if device['display_size']:
                print(f"    Display: {device['display_size']}")
            if device['chipset']:
                print(f"    Chipset: {device['chipset']}")
            if device['memory']:
                print(f"    Memory: {device['memory']}")
    
    db.close()

def cmd_device(args):
    """Show device details"""
    db = GSMArenaQuery(args.database)
    
    device = db.get_device_details(args.slug)
    if not device:
        print(f"❌ Device not found: {args.slug}")
        db.close()
        return
    
    print(f"📱 {device['name']}")
    print(f"🏢 Brand: {device['brand_name']}")
    print(f"🔗 URL: {device['url']}")
    print(f"📅 Scraped: {device['scraped_at']}")
    
    if device['specifications']:
        print(f"\n📋 Specifications:")
        for category, specs in device['specifications'].items():
            print(f"\n  {category}:")
            for spec_name, spec_value in specs.items():
                print(f"    {spec_name}: {spec_value}")
    
    if device['variants']:
        print(f"\n🔄 Variants:")
        for variant in device['variants']:
            print(f"  • {variant['name']} ({variant['variant_type']})")
    
    db.close()

def cmd_brand(args):
    """Show brand information"""
    db = GSMArenaQuery(args.database)
    
    devices = db.get_brand_devices(args.brand, limit=args.limit)
    if not devices:
        print(f"❌ Brand not found or no devices: {args.brand}")
        db.close()
        return
    
    print(f"🏢 {args.brand} - {len(devices)} devices")
    print("=" * 40)
    
    # Group by device series if possible
    device_groups = {}
    for device in devices:
        # Try to extract series name (e.g., "Galaxy S24" -> "Galaxy S")
        name = device['name']
        if 'Galaxy S' in name:
            series = 'Galaxy S Series'
        elif 'Galaxy A' in name:
            series = 'Galaxy A Series'
        elif 'Galaxy Note' in name:
            series = 'Galaxy Note Series'
        elif 'iPhone' in name:
            series = 'iPhone Series'
        elif 'Redmi' in name:
            series = 'Redmi Series'
        elif 'Mi ' in name:
            series = 'Mi Series'
        else:
            series = 'Other'
        
        if series not in device_groups:
            device_groups[series] = []
        device_groups[series].append(device)
    
    for series, series_devices in device_groups.items():
        print(f"\n📱 {series} ({len(series_devices)} devices):")
        for device in sorted(series_devices, key=lambda x: x['name'])[:10]:  # Show max 10 per series
            print(f"  • {device['name']}")
        if len(series_devices) > 10:
            print(f"  ... and {len(series_devices) - 10} more")
    
    db.close()

def cmd_specs(args):
    """Search by specifications"""
    db = GSMArenaQuery(args.database)
    
    print(f"🔍 Searching specifications for: '{args.query}'")
    
    devices = db.search_specs(args.query, limit=args.limit)
    
    print(f"\n📱 Found {len(devices)} devices with matching specs:")
    for device in devices:
        print(f"  • {device['name']} ({device['brand']})")
        print(f"    {device['spec_name']}: {device['spec_value']}")
    
    db.close()

def cmd_popular(args):
    """Show popular spec values"""
    db = GSMArenaQuery(args.database)
    
    print(f"📊 Most popular values for '{args.spec}':")
    
    popular = db.get_popular_specs(args.spec, limit=args.limit)
    
    for i, spec in enumerate(popular, 1):
        print(f"  {i:>2}. {spec['spec_value']:<30} ({spec['count']} devices)")
        if args.verbose:
            brands = spec['brands'].split(',')
            print(f"      Brands: {', '.join(brands[:5])}")
            if len(brands) > 5:
                print(f"      ... and {len(brands) - 5} more")
    
    db.close()

def cmd_compare(args):
    """Compare brands"""
    db = GSMArenaQuery(args.database)
    
    print("📊 Brand Comparison")
    print("=" * 80)
    
    comparison = db.get_brand_comparison()
    
    print(f"{'Brand':<15} {'Total':<8} {'Plus':<6} {'Ultra':<6} {'Pro':<6} {'First Scraped':<12}")
    print("-" * 80)
    
    for brand in comparison:
        print(f"{brand['name']:<15} "
              f"{brand['total_devices']:<8} "
              f"{brand['plus_models']:<6} "
              f"{brand['ultra_models']:<6} "
              f"{brand['pro_models']:<6} "
              f"{brand['first_scraped'][:10] if brand['first_scraped'] else 'N/A':<12}")
    
    db.close()

def cmd_export(args):
    """Export data"""
    db = GSMArenaQuery(args.database)
    brand_filter = getattr(args, 'brand', None)
    
    if brand_filter:
        devices = db.search_devices(brand=brand_filter, limit=100000)
    else:
        devices = db.search_devices(limit=100000)

    if args.format == 'json':
        import json
        with open(args.output, 'w', encoding='utf-8') as f:
            json.dump(devices, f, indent=2, ensure_ascii=False)
        print(f"✅ Exported {len(devices)} devices to {args.output}")
    
    elif args.format == 'csv':
        import csv
        with open(args.output, 'w', newline='', encoding='utf-8') as csvfile:
            fieldnames = ['brand', 'name', 'display_size', 'chipset', 'memory', 'battery', 'camera', 'url']
            writer = csv.DictWriter(csvfile, fieldnames=fieldnames)
            writer.writeheader()
            for device in devices:
                writer.writerow({
                    'brand': device['brand'],
                    'name': device['name'],
                    'display_size': device['display_size'] or '',
                    'chipset': device['chipset'] or '',
                    'memory': device['memory'] or '',
                    'battery': device['battery'] or '',
                    'camera': device['camera'] or '',
                    'url': device['url']
                })
        print(f"✅ Exported {len(devices)} devices to {args.output}")
    
    db.close()

def cmd_migrate(args):
    """Migrate JSON data to database"""
    from db_setup import migrate_json_to_db
    
    print("🔄 Migrating JSON data to SQLite database...")
    migrate_json_to_db()

def main():
    parser = argparse.ArgumentParser(
        description="GSMArena Database CLI Tool",
        formatter_class=argparse.RawDescriptionHelpFormatter,
        epilog="""
Examples:
  %(prog)s stats                           # Show database statistics
  %(prog)s search "Galaxy S24"            # Search for devices
  %(prog)s search "Plus" --brand Samsung   # Search Samsung Plus models
  %(prog)s device samsung_galaxy_s24       # Show device details
  %(prog)s brand Samsung --limit 20        # Show Samsung devices
  %(prog)s specs "Snapdragon 8"           # Search by specifications
  %(prog)s popular "Chipset" --limit 10   # Show popular chipsets
  %(prog)s compare                         # Compare all brands
  %(prog)s export --format json           # Export to JSON
  %(prog)s migrate                         # Migrate JSON to database
        """
    )
    
    parser.add_argument(
        '--database', '-db',
        default='data/gsmarena.db',
        help='Database file path (default: data/gsmarena.db)'
    )
    
    parser.add_argument(
        '--verbose', '-v',
        action='store_true',
        help='Show detailed output'
    )
    
    subparsers = parser.add_subparsers(dest='command', help='Available commands')
    
    # Stats command
    subparsers.add_parser('stats', help='Show database statistics')
    
    # Search command
    search_parser = subparsers.add_parser('search', help='Search devices')
    search_parser.add_argument('query', help='Search query')
    search_parser.add_argument('--brand', help='Filter by brand')
    search_parser.add_argument('--limit', type=int, default=20, help='Limit results')
    
    # Device command
    device_parser = subparsers.add_parser('device', help='Show device details')
    device_parser.add_argument('slug', help='Device slug')
    
    # Brand command
    brand_parser = subparsers.add_parser('brand', help='Show brand devices')
    brand_parser.add_argument('brand', help='Brand name')
    brand_parser.add_argument('--limit', type=int, default=50, help='Limit results')
    
    # Specs command
    specs_parser = subparsers.add_parser('specs', help='Search by specifications')
    specs_parser.add_argument('query', help='Specification search query')
    specs_parser.add_argument('--limit', type=int, default=20, help='Limit results')
    
    # Popular command
    popular_parser = subparsers.add_parser('popular', help='Show popular spec values')
    popular_parser.add_argument('spec', help='Specification name (e.g., "Chipset", "Display")')
    popular_parser.add_argument('--limit', type=int, default=10, help='Limit results')
    
    # Compare command
    subparsers.add_parser('compare', help='Compare brands')
    
    # Export command
    export_parser = subparsers.add_parser('export', help='Export data')
    export_parser.add_argument('--format', choices=['json', 'csv'], default='json', help='Export format')
    export_parser.add_argument('--output', default='export.json', help='Output file')
    export_parser.add_argument('--brand', help='Filter by brand for export')
    
    # Migrate command
    subparsers.add_parser('migrate', help='Migrate JSON data to database')
    
    args = parser.parse_args()
    
    if not args.command:
        parser.print_help()
        return
    
    # Command dispatch
    commands = {
        'stats': cmd_stats,
        'search': cmd_search,
        'device': cmd_device,
        'brand': cmd_brand,
        'specs': cmd_specs,
        'popular': cmd_popular,
        'compare': cmd_compare,
        'export': cmd_export,
        'migrate': cmd_migrate
    }
    
    try:
        commands[args.command](args)
    except KeyboardInterrupt:
        print("\n⚠️ Operation cancelled")
    except Exception as e:
        print(f"❌ Error: {e}")
        if args.verbose:
            import traceback
            traceback.print_exc()

if __name__ == "__main__":
    main()
