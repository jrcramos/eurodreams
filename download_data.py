#!/usr/bin/env python3
"""
EuroDreams Data Downloader

This script scrapes the LotoIdeas website to find and download
EuroDreams historical data files.

Usage:
    python3 download_data.py [--output-dir DIR] [--file-type TYPE]
"""

import argparse
import os
import sys
from urllib.parse import urljoin, urlparse
import requests
from bs4 import BeautifulSoup


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
                # Convert relative URLs to absolute URLs
                absolute_url = urljoin(url, href)
                download_links.append((text, absolute_url, href))
        
        return download_links
    
    except requests.exceptions.RequestException as e:
        print(f"Error fetching URL: {e}", file=sys.stderr)
        return []
    except Exception as e:
        print(f"Error parsing page: {e}", file=sys.stderr)
        return []


def download_file(url, output_dir='.', filename=None):
    """
    Download a file from the given URL.
    
    Args:
        url (str): URL to download
        output_dir (str): Directory to save the file
        filename (str): Optional filename to save as
        
    Returns:
        str: Path to downloaded file or None on error
    """
    try:
        response = requests.get(url, timeout=30, stream=True)
        response.raise_for_status()
        
        # Determine filename
        if not filename:
            # Try to get filename from Content-Disposition header
            content_disposition = response.headers.get('Content-Disposition')
            if content_disposition and 'filename=' in content_disposition:
                filename = content_disposition.split('filename=')[-1].strip('"\'')
            else:
                # Extract from URL
                parsed_url = urlparse(url)
                filename = os.path.basename(parsed_url.path)
                if not filename:
                    filename = 'downloaded_file'
        
        # Create output directory if it doesn't exist
        os.makedirs(output_dir, exist_ok=True)
        
        filepath = os.path.join(output_dir, filename)
        
        # Download the file
        with open(filepath, 'wb') as f:
            for chunk in response.iter_content(chunk_size=8192):
                f.write(chunk)
        
        return filepath
    
    except Exception as e:
        print(f"Error downloading file: {e}", file=sys.stderr)
        return None


def main():
    """Main function to scrape and optionally download files."""
    parser = argparse.ArgumentParser(
        description='Scrape and download EuroDreams historical data files'
    )
    parser.add_argument(
        '--output-dir', '-o',
        default='./downloads',
        help='Directory to save downloaded files (default: ./downloads)'
    )
    parser.add_argument(
        '--file-type', '-t',
        choices=['csv', 'xlsx', 'ods', 'pdf', 'tsv', 'all'],
        default='all',
        help='Type of file to download (default: all)'
    )
    parser.add_argument(
        '--download', '-d',
        action='store_true',
        help='Download the files (default: just list them)'
    )
    parser.add_argument(
        '--url', '-u',
        default='https://www.lotoideas.com/eurodreams-resultados-historicos-de-todos-los-sorteos/',
        help='URL to scrape (default: LotoIdeas EuroDreams page)'
    )
    
    args = parser.parse_args()
    
    print("EuroDreams Data Downloader")
    print("=" * 50)
    print(f"Scraping: {args.url}")
    print()
    
    download_links = scrape_download_links(args.url)
    
    if not download_links:
        print("No download links found or error occurred.")
        return 1
    
    # Filter by file type if specified
    if args.file_type != 'all':
        download_links = [
            (text, url, href) for text, url, href in download_links
            if f'.{args.file_type}' in url.lower()
        ]
    
    if not download_links:
        print(f"No {args.file_type} files found.")
        return 1
    
    print(f"Found {len(download_links)} download link(s):")
    print()
    
    for idx, (text, url, href) in enumerate(download_links, 1):
        print(f"{idx}. {text}")
        print(f"   URL: {url}")
        
        if args.download:
            print(f"   Downloading...", end=' ')
            filepath = download_file(url, args.output_dir)
            if filepath:
                print(f"✓ Saved to: {filepath}")
            else:
                print("✗ Failed")
        
        print()
    
    if args.download:
        print(f"\nDownloaded files are in: {os.path.abspath(args.output_dir)}")
    else:
        print("Tip: Use --download flag to download the files")
    
    return 0


if __name__ == "__main__":
    sys.exit(main())
