import { IpcChannel, PronunciationMode, QueryData, Shortcut } from "@common/types";
import { registerGlobalShortcut, unregisterGlobalShortcut } from "@main/globalShortcuts";
import { transYoudaoNewService, transYoudaoOldService } from "@main/services";
import { getAllSettings, saveSetting } from "@main/store";
import { captureWindow, getSystemFonts } from "@main/utils";
import { ipcMain, shell } from "electron";

export function registerIpcs(window: Electron.BrowserWindow): void {
  // settings
  handle("setting:getSettings", async () => getAllSettings());
  handle("setting:setTheme", (_, theme: string) => saveSetting("theme", theme));
  handle("setting:setFont", (_, font: string) => saveSetting("font", font));
  handle("setting:setService", (_, service: string) => saveSetting("service", service));
  handle("setting:setPronunciationMode", (_, mode: PronunciationMode) =>
    saveSetting("pronunciationMode", mode),
  );
  handle("setting:setSilent", (_, silent: boolean) => saveSetting("silent", silent));
  handle("setting:setResizable", (_, resizable: boolean) => {
    saveSetting("resizable", resizable);
    window.resizable = resizable;
  });
  handle("setting:setGlobalShortcut", (_, shortcut: Shortcut) => {
    unregisterGlobalShortcut(getAllSettings().globalShortcuts.find(s => s.id === shortcut.id)!);
    saveSetting(
      "globalShortcuts",
      getAllSettings().globalShortcuts.map(s => (s.id === shortcut.id ? shortcut : s)),
    );
    registerGlobalShortcut(window, shortcut);
  });

  // window
  handle("window:capture", async () => await captureWindow(window));
  handle("window:getFonts", () => getSystemFonts());
  handle("window:openExternal", (_, url: string) => shell.openExternal(url));

  // translate services
  handle("translate:youdaoNew", async (_, data: QueryData) => transYoudaoNewService(data));
  handle("translate:youdaoOld", async (_, data: QueryData) => transYoudaoOldService(data));
}

function handle(
  channel: IpcChannel,
  listener: (event: Electron.IpcMainInvokeEvent, ...args: any[]) => unknown,
): void {
  ipcMain.handle(channel, listener);
}
