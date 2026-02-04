import { sendUpdateAvailable, sendUpdateDownloaded, sendUpdateDownloadProgress } from "@main/ipcs";
import { autoUpdater } from "electron-updater";

export function registerUpdate(window: Electron.BrowserWindow): void {
  autoUpdater.setFeedURL("https://github.com/TYBLHQY/mtranslate/releases/latest/download/");
  autoUpdater.autoDownload = false;
  autoUpdater.forceDevUpdateConfig = true;
  // autoUpdater.logger = null;
  autoUpdater.on("update-available", () => sendUpdateAvailable(window, true));
  autoUpdater.on("update-not-available", () => sendUpdateAvailable(window, false));
  autoUpdater.on("download-progress", progress => sendUpdateDownloadProgress(window, progress));
  autoUpdater.on("update-downloaded", () => sendUpdateDownloaded(window, true));
}

export function check(): void {
  autoUpdater.checkForUpdates();
}

export function download(): void {
  autoUpdater.downloadUpdate();
}

export function upgrade(window: Electron.BrowserWindow): void {
  window?.destroy();
  autoUpdater.quitAndInstall();
}
