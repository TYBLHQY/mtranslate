import { BrowserWindow, clipboard } from "electron";

export async function captureWindow(mainWindow: BrowserWindow): Promise<void> {
  const image = await mainWindow.capturePage();
  clipboard.writeImage(image);
}
