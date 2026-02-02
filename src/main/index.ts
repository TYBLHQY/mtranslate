import { electronApp, optimizer } from "@electron-toolkit/utils";
import { app, BrowserWindow, globalShortcut } from "electron";
import { setupTranslateHandlers } from "./services/translate";
import { registerGlobalShortcut } from "./utils/globalShortcut";
import { closeDB } from "./utils/store";
import { destroyTray, registerTray } from "./utils/tray";
import { createWindow } from "./utils/window";

let mainWindow: BrowserWindow;

app.whenReady().then(async () => {
  electronApp.setAppUserModelId("com.myq.mtranslate");
  app.on("browser-window-created", (_, window) => {
    optimizer.watchWindowShortcuts(window);
  });

  setupTranslateHandlers();
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
