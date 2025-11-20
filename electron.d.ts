export interface ElectronAPI {
  getLogPath: () => Promise<string>;
  openLogFolder: () => Promise<void>;
}

declare global {
  interface Window {
    electronAPI?: ElectronAPI;
  }
}
