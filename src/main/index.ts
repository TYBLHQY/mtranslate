import { electronApp, optimizer } from "@electron-toolkit/utils";
import { registerAllGlobalShortcut } from "@main/globalShortcuts";
import { registerIpcs } from "@main/ipcs";
import { closeDB, getDB } from "@main/store";
import { destroyTray, registerTray } from "@main/tray";
import { createMainWindow } from "@main/windows";
import { app, globalShortcut } from "electron";

if (!app.requestSingleInstanceLock()) {
  app.quit();
  process.exit(0);
}

app.whenReady().then(async () => {
  getDB();
  electronApp.setAppUserModelId("com.myq.mtranslate");
  const mainWindow = await createMainWindow();
  registerIpcs(mainWindow);
  registerTray(mainWindow);
  registerAllGlobalShortcut(mainWindow);
});

app.on("browser-window-created", (_, window) => optimizer.watchWindowShortcuts(window));
app.on("window-all-closed", () => {
  if (process.platform !== "darwin") app.quit();
});
app.on("will-quit", () => {
  globalShortcut.unregisterAll();
  destroyTray();
  closeDB();
});
