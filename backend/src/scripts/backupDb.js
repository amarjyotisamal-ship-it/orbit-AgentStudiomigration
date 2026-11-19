import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const here = path.dirname(fileURLToPath(import.meta.url));
const dbPath = path.join(here, "..", "..", "data", "poc.sqlite");
const backupDir = path.join(here, "..", "..", "data", "backups");

export function backupDatabase() {
  if (!fs.existsSync(dbPath)) return false;
  fs.mkdirSync(backupDir, { recursive: true });
  const backupFile = path.join(backupDir, `poc-backup-${Date.now()}.sqlite`);
  fs.copyFileSync(dbPath, backupFile);
  return backupFile;
}
