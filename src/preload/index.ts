import { API } from "@common/types";
import { electronAPI } from "@electron-toolkit/preload";
import { contextBridge, ipcRenderer } from "electron";

const api: API = {
  translate: {
    youdao: (data: { langfrom: string; langto: string; raw: string }) =>
      ipcRenderer.invoke("translate:youdao", data),
  },
  windowShown: (callback: () => void) => {
    ipcRenderer.on("window-shown", callback);
  },
};

if (process.contextIsolated) {
  contextBridge.exposeInMainWorld("electron", electronAPI);
  contextBridge.exposeInMainWorld("api", api);
} else {
  window.electron = electronAPI;
  window.api = api;
}
