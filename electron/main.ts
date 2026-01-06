import { app, BrowserWindow, shell, Menu } from 'electron'
import { fileURLToPath } from 'node:url'
import path from 'node:path'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

// The built directory structure
//
// ├─┬ dist-electron
// │ └── main.js
// ├─┬ dist
// │ └── index.html
//
process.env.APP_ROOT = path.join(__dirname, '..')
export const VITE_DEV_SERVER_URL = process.env['VITE_DEV_SERVER_URL']
export const MAIN_DIST = path.join(process.env.APP_ROOT, 'dist-electron')
export const RENDERER_DIST = path.join(process.env.APP_ROOT, 'dist')

// Disable GPU Acceleration for Windows 7
if (process.platform === 'win32') {
    app.disableHardwareAcceleration()
}

// Set application name for Windows
if (process.platform === 'win32') {
    app.setAppUserModelId(app.getName())
}

let mainWindow: BrowserWindow | null = null

function createWindow() {
    mainWindow = new BrowserWindow({
        width: 1400,
        height: 900,
        minWidth: 1000,
        minHeight: 700,
        icon: path.join(process.env.APP_ROOT || '', 'public/synapse-icon.png'),
        title: 'Synapse',
        webPreferences: {
            preload: path.join(__dirname, 'preload.mjs'),
            nodeIntegration: false,
            contextIsolation: true,
        },
        // Modern frameless look (optional - remove if you want standard title bar)
        // frame: false,
        // titleBarStyle: 'hidden',
        backgroundColor: '#0a0a0f',
    })

    // Remove default menu for cleaner look
    Menu.setApplicationMenu(null)

    // Handle external links - open in browser
    mainWindow.webContents.setWindowOpenHandler(({ url }) => {
        shell.openExternal(url)
        return { action: 'deny' }
    })

    // Load the app
    if (VITE_DEV_SERVER_URL) {
        mainWindow.loadURL(VITE_DEV_SERVER_URL)
        // Open DevTools in development
        mainWindow.webContents.openDevTools()
    } else {
        mainWindow.loadFile(path.join(RENDERER_DIST, 'index.html'))
    }

    mainWindow.on('closed', () => {
        mainWindow = null
    })
}

// This method will be called when Electron has finished initialization
app.whenReady().then(createWindow)

// Quit when all windows are closed, except on macOS
app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit()
    }
})

// On macOS, re-create window when dock icon is clicked
app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
        createWindow()
    }
})
