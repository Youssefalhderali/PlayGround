@echo off
REM GSMArena Scraper - Quick Start Batch File
REM This file provides easy access to common scraping operations

echo GSMArena Scraper - Quick Start
echo ================================
echo.

:menu
echo Select an option:
echo 1. Database statistics
echo 2. List available brands
echo 3. Scrape all brands
echo 4. Scrape specific brand
echo 5. Resume scraping
echo 6. Search devices
echo 7. Compare devices
echo 8. Export data
echo 9. Rebuild index
echo 0. Exit
echo.

set /p choice="Enter your choice (0-9): "

if "%choice%"=="1" goto db_stats
if "%choice%"=="2" goto list_brands
if "%choice%"=="3" goto scrape_all
if "%choice%"=="4" goto scrape_brand
if "%choice%"=="5" goto resume
if "%choice%"=="6" goto search
if "%choice%"=="7" goto compare
if "%choice%"=="8" goto export
if "%choice%"=="9" goto rebuild_index
if "%choice%"=="0" goto exit

echo Invalid choice. Please try again.
echo.
goto menu

:db_stats
echo.
echo Database Statistics...
set PYTHONIOENCODING=utf-8
python db_cli.py stats
echo.
pause
goto menu

:list_brands
echo.
echo Listing available brands...
python run_scraper.py --list-brands
echo.
pause
goto menu

:scrape_all
echo.
echo WARNING: This will scrape all top 13 brands and may take several hours.
set /p confirm="Are you sure? (y/N): "
if /i "%confirm%"=="y" (
    echo Starting full scraping...
    python run_scraper.py --verbose
) else (
    echo Cancelled.
)
echo.
pause
goto menu

:scrape_brand
echo.
echo Available brands: Samsung, Apple, Xiaomi, Oppo, vivo, Realme, OnePlus, Google, Huawei, Honor, Motorola, Nokia, Nothing
set /p brand="Enter brand name: "
if "%brand%"=="" (
    echo No brand specified.
    goto menu
)
echo.
echo Scraping %brand%...
python run_scraper.py --scrape-brand "%brand%" --verbose
echo.
pause
goto menu

:resume
echo.
echo Resuming scraping from last position...
python run_scraper.py --resume --verbose
echo.
pause
goto menu

:search
echo.
set /p query="Enter search query: "
if "%query%"=="" (
    echo No query specified.
    goto menu
)
echo.
echo Searching for "%query%"...
set PYTHONIOENCODING=utf-8
python db_cli.py search "%query%"
echo.
pause
goto menu

:compare
echo.
set /p device1="Enter first device name (e.g., iPhone 15): "
set /p device2="Enter second device name (e.g., Galaxy S24): "
if "%device1%"=="" (
    echo No device specified.
    goto menu
)
if "%device2%"=="" (
    echo No device specified.
    goto menu
)
echo.
echo Comparing "%device1%" vs "%device2%"...
set PYTHONIOENCODING=utf-8
python db_cli.py search "%device1%"
python db_cli.py search "%device2%"
echo.
pause
goto menu

:export
echo.
echo Export options:
echo 1. All devices (JSON)
echo 2. All devices (CSV)
echo 3. Specific brand (JSON)
echo 4. Specific brand (CSV)
echo.
set /p export_choice="Choose export option (1-4): "

if "%export_choice%"=="1" goto export_all_json
if "%export_choice%"=="2" goto export_all_csv
if "%export_choice%"=="3" goto export_brand_json
if "%export_choice%"=="4" goto export_brand_csv
echo Invalid choice.
goto menu

:export_all_json
echo Exporting all devices to JSON...
set PYTHONIOENCODING=utf-8
python db_cli.py export --format json --output all_devices.json
goto export_done

:export_all_csv
echo Exporting all devices to CSV...
set PYTHONIOENCODING=utf-8
python db_cli.py export --format csv --output all_devices.csv
goto export_done

:export_brand_json
set /p target_brand="Enter brand name: "
echo Exporting %target_brand% devices to JSON...
set PYTHONIOENCODING=utf-8
python db_cli.py export --format json --output %target_brand%_devices.json --brand "%target_brand%"
goto export_done

:export_brand_csv
set /p target_brand="Enter brand name: "
echo Exporting %target_brand% devices to CSV...
set PYTHONIOENCODING=utf-8
python db_cli.py export --format csv --output %target_brand%_devices.csv --brand "%target_brand%"
goto export_done

:export_done
echo.
pause
goto menu

:rebuild_index
echo.
echo Rebuilding index from existing files...
python run_scraper.py --update-index
echo.
pause
goto menu

:exit
echo.
echo Thank you for using GSMArena Scraper with Database Integration!
exit /b 0
