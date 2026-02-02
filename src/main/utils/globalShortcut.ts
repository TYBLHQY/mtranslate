import { BrowserWindow, globalShortcut } from "electron";
import { toggleMainWindow } from "./window";

export function registerGlobalShortcut(mainWindow: BrowserWindow): void {
  globalShortcut.register("Control+Shift+Space", () => {
    toggleMainWindow(mainWindow);
  });
  // globalShortcut.register("Control+Space", () => {
  //   // 获取选中文字
  // });
}
