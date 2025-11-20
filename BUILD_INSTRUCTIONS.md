# Build Instructions for EuroDreams Desktop App

## Prerequisites

- **Node.js**: Version 18 or higher
- **npm**: Comes with Node.js
- **Git**: For cloning the repository

## Installation

1. Clone the repository:
```bash
git clone https://github.com/jrcramos/eurodreams.git
cd eurodreams
```

2. Install dependencies:
```bash
npm install
```

This will install all required dependencies including Electron, Vite, TypeScript, and electron-builder.

## Development

### Running in Development Mode

Start the application in development mode with hot reload:

```bash
npm run electron:dev
```

This command:
1. Starts the Vite dev server on port 5173
2. Waits for the server to be ready
3. Launches Electron with the dev server URL
4. Opens DevTools for debugging

### Running Web Version Only

To test the web version without Electron:

```bash
npm run dev
```

Then open your browser to `http://localhost:5173`

## Building for Production

### Build Web Assets

Build the frontend assets with Vite:

```bash
npm run build
```

This creates optimized production files in the `dist` directory.

### Build Desktop Application

Build the complete Electron application for your platform:

```bash
npm run electron:build
```

This command:
1. Builds the frontend with Vite
2. Compiles TypeScript files for Electron
3. Renames .js files to .cjs
4. Packages the application with electron-builder

The installers will be created in the `release` directory:
- **Windows**: `.exe` installer (NSIS)
- **macOS**: `.dmg` installer
- **Linux**: `.AppImage` installer

### Building for Specific Platforms

To build for a specific platform:

```bash
# Windows
npm run electron:build -- --win

# macOS
npm run electron:build -- --mac

# Linux
npm run electron:build -- --linux
```

## Project Structure

```
eurodreams/
├── electron/           # Electron main process
│   ├── main.ts        # Main process entry point
│   └── preload.ts     # Preload script for IPC
├── scripts/           # Build scripts
│   └── rename-cjs.js  # Renames JS to CJS
├── dist/              # Built web assets (generated)
├── dist-electron/     # Built Electron code (generated)
├── release/           # Built installers (generated)
├── app.js             # Main application logic
├── index.html         # HTML entry point
├── styles.css         # Application styles
├── package.json       # Dependencies and scripts
├── tsconfig.json      # TypeScript config
├── vite.config.ts     # Vite configuration
└── README.md          # Documentation
```

## Available Scripts

- `npm run dev` - Start Vite dev server
- `npm run build` - Build frontend assets
- `npm run preview` - Preview production build
- `npm run electron:dev` - Run Electron in development mode
- `npm run electron:build` - Build desktop application
- `npm run electron:start` - Start built Electron app

## Troubleshooting

### Build Fails

If the build fails, try:
1. Delete `node_modules` and `package-lock.json`
2. Run `npm install` again
3. Run `npm run build` to verify Vite build works
4. Run `npm run electron:build` again

### Electron Won't Start

If Electron fails to start in development:
1. Check that port 5173 is not in use
2. Verify Node.js version is 18 or higher
3. Check the console for error messages

### Icons Not Found

If icons are missing in the built app:
1. Ensure icon files exist in the `build` directory
2. For Windows: `build/icon.ico`
3. For macOS: `build/icon.icns`
4. For Linux: Icons are generated from PNG files

## Python Scripts (Optional)

The repository includes Python scripts for scraping lottery data:

```bash
# Install Python dependencies
pip install -r requirements.txt

# List available downloads
python3 download_data.py

# Download data files
python3 download_data.py --download
```

These scripts are optional utilities and not required for the desktop app.

## Distribution

### Windows
The Windows installer (`.exe`) can be distributed directly to users. They can install it like any other Windows application.

### macOS
The macOS DMG file needs to be signed and notarized for distribution outside the Mac App Store. For development/testing, users may need to allow the app in System Preferences > Security & Privacy.

### Linux
The AppImage can be distributed directly and run on most Linux distributions without installation.

## License

Check the LICENSE file for licensing information.

## Support

For issues and questions, please open an issue on GitHub:
https://github.com/jrcramos/eurodreams/issues
