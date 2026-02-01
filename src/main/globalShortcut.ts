import { BrowserWindow, globalShortcut } from "electron";
import { toggleMainWindow } from "./utils";

export function registerGlobalShortcut(mainWindow: BrowserWindow): void {
  try {
    const registered = globalShortcut.register("Control+Shift+Space", () => {
      toggleMainWindow(mainWindow);
    });
    if (!registered) console.warn("Global shortcut registration failed");
  } catch (e) {
    console.error("Failed to register global shortcut:", e);
  }
}
