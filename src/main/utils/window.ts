import { is } from "@electron-toolkit/utils";
import { BrowserWindow, shell } from "electron";
import { join } from "path";
import icon from "../../../resources/icon.png?asset";
import { getSetting, saveSetting } from "./store";
import { debounce } from "./tools";

const windowConfig: Electron.BrowserWindowConstructorOptions = {
  resizable: false,
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

const debouncedWrite = debounce(async (bounds: Electron.Rectangle) => {
  saveSetting("bounds", bounds);
}, 500);

export async function createWindow(): Promise<BrowserWindow> {
  const mainWindow: BrowserWindow = new BrowserWindow({ ...windowConfig, ...getSetting("bounds") });

  mainWindow.on("ready-to-show", () => {
    if (!getSetting("silent")) mainWindow.show();
  });

  mainWindow.on("closed", () => {
    mainWindow?.destroy();
  });

  mainWindow.on("move", () => {
    const bounds = mainWindow.getBounds();
    debouncedWrite(bounds);
  });

  mainWindow.webContents.setWindowOpenHandler(details => {
    shell.openExternal(details.url);
    return { action: "deny" };
  });

  // HMR
  if (is.dev && process.env["ELECTRON_RENDERER_URL"])
    mainWindow.loadURL(process.env["ELECTRON_RENDERER_URL"]);
  else mainWindow.loadFile(join(__dirname, "../renderer/index.html"));

  return mainWindow;
}

export function toggleMainWindow(mainWindow: BrowserWindow): void {
  if (!mainWindow) {
    createWindow();
  } else if (mainWindow.isFocused()) {
    mainWindow.hide();
  } else if (mainWindow.isVisible()) {
    mainWindow.focus();
  } else {
    showMainWindow(mainWindow);
  }
}

export function showMainWindow(mainWindow: BrowserWindow): void {
  if (mainWindow.isMinimized()) mainWindow.restore();
  mainWindow.show();
  mainWindow.focus();
  mainWindow.webContents.send("window-shown");
}
