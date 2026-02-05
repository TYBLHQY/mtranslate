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
  if (oldDBVersion === undefined || oldDBVersion < 1) migrate0to1();
  if (oldDBVersion < 2) migrate1to2();
  if (oldDBVersion < 3) migrate2to3();
}

function migrate0to1(): void {
  clearAllSettings();
  saveAllSettings({
    ...defaultSettings,
    dbVersion: 1,
    appVersion: app.getVersion(),
  });
}

function migrate1to2(): void {
  saveAllSettings({
    ...getAllSettings(),
    dbVersion: 2,
    pronunciationMode: "hover",
  });
}

function migrate2to3(): void {
  const settings = getAllSettings();
  saveAllSettings({
    ...settings,
    dbVersion: 3,
    proxy: {
      mode: "system",
      url: "",
      port: 0,
      username: "",
      password: "",
      pacScript: "",
      proxyBypassRules: "",
    },
  });
}
