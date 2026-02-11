import { Shortcuts } from "@common/types";
import { sendSelectedText } from "@main/ipcs";
import { getAllSettings, getSetting } from "@main/store";
import { showMainWindow, toggleMainWindow } from "@main/windows";
import { BrowserWindow, globalShortcut } from "electron";
import { getSelectedText } from "node-get-selected-text";

export function registerAllGlobalShortcut(mainWindow: BrowserWindow): void {
  Object.entries(getAllSettings().globalShortcuts).forEach(([id, map]) => registerGlobalShortcut(mainWindow, id as keyof Shortcuts, map));
}

export function registerGlobalShortcut(mainWindow: BrowserWindow, id: keyof Shortcuts, map: string): void {
  if (!map) return;
  if (globalShortcut.isRegistered(map)) return;
  globalShortcut.register(map, async () => {
    if (id === "openAndClose") {
      toggleMainWindow(mainWindow);
    } else if (id === "copyText") {
      const selectedText = getSelectedText();
      await new Promise(_ => setTimeout(_, 300));
      if (!selectedText) return;
      sendSelectedText(mainWindow, selectedText);
      showMainWindow(mainWindow);
    }
  });
}

export function unregisterGlobalShortcut(id: keyof Shortcuts): void {
  const map = getSetting("globalShortcuts")?.[id];
  if (!map) return;
  if (!globalShortcut.isRegistered(map)) return;
  globalShortcut.unregister(map);
}
