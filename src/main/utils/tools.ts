import { BrowserWindow, clipboard } from "electron";

export async function captureWindow(mainWindow: BrowserWindow): Promise<void> {
  const image = await mainWindow.capturePage();
  clipboard.writeImage(image);
}

export function toFormUrlEncoded(params: Record<string, unknown>): string {
  const searchParams = new URLSearchParams();

  for (const [key, value] of Object.entries(params)) {
    if (value === undefined || value === null) continue;
    searchParams.append(key, String(value));
  }

  return searchParams.toString();
}
