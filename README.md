# EuroDreams Lottery Predictor - Desktop App

A Desktop Application that fetches historical EuroDreams lottery draw data and uses multiple prediction algorithms to suggest potential numbers for the next draw.

## Features

- 🖥️ **Desktop Application**: Native desktop app built with Electron
- 📊 **Live Data**: Fetches historical draw data from CSV sources
- 🤖 **5 Prediction Methods**:
  1. **Frequency Analysis**: Most commonly drawn numbers
  2. **Hot Numbers**: Numbers appearing in recent draws
  3. **Gap Analysis**: Numbers that haven't appeared recently (overdue)
  4. **Pattern Balance**: Balanced mix of low and high numbers
  5. **Smart Random**: Random selection that hasn't been drawn before
- 📈 **Statistics**: View historical draw statistics
- ✅ **Validation**: Ensures predictions haven't been drawn before

## Desktop Application (Recommended)

The desktop application provides the full functionality in a native desktop window.

### Prerequisites

- Windows, macOS, or Linux
- Node.js 18 or higher (for development only)

### Download and Install

1. **Download the installer** from the [Releases](https://github.com/jrcramos/eurodreams/releases) page
2. **Run the installer** and follow the installation wizard
3. **Launch the application** from your applications menu

### Building from Source

1. **Clone the Repository**:
    ```bash
    git clone https://github.com/jrcramos/eurodreams.git
    cd eurodreams
    ```

2. **Install Dependencies**:
    ```bash
    npm install
    ```

3. **Build the Application**:
    ```bash
    npm run electron:build
    ```
    
    The installer will be created in the `release` directory.

### Running in Development Mode

To test the application during development:

```bash
npm run electron:dev
```

This starts both the Vite dev server and Electron in development mode with hot reload.

## How It Works

The app analyzes historical EuroDreams draws (6 main numbers from 1-40 + 1 dream number from 1-5) and applies different statistical and pattern recognition algorithms to generate 5 unique predictions.

### Prediction Algorithms

1. **Frequency Analysis**: Selects the most frequently drawn numbers across all historical data
2. **Hot Numbers**: Focuses on numbers that have appeared in the most recent 20 draws
3. **Gap Analysis**: Identifies numbers that haven't appeared recently and may be "due"
4. **Pattern Balance**: Creates a balanced mix of low (1-20) and high (21-40) numbers
5. **Smart Random**: Generates random combinations that have never been drawn before

## Data Sources

The app uses a dynamic data discovery approach with fallback mechanisms:
- **Primary**: Dynamically discovered CSV link from the [LotoIdeas EuroDreams Historical Results](https://www.lotoideas.com/eurodreams-resultados-historicos-de-todos-los-sorteos/) page
  - The app automatically scrapes the page to find the "Valores separados por comas (.csv)" link
  - This ensures the latest Google Sheets URL is always used
- **Fallback 1**: Hardcoded Google Sheets CSV URL (used if dynamic discovery fails)
- **Fallback 2**: Embedded historical data in app.js (used for offline access)
- **Data Discovery Tools**: Use the included Python scrapers to discover and download data files from the official source (see [Scraper Guide](SCRAPER_GUIDE.md))

## Technical Details

- **Electron**: Cross-platform desktop app framework
- **Vite**: Fast build tool for modern web development
- **TypeScript**: For type-safe Electron main process code
- **Pure JavaScript**: Frontend uses vanilla JavaScript with no frameworks
- **Responsive Design**: Works on desktop displays of all sizes
- **Modern CSS**: Uses CSS Grid and Flexbox for layout

## Files

- `index.html`: Main application page
- `app.js`: Application logic with prediction algorithms
- `styles.css`: Responsive styling
- `electron/main.ts`: Electron main process (system integration)
- `electron/preload.ts`: Electron preload script (IPC bridge)
- `package.json`: Dependencies and scripts
- `tsconfig.json`: TypeScript config for frontend
- `tsconfig.electron.json`: TypeScript config for Electron
- `vite.config.ts`: Vite build configuration
- `scrape_downloads.py`: Simple Python script to list download links
- `download_data.py`: Advanced Python script to scrape and download data files
- `test_scraper.py`: Test script for the web scraper
- `requirements.txt`: Python dependencies

## Disclaimer

⚠️ **For entertainment purposes only. Play responsibly.**

This app does not guarantee winning numbers. Lottery draws are random events, and past results do not influence future outcomes. The predictions are based on statistical analysis and pattern recognition for entertainment purposes only.

## Development

### Local Development (Web Version)

To run the web version locally for development:

```bash
# Start Vite dev server
npm run dev

# Open browser to http://localhost:5173
```

### Electron Development

To run the Electron app in development mode:

```bash
npm run electron:dev
```

### Building for Production

```bash
# Build the Electron app for your platform
npm run electron:build
```

### Web Scraper for Download Links

The repository includes Python scripts to scrape and download data from the LotoIdeas website:

```bash
# Install Python dependencies
pip install -r requirements.txt

# List available download links
python3 scrape_downloads.py

# List all available data files with filtering options
python3 download_data.py

# Download all available data files
python3 download_data.py --download

# Download only CSV files
python3 download_data.py --download --file-type csv

# Download to a specific directory
python3 download_data.py --download --output-dir ./my_data

# Run tests to verify scraper functionality
python3 test_scraper.py
```

The scrapers automatically discover and list/download available files for:
- CSV files (`.csv`) - Comma-separated values
- Excel files (`.xlsx`) - Microsoft Excel format
- OpenDocument spreadsheets (`.ods`) - Open standard format
- PDF files (`.pdf`) - Portable Document Format
- Tab-separated values (`.tsv`) - Tab-delimited data

**Available Scripts:**
- `scrape_downloads.py` - Simple scraper that lists download links
- `download_data.py` - Advanced scraper with download capabilities and filtering
- `test_scraper.py` - Test suite for the scraper functionality

This allows you to find and download historical EuroDreams data files directly from the official source.

## Platform Support

The desktop application is built with Electron and supports:

- **Windows**: Windows 10 and later
- **macOS**: macOS 10.13 (High Sierra) and later
- **Linux**: Most modern distributions (AppImage format)
