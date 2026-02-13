import { is } from "@electron-toolkit/utils";
import { sendWindowShown } from "@main/ipcs";
import { getSetting, saveSetting } from "@main/store";
import icon from "@resources/icon.png?asset";
import { BrowserWindow, shell } from "electron";
import { debounce } from "lodash-es";
import { join } from "path";

const windowConfig: Electron.BrowserWindowConstructorOptions = {
  minWidth: 330,
  minHeight: 600,
  show: false,
  autoHideMenuBar: true,
  ...(process.platform === "linux" ? { icon } : {}),
  webPreferences: {
    nodeIntegration: false,
    contextIsolation: true,
    preload: join(__dirname, "../preload/index.js"),
    sandbox: false,
  },
};

export async function createMainWindow(): Promise<BrowserWindow> {
  const window: BrowserWindow = new BrowserWindow({
    ...windowConfig,
    ...getSetting("bounds"),
    resizable: getSetting("resizable"),
  });

  window.on("ready-to-show", () => {
    if (!getSetting("silent")) window.show();
  });

  window.on("close", event => {
    if (is.dev) {
      window.close();
      return;
    }
    event.preventDefault();
    window.hide();
  });

  window.on("closed", () => {
    window?.destroy();
  });

  const debouncedSaveBounds = debounce((bounds: Electron.Rectangle) => saveSetting("bounds", bounds), 500, {
    leading: false,
    trailing: true,
    maxWait: 2000,
  });
  window.on("move", () => debouncedSaveBounds(window.getBounds()));

  window.webContents.setWindowOpenHandler(details => {
    shell.openExternal(details.url);
    return { action: "deny" };
  });

  // HMR
  if (is.dev && process.env["ELECTRON_RENDERER_URL"]) window.loadURL(process.env["ELECTRON_RENDERER_URL"]);
  else window.loadFile(join(__dirname, "../renderer/index.html"));

  return window;
}

export function toggleMainWindow(mainWindow: BrowserWindow): void {
  if (!mainWindow) createMainWindow();
  else if (mainWindow.isVisible()) mainWindow.hide();
  else showMainWindow(mainWindow);
}

export function showMainWindow(mainWindow: BrowserWindow): void {
  if (mainWindow.isMinimized()) mainWindow.restore();
  mainWindow.show();
  mainWindow.focus();
  sendWindowShown(mainWindow);
}
