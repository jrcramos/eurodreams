# Web Scraper Usage Guide

This guide explains how to use the web scraping tools to discover and download EuroDreams historical data from the LotoIdeas website.

## Installation

First, install the required Python dependencies:

```bash
pip install -r requirements.txt
```

This will install:
- `requests` - HTTP client for fetching web pages
- `beautifulsoup4` - HTML parser for extracting data
- `lxml` - Fast XML/HTML parser backend

## Quick Start

### 1. List Available Downloads

The simplest way to see what data is available:

```bash
python3 scrape_downloads.py
```

Output example:
```
EuroDreams Download Links Scraper
==================================================
Scraping: https://www.lotoideas.com/eurodreams-resultados-historicos-de-todos-los-sorteos/

Found 3 download link(s):

1. Download: Historical Results CSV
   URL: https://www.lotoideas.com/downloads/eurodreams-historical.csv

2. Download: Complete Data Excel
   URL: https://www.lotoideas.com/downloads/eurodreams-complete.xlsx

3. Download: Analysis Report
   URL: https://www.lotoideas.com/reports/eurodreams-analysis.pdf
```

### 2. Advanced Scraping and Downloading

Use the enhanced downloader for more control:

```bash
# List all available files
python3 download_data.py

# Download all files
python3 download_data.py --download

# Download only CSV files
python3 download_data.py --download --file-type csv

# Download to a custom directory
python3 download_data.py --download --output-dir ./eurodreams_data

# Download only Excel files to a specific location
python3 download_data.py --download --file-type xlsx --output-dir ./excel_files
```

## Supported File Types

The scrapers can detect and download these file formats:

| Extension | Description | Use Case |
|-----------|-------------|----------|
| `.csv` | Comma-separated values | Easy to parse, works with Excel and Python |
| `.xlsx` | Microsoft Excel | Rich formatting, multiple sheets |
| `.ods` | OpenDocument Spreadsheet | Open standard, works with LibreOffice |
| `.pdf` | Portable Document Format | Reports and documentation |
| `.tsv` | Tab-separated values | Alternative to CSV |

## Command-Line Options

### download_data.py Options

```
--download, -d
    Actually download the files (default: just list them)

--output-dir DIR, -o DIR
    Directory to save downloaded files (default: ./downloads)

--file-type TYPE, -t TYPE
    Filter by file type: csv, xlsx, ods, pdf, tsv, all (default: all)

--url URL, -u URL
    Custom URL to scrape (default: LotoIdeas EuroDreams page)
```

## Examples

### Example 1: Download All CSV Files

```bash
python3 download_data.py --download --file-type csv --output-dir ./csv_data
```

This will:
1. Scrape the LotoIdeas website
2. Find all CSV files
3. Download them to `./csv_data/` directory

### Example 2: Preview Available Files

```bash
python3 download_data.py --file-type xlsx
```

This will:
1. Scrape the website
2. Show only Excel files
3. Not download anything (preview mode)

### Example 3: Download Everything

```bash
python3 download_data.py --download
```

This will:
1. Scrape the website
2. Download all available files
3. Save them to `./downloads/` directory

### Example 4: Custom URL

If there's a different page with downloads:

```bash
python3 download_data.py --url https://example.com/other-results --download
```

## Integrating with Your Application

### Python Integration

You can import and use the scraper in your own Python code:

```python
from scrape_downloads import scrape_download_links

# Get download links
url = "https://www.lotoideas.com/eurodreams-resultados-historicos-de-todos-los-sorteos/"
links = scrape_download_links(url)

for text, href in links:
    print(f"Found: {text} at {href}")
```

### Using Downloaded Data

Once you've downloaded CSV files, you can use them in your application:

```python
import csv

with open('./downloads/eurodreams-historical.csv', 'r') as f:
    reader = csv.reader(f)
    header = next(reader)  # Skip header
    for row in reader:
        date = row[0]
        numbers = [int(row[i]) for i in range(1, 7)]
        dream = int(row[7])
        print(f"Date: {date}, Numbers: {numbers}, Dream: {dream}")
```

## Testing

Run the test suite to verify everything works:

```bash
python3 test_scraper.py
```

Expected output:
```
Test: Scraper with Mock Data
==================================================
Found 5 download link(s):
...
✅ All tests passed!
```

## Troubleshooting

### Problem: "No module named 'bs4'"

**Solution:** Install dependencies:
```bash
pip install -r requirements.txt
```

### Problem: "Connection timeout" or "Failed to resolve"

**Solution:** Check your internet connection or try again later. The website might be temporarily unavailable.

### Problem: "No download links found"

**Solution:** The website structure might have changed. Check if the website is accessible in your browser first.

### Problem: "Permission denied" when downloading

**Solution:** Make sure you have write permissions to the output directory:
```bash
chmod 755 ./downloads
```

## Notes

- Downloaded files are automatically excluded from git by `.gitignore`
- The scraper uses a 30-second timeout for network requests
- Relative URLs are automatically converted to absolute URLs
- Files are downloaded in chunks to handle large files efficiently
- The `downloads/` directory is created automatically if it doesn't exist

## For Developers

If you want to modify or extend the scrapers:

1. **scrape_downloads.py** - Simple scraper, easy to understand
2. **download_data.py** - Advanced features with argparse
3. **test_scraper.py** - Unit tests with mock data

All scrapers use the same core logic based on the pattern:

```python
# Find all links
links = soup.find_all('a')

# Filter for download links
for link in links:
    href = link.get('href')
    if href and any(fmt in href.lower() for fmt in ['.xlsx', '.csv', ...]):
        # Process download link
```

## License

These tools are provided as-is for educational and personal use. Respect the terms of service of the websites you scrape.
