import initSqlJs, { Database } from 'sql.js';

let db: Database | null = null;
let SqlJs: Awaited<ReturnType<typeof initSqlJs>> | null = null;

async function getSqlJs() {
  if (!SqlJs) {
    SqlJs = await initSqlJs();
  }
  return SqlJs;
}

export async function getDb(): Promise<Database> {
  if (!db) {
    const SQL = await getSqlJs();
    db = new SQL.Database();
    createSchema();
  }
  return db;
}

export async function resetDb(): Promise<void> {
  if (db) {
    db.close();
    db = null;
  }
  const SQL = await getSqlJs();
  db = new SQL.Database();
  createSchema();
}

function createSchema(): void {
  db!.run(`
    CREATE TABLE IF NOT EXISTS movies (
      id        INTEGER PRIMARY KEY AUTOINCREMENT,
      year      INTEGER NOT NULL,
      title     TEXT    NOT NULL,
      studios   TEXT    NOT NULL,
      producers TEXT    NOT NULL,
      winner    INTEGER NOT NULL DEFAULT 0
    )
  `);
}
