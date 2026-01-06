"use strict";
const electron = require("electron");
electron.contextBridge.exposeInMainWorld("electronAPI", {
  // Platform info
  platform: process.platform,
  // Window controls (for custom title bar, if needed later)
  minimize: () => electron.ipcRenderer.send("window-minimize"),
  maximize: () => electron.ipcRenderer.send("window-maximize"),
  close: () => electron.ipcRenderer.send("window-close"),
  // App info
  getAppVersion: () => electron.ipcRenderer.invoke("get-app-version")
});
