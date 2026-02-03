import { electronAPI } from "@electron-toolkit/preload";
import { contextBridge, ipcRenderer } from "electron";
import { API, QueryData, Shortcut } from "../common/types";

const api: API = {
  windowShown: (callback: () => void) => {
    ipcRenderer.on("window-shown", callback);
  },
  selectedText: (callback: (text: string) => void) => {
    ipcRenderer.on("selected-text", (_, text) => callback(text));
  },
  translate: {
    youdaoOld: (data: QueryData) => ipcRenderer.invoke("translate:youdao-old", data),
    youdaoNew: (data: QueryData) => ipcRenderer.invoke("translate:youdao-new", data),
  },
  font: {
    getFonts: () => ipcRenderer.invoke("font:get-fonts"),
  },
  setting: {
    getSettings: () => ipcRenderer.invoke("setting:get-settings"),
    setTheme: (theme: string) => ipcRenderer.invoke("setting:set-theme", theme),
    setFont: (font: string) => ipcRenderer.invoke("setting:set-font", font),
    setService: (service: string) => ipcRenderer.invoke("setting:set-service", service),
    setResizable: (resizable: boolean) => ipcRenderer.invoke("setting:set-resizable", resizable),
    setSilent: (silent: boolean) => ipcRenderer.invoke("setting:set-silent", silent),
    setGlobalShortcut: (shortcut: Shortcut) => ipcRenderer.invoke("setting:set-global-shortcut", shortcut),
  },
};

if (process.contextIsolated) {
  contextBridge.exposeInMainWorld("electron", electronAPI);
  contextBridge.exposeInMainWorld("api", api);
} else {
  window.electron = electronAPI;
  window.api = api;
}
