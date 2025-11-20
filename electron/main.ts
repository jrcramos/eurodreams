import { app, BrowserWindow, ipcMain } from 'electron';
import * as path from 'path';
import * as fs from 'fs';

let mainWindow: BrowserWindow | null = null;

// Setup logging
const logDir = path.join(app.getPath('userData'), 'logs');
const logFile = path.join(logDir, 'app.log');

// Ensure log directory exists
try {
  if (!fs.existsSync(logDir)) {
    fs.mkdirSync(logDir, { recursive: true });
  }
} catch (error) {
  console.error('Failed to create log directory:', error);
}

// Logging function
function log(message: string, level: 'INFO' | 'ERROR' | 'WARN' = 'INFO') {
  const timestamp = new Date().toISOString();
  const logMessage = `[${timestamp}] [${level}] ${message}\n`;
  
  // Write to console
  console.log(logMessage.trim());
  
  // Write to file
  try {
    fs.appendFileSync(logFile, logMessage);
  } catch (error) {
    console.error('Failed to write to log file:', error);
  }
}

// Log application start
log(`Application starting - Version ${app.getVersion()}`);
log(`Platform: ${process.platform}`);
log(`Electron version: ${process.versions.electron}`);
log(`Node version: ${process.versions.node}`);
log(`Log file location: ${logFile}`);

function createWindow() {
  log('Creating main window');
  
  mainWindow = new BrowserWindow({
    width: 1200,
    height: 900,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      preload: path.join(__dirname, 'preload.cjs'),
    },
    title: 'EuroDreams Predictor',
    autoHideMenuBar: true,
  });

  // In development, load from Vite dev server
  // In production, load from built files
  if (process.env.NODE_ENV === 'development') {
    const devUrl = 'http://localhost:5173';
    log(`Loading dev server from ${devUrl}`);
    mainWindow.loadURL(devUrl);
    mainWindow.webContents.openDevTools();
  } else {
    const indexPath = path.join(__dirname, '../dist/index.html');
    log(`Loading production build from ${indexPath}`);
    mainWindow.loadFile(indexPath).catch(error => {
      log(`Error loading index.html: ${error}`, 'ERROR');
    });
  }

  // Log when page finishes loading
  mainWindow.webContents.on('did-finish-load', () => {
    log('Page finished loading');
  });

  // Log any page load errors
  mainWindow.webContents.on('did-fail-load', (event, errorCode, errorDescription) => {
    log(`Page failed to load: ${errorCode} - ${errorDescription}`, 'ERROR');
  });

  // Log console messages from the renderer
  mainWindow.webContents.on('console-message', (event, level, message, line, sourceId) => {
    log(`Renderer console [${level}]: ${message} (${sourceId}:${line})`);
  });

  mainWindow.on('closed', () => {
    log('Main window closed');
    mainWindow = null;
  });
}

app.whenReady().then(() => {
  log('App ready, creating window');
  createWindow();

  app.on('activate', () => {
    log('App activated');
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

app.on('window-all-closed', () => {
  log('All windows closed');
  if (process.platform !== 'darwin') {
    log('Quitting app');
    app.quit();
  }
});

// IPC Handlers
ipcMain.handle('get-log-path', async () => {
  return logFile;
});

ipcMain.handle('open-log-folder', async () => {
  const { shell } = require('electron');
  shell.openPath(logDir);
});
