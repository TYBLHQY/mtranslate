import { Shortcut } from "@common/types";
import { registerGlobalShortcut } from "@main/globalShortcuts";
import { getAllSettings, saveSetting } from "@main/store/operation";
import { getSystemFonts } from "@main/utils/fonts";
import { captureWindow } from "@main/utils/tools";
import { ipcMain } from "electron";

export function registerIpcs(window: Electron.BrowserWindow): void {
  ipcMain.handle("font:get-fonts", () => getSystemFonts());
  ipcMain.handle("setting:get-settings", async () => getAllSettings());
  ipcMain.handle("setting:set-theme", (_, theme: string) => saveSetting("theme", theme));
  ipcMain.handle("setting:set-font", (_, font: string) => saveSetting("font", font));
  ipcMain.handle("setting:set-service", (_, service: string) => saveSetting("service", service));
  ipcMain.handle("setting:set-silent", (_, silent: boolean) => saveSetting("silent", silent));
  ipcMain.handle("setting:set-resizable", (_, resizable: boolean) => {
    saveSetting("resizable", resizable);
    window.resizable = resizable;
  });
  ipcMain.handle("setting:set-global-shortcut", (_, shortcut: Shortcut) => {
    saveSetting(
      "globalShortcuts",
      getAllSettings().globalShortcuts.map(s => (s.id === shortcut.id ? shortcut : s)),
    );
    registerGlobalShortcut(window, shortcut);
  });
  ipcMain.handle("window:capture", async () => await captureWindow(window));
}
