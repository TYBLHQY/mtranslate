import { is } from "@electron-toolkit/utils";
import { BrowserWindow, shell } from "electron";
import { join } from "path";
import icon from "../../resources/icon.png?asset";

export function createWindow(): BrowserWindow {
  const mainWindow: BrowserWindow = new BrowserWindow({
    width: 330,
    height: 600,
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
  });

  mainWindow.on("ready-to-show", () => {
    // mainWindow?.show();
  });

  mainWindow.on("closed", () => {
    mainWindow?.destroy();
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
  mainWindow.focus(); // 推荐一起 focus，避免闪烁
  mainWindow.webContents.send("window-shown");
}
