import { electronAPI } from "@electron-toolkit/preload";
import { contextBridge, ipcRenderer } from "electron";
import { API, QueryData } from "../common/types";

const api: API = {
  translate: {
    youdaoOld: (data: QueryData) => ipcRenderer.invoke("translate:youdao-old", data),
    youdaoNew: (data: QueryData) => ipcRenderer.invoke("translate:youdao-new", data),
  },
  font: {
    getFonts: () => ipcRenderer.invoke("font:get-fonts"),
  },
  windowShown: (callback: () => void) => {
    ipcRenderer.on("window-shown", callback);
  },
  setting: {
    getSettings: () => ipcRenderer.invoke("setting:get-settings"),
    setTheme: (theme: string) => ipcRenderer.invoke("setting:set-theme", theme),
    setFont: (font: string) => ipcRenderer.invoke("setting:set-font", font),
    setService: (service: string) => ipcRenderer.invoke("setting:set-service", service),
  },
};

if (process.contextIsolated) {
  contextBridge.exposeInMainWorld("electron", electronAPI);
  contextBridge.exposeInMainWorld("api", api);
} else {
  window.electron = electronAPI;
  window.api = api;
}
