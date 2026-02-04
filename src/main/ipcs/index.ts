import { IpcChannel, PronunciationMode, QueryData, Shortcut } from "@common/types";
import { registerGlobalShortcut, unregisterGlobalShortcut } from "@main/globalShortcuts";
import { transYoudaoNewService, transYoudaoOldService } from "@main/services";
import { getAllSettings, saveSetting } from "@main/store";
import { check, download, upgrade } from "@main/update";
import { captureWindow, getSystemFonts } from "@main/utils";
import { ipcMain, shell } from "electron";
import { ProgressInfo } from "electron-updater";

// handle
export function registerIpcs(window: Electron.BrowserWindow): void {
  // settings
  handle("setting:getSettings", async () => getAllSettings());
  handle("setting:setTheme", (_, theme: string) => saveSetting("theme", theme));
  handle("setting:setFont", (_, font: string) => saveSetting("font", font));
  handle("setting:setService", (_, service: string) => saveSetting("service", service));
  handle("setting:setPronunciationMode", (_, mode: PronunciationMode) =>
    saveSetting("pronunciationMode", mode),
  );
  handle("setting:setSilent", (_, silent: boolean) => saveSetting("silent", silent));
  handle("setting:setResizable", (_, resizable: boolean) => {
    saveSetting("resizable", resizable);
    window.resizable = resizable;
  });
  handle("setting:setGlobalShortcut", (_, shortcut: Shortcut) => {
    unregisterGlobalShortcut(getAllSettings().globalShortcuts.find(s => s.id === shortcut.id)!);
    saveSetting(
      "globalShortcuts",
      getAllSettings().globalShortcuts.map(s => (s.id === shortcut.id ? shortcut : s)),
    );
    registerGlobalShortcut(window, shortcut);
  });

  // window
  handle("window:capture", async () => await captureWindow(window));
  handle("window:getFonts", () => getSystemFonts());
  handle("window:openExternal", (_, url: string) => shell.openExternal(url));

  // translate services
  handle("translate:youdaoNew", async (_, data: QueryData) => transYoudaoNewService(data));
  handle("translate:youdaoOld", async (_, data: QueryData) => transYoudaoOldService(data));

  // update
  handle("update:check", async () => check());
  handle("update:download", async () => download());
  handle("update:upgrade", async () => upgrade(window));
}

// send
export function sendWindowShown(window: Electron.BrowserWindow): void {
  send(window, "window:shown");
}
export function sendSelectedText(window: Electron.BrowserWindow, text: string): void {
  send(window, "window:selectedText", text);
}
export function sendUpdateAvailable(window: Electron.BrowserWindow, available: boolean): void {
  send(window, "update:getAvailable", available);
}
export function sendUpdateDownloadProgress(window: Electron.BrowserWindow, progress: ProgressInfo): void {
  send(window, "update:getDownloadProgress", progress);
}
export function sendUpdateDownloaded(window: Electron.BrowserWindow, downloaded: boolean): void {
  send(window, "update:getUpdateDownloaded", downloaded);
}

// wrap
function handle(
  channel: IpcChannel,
  listener: (event: Electron.IpcMainInvokeEvent, ...args: any[]) => unknown,
): void {
  ipcMain.handle(channel, listener);
}
function send(window: Electron.BrowserWindow, channel: IpcChannel, ...args: any[]): void {
  window.webContents.send(channel, ...args);
}
