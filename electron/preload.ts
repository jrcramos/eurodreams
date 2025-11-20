import { contextBridge, ipcRenderer } from 'electron';

// Expose protected methods that allow the renderer process to use
// the ipcRenderer without exposing the entire object
contextBridge.exposeInMainWorld('electronAPI', {
  getLogPath: () => ipcRenderer.invoke('get-log-path'),
  openLogFolder: () => ipcRenderer.invoke('open-log-folder'),
});
