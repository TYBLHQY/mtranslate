import { electronAPI } from "@electron-toolkit/preload";
import { contextBridge, ipcRenderer } from "electron";

// Custom APIs for renderer
const api = {
  translate: {
    youdao: (data: { langfrom: string; langto: string; raw: string }) =>
      ipcRenderer.invoke("translate:youdao", data),
  },
  windowShown: (callback: () => void) => {
    ipcRenderer.on("window-shown", callback);
  },
};

// just add to the DOM global.
if (process.contextIsolated) {
  try {
    contextBridge.exposeInMainWorld("electron", electronAPI);
    contextBridge.exposeInMainWorld("api", api);
  } catch (error) {
    console.error(error);
  }
} else {
  // @ts-ignore (define in dts)
  window.electron = electronAPI;
  // @ts-ignore (define in dts)
  window.api = api;
}
