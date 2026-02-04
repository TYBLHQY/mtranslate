import { is } from "@electron-toolkit/utils";
import { getSetting, saveSetting } from "@main/store";
import { debounce } from "@main/utils";
import icon from "@resources/icon.png?asset";
import { BrowserWindow, shell } from "electron";
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

const debouncedWrite = debounce(async (bounds: Electron.Rectangle) => saveSetting("bounds", bounds), 500);

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
    event.preventDefault();
    window.hide();
  });

  window.on("closed", () => {
    window?.destroy();
  });

  window.on("move", () => {
    const bounds = window.getBounds();
    debouncedWrite(bounds);
  });

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
  mainWindow.webContents.send("window-shown");
}
