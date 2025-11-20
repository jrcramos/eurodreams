# EuroDreams Lottery Predictor PWA

A Progressive Web App that fetches historical EuroDreams lottery draw data and uses multiple prediction algorithms to suggest potential numbers for the next draw.

## Features

- 📊 **Live Data**: Fetches historical draw data from CSV sources
- 🤖 **5 Prediction Methods**:
  1. **Frequency Analysis**: Most commonly drawn numbers
  2. **Hot Numbers**: Numbers appearing in recent draws
  3. **Gap Analysis**: Numbers that haven't appeared recently (overdue)
  4. **Pattern Balance**: Balanced mix of low and high numbers
  5. **Smart Random**: Random selection that hasn't been drawn before
- 📱 **PWA Support**: Install as an app on mobile devices
- 📈 **Statistics**: View historical draw statistics
- ✅ **Validation**: Ensures predictions haven't been drawn before

## Data Sources

The app currently uses the Google Sheets CSV export as the data source:
- **Primary**: Google Sheets CSV (configured in app.js)
- **Official Source**: [LotoIdeas EuroDreams Historical Results](https://www.lotoideas.com/eurodreams-resultados-historicos-de-todos-los-sorteos/)

## How It Works

The app analyzes historical EuroDreams draws (6 main numbers from 1-40 + 1 dream number from 1-5) and applies different statistical and pattern recognition algorithms to generate 5 unique predictions.

### Prediction Algorithms

1. **Frequency Analysis**: Selects the most frequently drawn numbers across all historical data
2. **Hot Numbers**: Focuses on numbers that have appeared in the most recent 20 draws
3. **Gap Analysis**: Identifies numbers that haven't appeared recently and may be "due"
4. **Pattern Balance**: Creates a balanced mix of low (1-20) and high (21-40) numbers
5. **Smart Random**: Generates random combinations that have never been drawn before

## Usage

### Online Version

Simply open `index.html` in a modern web browser. The app will:
1. Fetch historical data from the configured CSV source
2. Parse and analyze the draw history
3. Generate 5 predictions using different algorithms
4. Display statistics about the historical draws

### Test Version

For testing without internet or to see it work with mock data, open `test.html` which includes sample draw data.

### Installing as PWA

1. Open the app in Chrome/Edge on mobile or desktop
2. Click the "Install" button when prompted
3. The app will be added to your home screen/apps

## Data Format

The CSV data follows this structure:
```
FECHA,COMB. GANADORA,,,,,,SUEÑO
17/11/2025,04,08,13,18,28,38,4
```

- Column 0: Date (FECHA)
- Columns 1-6: Six main numbers (COMB. GANADORA)
- Column 7: Dream number (SUEÑO)

## Technical Details

- **Pure JavaScript**: No frameworks or build tools required
- **Service Worker**: Enables offline functionality
- **Responsive Design**: Works on desktop and mobile devices
- **Modern CSS**: Uses CSS Grid and Flexbox for layout

## Files

- `index.html`: Main application page
- `app.js`: Application logic with prediction algorithms
- `styles.css`: Responsive styling
- `manifest.json`: PWA manifest
- `service-worker.js`: Service worker for offline support
- `test.html`: Test page with mock data
- `app-test.js`: Test version of app logic
- `icon-192.png`, `icon-512.png`: PWA icons

## Disclaimer

⚠️ **For entertainment purposes only. Play responsibly.**

This app does not guarantee winning numbers. Lottery draws are random events, and past results do not influence future outcomes. The predictions are based on statistical analysis and pattern recognition for entertainment purposes only.

## Development

To run locally:

```bash
# Start a local web server
python3 -m http.server 8080

# Open browser to http://localhost:8080
```

## Browser Support

- Chrome 80+
- Edge 80+
- Firefox 75+
- Safari 13+

PWA features require a secure context (HTTPS) in production.
