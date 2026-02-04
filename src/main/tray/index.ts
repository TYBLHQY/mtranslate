import { toggleMainWindow } from "@main/windows";
import icon from "@resources/icon.png?asset";
import { app, BrowserWindow, Menu, nativeImage, Tray } from "electron";

let tray: Tray;

const buildMenu = (mainWindow: BrowserWindow): Menu => {
  return Menu.buildFromTemplate([
    { label: "Toggle Window", click: () => toggleMainWindow(mainWindow) },
    { type: "separator" },
    {
      label: "Quit",
      click: () => {
        mainWindow.destroy();
        app.quit();
      },
    },
  ]);
};

export function registerTray(mainWindow: BrowserWindow): void {
  try {
    const trayIcon = nativeImage.createFromPath(icon);
    tray = new Tray(trayIcon);
    tray.setToolTip("Electron App");
    tray.setContextMenu(buildMenu(mainWindow));
    tray.on("click", () => toggleMainWindow(mainWindow));
  } catch (e) {
    console.error("Failed to create tray:", e);
  }
}

export function destroyTray(): void {
  tray?.destroy();
}
