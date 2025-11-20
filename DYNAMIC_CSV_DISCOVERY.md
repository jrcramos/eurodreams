# Dynamic CSV URL Discovery - Implementation Summary

## Overview

This document describes the implementation of dynamic CSV URL discovery from the LotoIdeas website, addressing the issue that the CSV link might be generated differently each time on the website.

## Problem Statement

The original issue reported:
- The app contained a hardcoded Google Sheets CSV URL
- The CSV link should be discovered from: https://www.lotoideas.com/eurodreams-resultados-historicos-de-todos-los-sorteos/
- The link text is "Valores separados por comas (.csv)"
- The URL might be dynamically generated and change over time

## Solution

Implemented a three-tier data fetching strategy with dynamic URL discovery:

### 1. Primary: Dynamic Discovery
- On app load, attempts to scrape the LotoIdeas page
- Searches for links with text containing "Valores separados por comas" or "csv"
- Validates discovered URLs are legitimate Google Sheets CSV exports
- Uses CORS proxy services to bypass browser CORS restrictions

### 2. Fallback Level 1: Hardcoded URL
- If dynamic discovery fails (network issues, CORS problems, etc.)
- Uses the hardcoded Google Sheets URL as a reliable fallback

### 3. Fallback Level 2: Embedded Data
- If both discovery and URL fetch fail
- Uses embedded CSV data for offline functionality
- Ensures the app always works, even without internet

## Implementation Details

### Constants Added
```javascript
const LOTOIDEAS_URL = 'https://www.lotoideas.com/eurodreams-resultados-historicos-de-todos-los-sorteos/';
const FALLBACK_CSV_URL = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vTZzm-CTUj3li4EdfW1ImthPdc0AGIymq8tbuwPiqjW0OL4F1MWO5G6PfPEtNvLJcY8MpJo4apayTip/pub?output=csv';
let CSV_URL = FALLBACK_CSV_URL;
```

### discoverCSVUrl() Function

**Purpose**: Attempts to discover the CSV URL from the LotoIdeas website

**CORS Proxies Used** (in order):
1. `https://api.allorigins.win/raw?url=`
2. `https://corsproxy.io/?`
3. Direct access (will fail due to CORS but worth trying)

**Link Discovery Logic**:
- Parses HTML to find `<a>` tags
- Checks if link text contains:
  - "valores separados por comas" (Spanish for "comma-separated values")
  - ".csv"
  - "csv"
- Validates the URL is a legitimate Google Sheets CSV export

**Security Validation**:
Uses `new URL()` to parse and validate:
- `url.hostname === 'docs.google.com'` - Exact hostname match (prevents subdomain attacks)
- `url.pathname.includes('/spreadsheets/')` - Must be a spreadsheet
- `url.searchParams.get('output') === 'csv'` - Must be CSV export

This prevents URL injection attacks like:
- `https://evil.com/docs.google.com/...`
- `https://docs.google.com.evil.com/...`

**Timeout**: 5 seconds per proxy attempt using AbortController

**Return Value**: Discovered URL string or null if not found

### Modified loadData() Function

Now includes dynamic discovery step:
```javascript
const discoveredUrl = await discoverCSVUrl();
if (discoveredUrl) {
    CSV_URL = discoveredUrl;
    console.log('Using dynamically discovered CSV URL');
} else {
    console.log('Using fallback CSV URL');
}
```

## Security Considerations

### Vulnerability Fixed: URL Substring Sanitization

**Original Issue** (reported by CodeQL):
```javascript
// INSECURE - can be bypassed
if (href.includes('docs.google.com') && href.includes('output=csv'))
```

**Fixed Implementation**:
```javascript
// SECURE - proper URL parsing
const url = new URL(href);
if (url.hostname === 'docs.google.com' && 
    url.pathname.includes('/spreadsheets/') && 
    url.searchParams.get('output') === 'csv')
```

### Security Test Results
All security tests pass:
- ✅ Valid Google Sheets CSV URL: Accepted
- ✅ Evil domain with docs.google.com in path: Rejected
- ✅ Subdomain attack (docs.google.com.evil.com): Rejected
- ✅ Not a spreadsheet path: Rejected
- ✅ Wrong output format: Rejected

## Browser Compatibility

### AbortController Implementation
Used AbortController with setTimeout for timeout functionality:
```javascript
const controller = new AbortController();
const timeoutId = setTimeout(() => controller.abort(), 5000);
const response = await fetch(url, { signal: controller.signal });
clearTimeout(timeoutId);
```

This approach works in all modern browsers and avoids the newer `AbortSignal.timeout()` which has limited support.

## User Experience

### Success Path
1. App loads
2. Discovers current CSV URL from LotoIdeas
3. Fetches latest data from Google Sheets
4. Displays predictions with fresh data

### Degraded Path 1 (Discovery Fails)
1. App loads
2. Discovery fails (CORS, network issue)
3. Uses hardcoded fallback URL
4. Fetches data successfully
5. Displays predictions (data might be slightly outdated if URL changed)

### Degraded Path 2 (Everything Fails)
1. App loads
2. Discovery fails
3. Fallback URL fetch fails
4. Uses embedded CSV data
5. Displays predictions (works offline with older data)

## Logging

The implementation includes comprehensive console logging:
- `✅ Discovered CSV URL from LotoIdeas: <url>` - When discovery succeeds
- `Using dynamically discovered CSV URL` - When using discovered URL
- `Using fallback CSV URL` - When falling back to hardcoded URL
- `Failed to discover CSV URL dynamically: <error>` - When discovery fails
- `Failed to fetch from external source, using fallback data: <error>` - When all fetching fails

## Testing

### Manual Testing
- Test with working network: Should discover URL dynamically
- Test with blocked domains: Should fall back gracefully
- Test offline: Should use embedded data

### Automated Testing
URL validation logic tested with 5 security test cases (all passing).

## Documentation Updates

### README.md
Updated Data Sources section to explain:
- Primary: Dynamic discovery mechanism
- Fallback 1: Hardcoded URL
- Fallback 2: Embedded data
- How the discovery process works

## Maintenance

### Updating the Fallback URL
If the Google Sheets URL changes:
1. Visit https://www.lotoideas.com/eurodreams-resultados-historicos-de-todos-los-sorteos/
2. Find the "Valores separados por comas (.csv)" link
3. Update `FALLBACK_CSV_URL` constant in app.js
4. The app will automatically discover new URLs going forward

### CORS Proxy Alternatives
If CORS proxies become unavailable:
1. Add new proxy URLs to the `corsProxies` array in `discoverCSVUrl()`
2. The function will try each proxy in order
3. The app will still work using the fallback URL

## Performance

- Discovery attempt: ~5 seconds per proxy (with timeout)
- Maximum delay: ~15 seconds (if all 3 proxies timeout)
- Typical delay: 0-5 seconds (first proxy usually works or fails quickly)
- No performance impact if discovery succeeds on first attempt

## Conclusion

This implementation successfully addresses the original problem:
- ✅ Dynamically discovers CSV URL from LotoIdeas website
- ✅ Looks for "Valores separados por comas (.csv)" link text
- ✅ Handles dynamic URL generation gracefully
- ✅ Maintains backward compatibility with fallback URLs
- ✅ Ensures app always works (three-tier fallback)
- ✅ Secure URL validation (CodeQL approved)
- ✅ Browser compatible (works in all modern browsers)
- ✅ Well documented and maintainable
