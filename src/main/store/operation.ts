import { defaultSettings, Settings } from "@common/types";
import { Statement } from "better-sqlite3";
import { getDB } from ".";

let getStmt: Statement;
let saveStmt: Statement;
let getAllStmt: Statement;

export function prepareStmts(): void {
  getStmt = getDB().prepare("SELECT value FROM settings WHERE key = ?");
  saveStmt = getDB().prepare(`
      INSERT INTO settings (key, value) VALUES (@key, @value)
      ON CONFLICT(key) DO UPDATE SET value = excluded.value
    `);
  getAllStmt = getDB().prepare("SELECT key, value FROM settings");
}

export function getSetting<K extends keyof Settings>(key: K): Settings[K] | undefined {
  const result = getStmt.get(key) as { value: string };
  if (result) return JSON.parse(result.value) as Settings[K];
  return undefined;
}

export function saveSetting<K extends keyof Settings>(key: K, value: Settings[K]): void {
  saveStmt.run({
    key: key,
    value: JSON.stringify(value),
  });
}

export function getAllSettings(): Settings {
  const rows = getAllStmt.all() as Array<{ key: string; value: string }>;
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

export function saveAllSettings(settings: Partial<Settings>): void {
  getDB().transaction((data: Partial<Settings>) => {
    (Object.keys(data) as Array<keyof Settings>).forEach(key =>
      saveStmt.run({ key: key, value: JSON.stringify(data[key]) }),
    );
  })(settings);
}

export function clearAllSettings(): void {
  getDB().prepare("DELETE FROM settings").run();
}
