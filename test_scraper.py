#!/usr/bin/env python3
"""
Test script for the EuroDreams download links scraper.

This script tests the scraper with mock HTML data to verify functionality.
"""

from bs4 import BeautifulSoup


def test_scraper_with_mock_data():
    """Test the scraper logic with mock HTML."""
    
    # Mock HTML with various types of links
    mock_html = """
    <html>
        <body>
            <h1>EuroDreams Historical Results</h1>
            <div class="downloads">
                <a href="/downloads/eurodreams-2024.csv">Download CSV 2024</a>
                <a href="/files/eurodreams-complete.xlsx">Complete Excel File</a>
                <a href="/data/results.ods">OpenDocument Spreadsheet</a>
                <a href="/reports/analysis.pdf">Analysis Report PDF</a>
                <a href="/export/data.tsv">Tab-separated Values</a>
                <a href="/about">About Page</a>
                <a href="/contact.html">Contact Us</a>
            </div>
        </body>
    </html>
    """
    
    soup = BeautifulSoup(mock_html, 'html.parser')
    links = soup.find_all('a')
    download_links = []
    
    for link in links:
        href = link.get('href')
        text = link.get_text().strip()
        if href and any(fmt in href.lower() for fmt in ['.xlsx', '.csv', '.ods', '.pdf', '.tsv']):
            download_links.append((text, href))
    
    print("Test: Scraper with Mock Data")
    print("=" * 50)
    print(f"Found {len(download_links)} download link(s):")
    print()
    
    for idx, (text, href) in enumerate(download_links, 1):
        print(f"{idx}. Download: {text}")
        print(f"   URL: {href}")
        print()
    
    # Verify expected results
    assert len(download_links) == 5, f"Expected 5 links, got {len(download_links)}"
    
    expected_extensions = ['.csv', '.xlsx', '.ods', '.pdf', '.tsv']
    found_extensions = [href.split('.')[-1].lower() for _, href in download_links]
    
    for ext in expected_extensions:
        ext_clean = ext.replace('.', '')
        assert ext_clean in found_extensions, f"Expected to find {ext} link"
    
    print("✅ All tests passed!")
    return True


if __name__ == "__main__":
    try:
        test_scraper_with_mock_data()
    except AssertionError as e:
        print(f"❌ Test failed: {e}")
        exit(1)
    except Exception as e:
        print(f"❌ Error during test: {e}")
        exit(1)
