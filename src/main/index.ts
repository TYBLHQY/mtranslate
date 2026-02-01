import { electronApp, optimizer } from "@electron-toolkit/utils";
import { app, BrowserWindow, globalShortcut } from "electron";
import { registerGlobalShortcut } from "./globalShortcut";
import { setupTranslateHandlers } from "./translate";
import { destroyTray, registerTray } from "./tray";
import { createWindow } from "./utils";

let mainWindow: BrowserWindow;

app.whenReady().then(() => {
  electronApp.setAppUserModelId("com.myq.mtranslate");
  app.on("browser-window-created", (_, window) => {
    optimizer.watchWindowShortcuts(window);
  });

  setupTranslateHandlers();
  mainWindow = createWindow();
  registerTray(mainWindow);
  registerGlobalShortcut(mainWindow);
});

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});

app.on("will-quit", () => {
  globalShortcut.unregisterAll();
  destroyTray();
});
