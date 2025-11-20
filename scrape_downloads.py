#!/usr/bin/env python3
"""
EuroDreams Download Links Scraper

This script scrapes the LotoIdeas website to find downloadable files
(CSV, XLSX, ODS, PDF, TSV) containing EuroDreams historical results.

Usage:
    python3 scrape_downloads.py
"""

import requests
from bs4 import BeautifulSoup
import sys


def scrape_download_links(url):
    """
    Scrape the given URL for download links to data files.
    
    Args:
        url (str): The URL to scrape
        
    Returns:
        list: List of tuples containing (link_text, href)
    """
    try:
        response = requests.get(url, timeout=30)
        response.raise_for_status()
        soup = BeautifulSoup(response.content, 'html.parser')

        # Find all download links
        links = soup.find_all('a')
        download_links = []
        
        for link in links:
            href = link.get('href')
            text = link.get_text().strip()
            
            # Check if the link points to a downloadable file
            if href and any(fmt in href.lower() for fmt in ['.xlsx', '.csv', '.ods', '.pdf', '.tsv']):
                download_links.append((text, href))
        
        return download_links
    
    except requests.exceptions.RequestException as e:
        print(f"Error fetching URL: {e}", file=sys.stderr)
        return []
    except Exception as e:
        print(f"Error parsing page: {e}", file=sys.stderr)
        return []


def main():
    """Main function to scrape and display download links."""
    url = "https://www.lotoideas.com/eurodreams-resultados-historicos-de-todos-los-sorteos/"
    
    print("EuroDreams Download Links Scraper")
    print("=" * 50)
    print(f"Scraping: {url}")
    print()
    
    download_links = scrape_download_links(url)
    
    if download_links:
        print(f"Found {len(download_links)} download link(s):")
        print()
        for idx, (text, href) in enumerate(download_links, 1):
            print(f"{idx}. Download: {text}")
            print(f"   URL: {href}")
            print()
    else:
        print("No download links found or error occurred.")
        return 1
    
    return 0


if __name__ == "__main__":
    sys.exit(main())
