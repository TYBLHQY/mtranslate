import { BrowserWindow } from "electron";

export function sendSelectedText(mainWindow: BrowserWindow, text: string): void {
  mainWindow.webContents.send("selected-text", text);
}
