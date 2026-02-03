import { electronApp, optimizer } from "@electron-toolkit/utils";
import { app, BrowserWindow, globalShortcut, ipcMain } from "electron";
import { setupTransServices } from "./services";
import { getSystemFonts } from "./utils/fonts";
import { registerGlobalShortcut } from "./utils/globalShortcut";
import { closeDB, getAllSettings, saveSetting } from "./utils/store";
import { destroyTray, registerTray } from "./utils/tray";
import { createWindow } from "./utils/window";

let mainWindow: BrowserWindow;

app.whenReady().then(async () => {
  electronApp.setAppUserModelId("com.myq.mtranslate");
  app.on("browser-window-created", (_, window) => {
    optimizer.watchWindowShortcuts(window);
  });

  setupTransServices();

  ipcMain.handle("font:get-fonts", () => getSystemFonts());
  ipcMain.handle("setting:get-settings", async () => getAllSettings());
  ipcMain.handle("setting:set-theme", (_, theme: string) => saveSetting("theme", theme));
  ipcMain.handle("setting:set-font", (_, font: string) => saveSetting("font", font));
  ipcMain.handle("setting:set-service", (_, service: string) => saveSetting("service", service));

  mainWindow = await createWindow();
  registerTray(mainWindow);
  registerGlobalShortcut(mainWindow);
});

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") app.quit();
});

app.on("will-quit", () => {
  globalShortcut.unregisterAll();
  destroyTray();
  closeDB();
});
