import { Shortcut } from "@common/types";
import { getAllSettings } from "@main/store/operation";
import { showMainWindow, toggleMainWindow } from "@main/windows/mainWindow";
import { BrowserWindow, globalShortcut } from "electron";
import { getSelectedText } from "node-get-selected-text";

export function registerAllGlobalShortcut(mainWindow: BrowserWindow): void {
  getAllSettings().globalShortcuts.forEach(shortcut => registerGlobalShortcut(mainWindow, shortcut));
}

export function registerGlobalShortcut(mainWindow: BrowserWindow, shortcut: Shortcut): void {
  if (!shortcut.key) return;
  unregisterGlobalShortcut(shortcut);
  globalShortcut.register(shortcut.key, () => {
    if (shortcut.id === "openAndClose") {
      toggleMainWindow(mainWindow);
    } else if (shortcut.id === "copyText") {
      const selectedText = getSelectedText();
      mainWindow.webContents.send("selected-text", selectedText);
      showMainWindow(mainWindow);
    }
  });
}

export function unregisterGlobalShortcut(shortcut: Shortcut): void {
  if (!shortcut.key) return;
  if (!globalShortcut.isRegistered(shortcut.key)) return;
  globalShortcut.unregister(shortcut.key);
}
