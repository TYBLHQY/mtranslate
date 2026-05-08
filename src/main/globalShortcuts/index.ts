import { Shortcuts } from "@common/types";
import { sendSelectedText } from "@main/ipcs";
import { getAllSettings, getSetting } from "@main/store";
import { showMainWindow, toggleMainWindow } from "@main/windows";
import { BrowserWindow, globalShortcut } from "electron";
import { delay } from "lodash-es";
import SelectionHook from "selection-hook";

const selectionHook = new SelectionHook();
selectionHook.start();

export function registerAllGlobalShortcut(mainWindow: BrowserWindow): void {
  Object.entries(getAllSettings().globalShortcuts).forEach(([id, accelerator]) =>
    registerGlobalShortcut(mainWindow, id as keyof Shortcuts, accelerator),
  );
}

const shortcutHandlers: Record<keyof Shortcuts, (mainWindow: BrowserWindow) => Promise<void>> = {
  openAndClose: async mainWindow => toggleMainWindow(mainWindow),
  copyText: async mainWindow => {
    const sel = selectionHook.getCurrentSelection();
    const text = sel?.text ?? "";
    delay(() => {
      if (!text) return;
      sendSelectedText(mainWindow, text);
      showMainWindow(mainWindow);
    }, 300);
  },
};

export function registerGlobalShortcut(mainWindow: BrowserWindow, id: keyof Shortcuts, accelerator: string): void {
  if (!accelerator) return;

  if (globalShortcut.isRegistered(accelerator)) return;

  const handler = shortcutHandlers[id];
  if (!handler) {
    console.warn(`No handler defined for shortcut id=${id}`);
    return;
  }

  globalShortcut.register(accelerator, async () => {
    try {
      await handler(mainWindow);
    } catch (err) {
      console.error(`Global shortcut handler failed (id=${id}, accelerator=${accelerator}):`, err);
    }
  });
}

export function unregisterGlobalShortcut(id: keyof Shortcuts): void {
  const map = getSetting("globalShortcuts")?.[id];
  if (!map) return;
  try {
    if (!globalShortcut.isRegistered(map)) return;
    globalShortcut.unregister(map);
  } catch (e) {
    console.error(`Failed to unregister global shortcut (id=${id}, map=${map}):`, e);
  }
}
