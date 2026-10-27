# GSMArena Scraper & SQL Database Pipeline
> *An automated, high-fidelity web scraping and SQL transformation pipeline turning raw e-commerce specifications into a structured, queryable relational database.*

Built by **Shashank Salapur**

![Data Engineering Pipeline](https://img.shields.io/badge/Data%20Engineering-SQLite%20%7C%20Python-orange?style=for-the-badge)

## 🎯 Architecture & Ingestion Pipeline

The project architects an end-to-end data extraction and structurization workflow capable of penetrating anti-bot scraping restrictions and cleaning unstructured raw JSON into rigid SQL data types.

```text
[ ScraperAPI Proxy ] ──> [ GSMArena HTML Pages ] ──> [ BeautifulSoup Parser ]
                                                             │
                                                             ▼
[ SQLite Database ] <── [ Data Definition Schema ] <── [ JSON Raw Backup ]
```

### ⚡ Key Engineering Achievements

*   **Massive Scale Structuring**: Extracted, cleaned, and organized hardware specifications for **2,751 distinct smartphone models** across 13 global brands.
*   **Relational Transformation**: Structured unstructured web text into over **106,000 discrete, queryable SQL data points**.
*   **Data Integrity & Upserts**: Leveraged SQL `ON CONFLICT` / `UPSERT` DML logic to prevent constraint violations and handle duplicate indexing seamlessly during ingestion. 
*   **Optimized Query Indexing**: Designed a relational schema spanning multiple tables (devices, brands, specifications, variants) with **15+ internal indexes**, achieving an **11.9x query speedup** compared to flat JSON traversal.
*   **Advanced Anti-Bot Mitigation**: Architected dynamic IP rotation profiles, exponential backoff failure handling, and HTTP header spoofing via ScraperAPI to heavily mitigate IP bans during multi-hour ingestion runs.

## 🗄️ Relational Schema Design

This project demonstrates strict Data Definition Language (DDL) and database formatting applied to highly variable real-world data constraints:

*   `brands` (Primary Key, Name, Device Count)
*   `devices` (Primary Key, Foreign Key to Brands, Scrape Timestamps)
*   `device_specifications` (Normalized key-value mapping of battery, CPU, RAM metrics)
*   `device_variants` (Pricing and memory tier relationships)

## 🚀 How to Run & Query the Pipeline

### 1. Pre-Compiled Data Payload Access
**To eliminate hours of redundant computational overhead and bypassing proxy bottlenecks**, the complete scraped dataset has been securely pre-compiled into a singular JSON payload.

You can instantly evaluate the entire structured output of all 13 brands and 106,000+ data points by viewing the root file:
```text
📄 all_devices.json (Included in repository)
```

### 2. Setup & Ingest The Database
The repository still contains the raw distributed data. If you wish to manually build the SQLite relational architecture from scratch, perform the ETL migration:

```powershell
pip install -r requirements.txt
$env:PYTHONIOENCODING="utf-8"
python db_setup.py
```
*(This securely migrates the thousands of JSON nodes into a newly compiled `gsmarena.db` SQLite engine).*

### 3. Querying The Data (CLI Interface)
Verify the speed and schema strictness using the custom CLI query engine:

**Fetch Database Statistics**
```powershell
python db_cli.py stats
```

**Perform High-Speed Constraint Searches**
```powershell
python db_cli.py search "Galaxy"
python db_cli.py search "Ultra" --brand Samsung
```

**Evaluate Deep Specification Data**
```powershell
python db_cli.py specs "12GB RAM"
```

## 🔒 Legal & Constraint Context
This system was engineered as a proof-of-concept for data ingestion, DML query optimization, and schema abstraction. To prevent targeted DDoS signatures, this framework implements exponential back-off rate-limiting protocols automatically.
