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
  const oldDBVersion = getSetting("dbVersion") || 0;

  if (oldDBVersion === latestDBVersion) return;
  if (oldDBVersion === undefined || oldDBVersion < 4) migrateto4();
}

function migrateto4(): void {
  clearAllSettings();
  saveAllSettings({
    ...defaultSettings,
    dbVersion: 4,
    appVersion: app.getVersion(),
  });
}
