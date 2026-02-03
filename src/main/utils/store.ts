import Database, { Statement } from "better-sqlite3";
import { app } from "electron";
import path from "path";
import { defaultSettings, Settings } from "../../common/types";

const dbPath = path.join(app.getPath("userData"), "settings.db");
let db: Database.Database;

export function getDB(): Database.Database {
  if (!db) {
    db = new Database(dbPath);
    db.pragma("journal_mode = WAL");
    initializeSchema();
  }
  return db;
}

function initializeSchema(): void {
  getDB().exec(`
    CREATE TABLE IF NOT EXISTS settings (
      key TEXT PRIMARY KEY,
      value TEXT NOT NULL
    );
  `);
}

let getSettingStmt: Statement;
function initGetSettingStmt(): Statement {
  if (!getSettingStmt) getSettingStmt = getDB().prepare("SELECT value FROM settings WHERE key = ?");
  return getSettingStmt;
}
export function getSetting<K extends keyof Settings>(key: K): Settings[K] {
  const result = initGetSettingStmt().get(key) as { value: string };
  if (result) return JSON.parse(result.value) as Settings[K];
  return defaultSettings[key];
}

let saveSettingStmt: Statement;
function initSaveSettingStmt(): Statement {
  if (!saveSettingStmt)
    saveSettingStmt = getDB().prepare(`
      INSERT INTO settings (key, value) VALUES (@key, @value)
      ON CONFLICT(key) DO UPDATE SET value = excluded.value
    `);
  return saveSettingStmt;
}
export function saveSetting<K extends keyof Settings>(key: K, value: Settings[K]): void {
  initSaveSettingStmt().run({
    key: key,
    value: JSON.stringify(value),
  });
}

let getAllSettingsStmt: Statement;
function initGetAllSettingsStmt(): Statement {
  if (!getAllSettingsStmt) getAllSettingsStmt = getDB().prepare("SELECT key, value FROM settings");
  return getAllSettingsStmt;
}
export function getAllSettings(): Settings {
  const rows = initGetAllSettingsStmt().all() as Array<{ key: string; value: string }>;
  const settings: Settings = { ...defaultSettings };
  for (const row of rows) {
    const key = row.key as keyof Settings;
    if (key in settings) {
      const parsedValue = JSON.parse(row.value);
      (settings as Record<keyof Settings, unknown>)[key] = parsedValue;
    }
  }
  return settings;
}

let saveAllSettingsStmt: Statement;
function initSaveAllSettingsStmt(): Statement {
  if (!saveAllSettingsStmt)
    saveAllSettingsStmt = getDB().prepare(`
      INSERT INTO settings (key, value) VALUES (@key, @value)
      ON CONFLICT(key) DO UPDATE SET value = excluded.value
    `);
  return saveAllSettingsStmt;
}
export function saveAllSettings(settings: Partial<Settings>): void {
  initSaveAllSettingsStmt();
  getDB().transaction((data: Partial<Settings>) => {
    (Object.keys(data) as Array<keyof Settings>).forEach(key =>
      saveAllSettingsStmt.run({ key: key, value: JSON.stringify(data[key]) }),
    );
  })(settings);
}

export function closeDB(): void {
  if (db) db.close();
}
