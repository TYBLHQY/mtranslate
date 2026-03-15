import { Api, DeepLProSYGLang, FreeDictionaryService, IpcChannel, PronunciationMode, Proxy, Services, Shortcuts } from "@common/types";
import { electronAPI } from "@electron-toolkit/preload";
import { contextBridge, ipcRenderer } from "electron";
import { ProgressInfo } from "electron-updater";

const api: Api = {
  translate: {
    youdaoWebOld: (data: string) => invoke("translate:youdaoWebOld", data),
    youdaoWebNew: (data: string) => invoke("translate:youdaoWebNew", data),
    youdaoZhiYun: (data: string) => invoke("translate:youdaoZhiYun", data),
    deepLProSYG: (data: string) => invoke("translate:deepLProSYG", data),
    freeDictionary: (data: FreeDictionaryService["request"]) => invoke("translate:freeDictionary", data),
    freeDictionaryLanguages: () => invoke("translate:freeDictionaryLanguages"),
    deepLProSYGLang: (data: DeepLProSYGLang["request"]) => invoke("translate:deepLProSYGLang", data),
    deepLProSYGUsage: () => invoke("translate:deepLProSYGUsage"),
  },
  setting: {
    getSettings: () => invoke("setting:getSettings"),
    setTheme: (theme: string) => invoke("setting:setTheme", theme),
    setFont: (font: string) => invoke("setting:setFont", font),
    setService: (service: string) => invoke("setting:setService", service),
    setPronunciationMode: (mode: PronunciationMode) => invoke("setting:setPronunciationMode", mode),
    setResizable: (resizable: boolean) => invoke("setting:setResizable", resizable),
    setSilent: (silent: boolean) => invoke("setting:setSilent", silent),
    setAutoTranslate: (autoTranslate: boolean) => invoke("setting:setAutoTranslate", autoTranslate),
    setAutoTranslateDelay: (autoTranslateDelay: number) => invoke("setting:setAutoTranslateDelay", autoTranslateDelay),
    setGlobalShortcut: (id: keyof Shortcuts, map: string) => invoke("setting:setGlobalShortcut", id, map),
    setProxy: (proxy: Proxy) => invoke("setting:setProxy", proxy),
    setServiceConfig: <K extends keyof Services, T extends keyof Services[K]>(service: K, field: T, value: Services[K][T]) =>
      invoke("setting:setServiceConfig", service, field, value),
    setWindowToggleBehavior: (behavior: "focus-if-shown" | "hide-if-shown") => invoke("setting:setWindowToggleBehavior", behavior),
  },
  window: {
    capture: () => invoke("window:capture"),
    shown: (fn: () => void) => on("window:shown", fn),
    selectedText: (fn: (text: string) => void) => on("window:selectedText", (_, text) => fn(text)),
    openExternal: (url: string) => invoke("window:openExternal", url),
    getFonts: () => invoke("window:getFonts"),
  },
  update: {
    getAvailable: (fn: (available: boolean) => void) => on("update:getAvailable", (_, available) => fn(available)),
    getDownloadProgress: (fn: (progress: ProgressInfo) => void) => on("update:getDownloadProgress", (_, progress) => fn(progress)),
    getUpdateDownloaded: (fn: (downloaded: boolean) => void) => on("update:getUpdateDownloaded", (_, downloaded) => fn(downloaded)),
    check: () => invoke("update:check"),
    download: () => invoke("update:download"),
    upgrade: () => invoke("update:upgrade"),
  },
};

if (process.contextIsolated) {
  contextBridge.exposeInMainWorld("electron", electronAPI);
  contextBridge.exposeInMainWorld("api", api);
} else {
  window.electron = electronAPI;
  window.api = api;
}

// eslint-disable-next-line
function invoke(channel: IpcChannel, ...args: any[]): Promise<any> {
  return ipcRenderer.invoke(channel, ...args);
}
function on(channel: IpcChannel, listener: (event: Electron.IpcRendererEvent, ...args: any[]) => void): void {
  ipcRenderer.on(channel, listener);
}
