import { defaultSettings } from "@common/types";
import { app } from "electron";
import { clearAllSettings, getSetting, saveAllSettings, saveSetting } from "./operation";
import { latestDBVersion } from "./version";

export function migrate(): void {
  migrateAppVersion();
  migrateDbVersion();
}

function migrateAppVersion(): void {
  const oldAppVersion = getSetting("appVersion");
  const nowAppVersion = app.getVersion();
  if (oldAppVersion === nowAppVersion) return;
  saveSetting("appVersion", nowAppVersion);
}

function migrateDbVersion(): void {
  let oldDBVersion = getSetting("dbVersion");
  const nowDBVersion = latestDBVersion;

  if (oldDBVersion === nowDBVersion) return;
  if (oldDBVersion === undefined || oldDBVersion < 1) {
    migrate0to1();
    oldDBVersion = 1;
  }
}

function migrate0to1(): void {
  clearAllSettings();
  saveAllSettings({
    ...defaultSettings,
    dbVersion: 1,
    appVersion: app.getVersion(),
  });
}
