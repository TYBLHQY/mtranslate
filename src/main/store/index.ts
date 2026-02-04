import Database from "better-sqlite3";
import { app } from "electron";
import path from "path";
import { initialize } from "./initialize";
import { migrate } from "./migrate";
import { prepareStmts } from "./operation";

const dbPath = path.join(app.getPath("userData"), "settings.db");
let db: Database.Database;

export function getDB(): Database.Database {
  if (!db) {
    db = new Database(dbPath);
    db.pragma("journal_mode = WAL");
    initialize();
    prepareStmts();
    migrate();
  }
  return db;
}

export function closeDB(): void {
  if (db) db.close();
}

export * from "./operation";
export * from "./version";
