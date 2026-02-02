import type { API } from "@common/types";
import type { electronAPI } from "@electron-toolkit/preload";

declare global {
  interface Window {
    electron: typeof electronAPI;
    api: API;
  }
}

export {};
