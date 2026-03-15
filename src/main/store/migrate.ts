import { defaultSettings } from "@common/types";
import { app } from "electron";
import { clearAllSettings, getAllSettings, getSetting, saveAllSettings, saveSetting } from "./operation";
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
  if (oldDBVersion === undefined || oldDBVersion < 6) to6();
  if (oldDBVersion < 7) to7();
}

function to6(): void {
  clearAllSettings();
  saveAllSettings({
    ...defaultSettings,
    dbVersion: 6,
    appVersion: app.getVersion(),
  });
}

// migrate to version 7: add freeDictionary service config, keep existing config unchanged
function to7(): void {
  const current = getAllSettings();
  const mergedServices = {
    ...current.servicesConfig,
    freeDictionary: defaultSettings.servicesConfig.freeDictionary,
  };

  saveAllSettings({
    ...current,
    servicesConfig: mergedServices,
    dbVersion: 7,
    appVersion: app.getVersion(),
  });
}
