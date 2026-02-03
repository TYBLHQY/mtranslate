import { BrowserWindow, globalShortcut } from "electron";
import { getSelectedText } from "node-get-selected-text";
import { Shortcut } from "src/common/types";
import { showMainWindow, toggleMainWindow } from "./window";

export function registerGlobalShortcut(mainWindow: BrowserWindow, shortcuts: Shortcut): void {
  if (!shortcuts.key) return;

  if (shortcuts.id === "openAndClose")
    globalShortcut.register(shortcuts.key, () => {
      toggleMainWindow(mainWindow);
    });
  else if (shortcuts.id === "copyText")
    globalShortcut.register(shortcuts.key, async () => {
      const selectedText = getSelectedText();
      await new Promise(_ => setTimeout(_, 100));
      mainWindow.webContents.send("selected-text", selectedText);
      showMainWindow(mainWindow);
    });
}

export function unregisterGlobalShortcut(shortcut: Shortcut): void {
  if (!shortcut.key) return;
  if (!globalShortcut.isRegistered(shortcut.key)) return;
  globalShortcut.unregister(shortcut.key);
}
