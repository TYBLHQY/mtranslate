import { electronApp, optimizer } from "@electron-toolkit/utils";
import { app, globalShortcut, ipcMain } from "electron";
import { Shortcut } from "src/common/types";
import { setupTransServices } from "./services";
import { captureWindow } from "./utils/capturer";
import { getSystemFonts } from "./utils/fonts";
import { registerGlobalShortcut, unregisterGlobalShortcut } from "./utils/globalShortcut";
import { closeDB, getAllSettings, saveSetting } from "./utils/store";
import { destroyTray, registerTray } from "./utils/tray";
import { createWindow } from "./utils/window";

if (!app.requestSingleInstanceLock()) {
  app.quit();
} else {
  app.whenReady().then(async () => {
    electronApp.setAppUserModelId("com.myq.mtranslate");
    app.on("browser-window-created", (_, window) => {
      optimizer.watchWindowShortcuts(window);
    });

    const { window } = await createWindow();

    setupTransServices();
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
      const settings = getAllSettings();
      unregisterGlobalShortcut(settings.globalShortcuts.find(s => s.id === shortcut.id)!);
      const updatedShortcuts = settings.globalShortcuts.map(s => (s.id === shortcut.id ? shortcut : s));
      saveSetting("globalShortcuts", updatedShortcuts);
      registerGlobalShortcut(window, shortcut);
    });

    registerTray(window);
    getAllSettings().globalShortcuts.forEach(shortcut => registerGlobalShortcut(window, shortcut));

    ipcMain.handle("window:capture", async () => await captureWindow(window));
  });

  app.on("window-all-closed", () => {
    if (process.platform !== "darwin") app.quit();
  });

  app.on("will-quit", () => {
    globalShortcut.unregisterAll();
    destroyTray();
    closeDB();
  });
}
