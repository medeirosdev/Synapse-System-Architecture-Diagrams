import { contextBridge, ipcRenderer } from 'electron'

// Expose protected methods that allow the renderer process to use
// the ipcRenderer without exposing the entire object
contextBridge.exposeInMainWorld('electronAPI', {
    // Platform info
    platform: process.platform,

    // Window controls (for custom title bar, if needed later)
    minimize: () => ipcRenderer.send('window-minimize'),
    maximize: () => ipcRenderer.send('window-maximize'),
    close: () => ipcRenderer.send('window-close'),

    // App info
    getAppVersion: () => ipcRenderer.invoke('get-app-version'),
})

// Type declarations for TypeScript
declare global {
    interface Window {
        electronAPI: {
            platform: string
            minimize: () => void
            maximize: () => void
            close: () => void
            getAppVersion: () => Promise<string>
        }
    }
}
