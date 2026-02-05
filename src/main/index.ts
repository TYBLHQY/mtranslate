import { electronApp, optimizer } from "@electron-toolkit/utils";
import { registerAllGlobalShortcut } from "@main/globalShortcuts";
import { registerIpcs } from "@main/ipcs";
import { closeDB, getDB } from "@main/store";
import { destroyTray, registerTray } from "@main/tray";
import { createMainWindow } from "@main/windows";
import { app, globalShortcut } from "electron";
import { registerUpdate } from "./update";
import { registerProxy } from "./utils/proxy";

if (!app.requestSingleInstanceLock()) {
  app.quit();
  process.exit(0);
}

app.whenReady().then(async () => {
  getDB();
  electronApp.setAppUserModelId("com.myq.mtranslate");
  const mainWindow = await createMainWindow();
  registerProxy();
  registerIpcs(mainWindow);
  registerTray(mainWindow);
  registerAllGlobalShortcut(mainWindow);
  registerUpdate(mainWindow);
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
