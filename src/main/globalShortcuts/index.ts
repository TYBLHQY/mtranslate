import { Shortcut } from "@common/types";
import { sendSelectedText } from "@main/ipcs";
import { getAllSettings } from "@main/store";
import { showMainWindow, toggleMainWindow } from "@main/windows";
import { BrowserWindow, globalShortcut } from "electron";
import { getSelectedText } from "node-get-selected-text";

export function registerAllGlobalShortcut(mainWindow: BrowserWindow): void {
  getAllSettings().globalShortcuts.forEach(shortcut => registerGlobalShortcut(mainWindow, shortcut));
}

export function registerGlobalShortcut(mainWindow: BrowserWindow, shortcut: Shortcut): void {
  if (!shortcut.key) return;
  globalShortcut.register(shortcut.key, async () => {
    if (shortcut.id === "openAndClose") {
      toggleMainWindow(mainWindow);
    } else if (shortcut.id === "copyText") {
      const selectedText = getSelectedText();
      await new Promise(_ => setTimeout(_, 300));
      sendSelectedText(mainWindow, selectedText);
      showMainWindow(mainWindow);
    }
  });
}

export function unregisterGlobalShortcut(shortcut: Shortcut): void {
  if (!shortcut.key) return;
  if (!globalShortcut.isRegistered(shortcut.key)) return;
  globalShortcut.unregister(shortcut.key);
}
