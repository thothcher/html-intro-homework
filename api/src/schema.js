import { LECTURERS } from './config.js';

/* ბაზის სქემა იქმნება პირველივე მოთხოვნისას (CREATE ... IF NOT EXISTS), ამიტომ ცალკე მიგრაციის გაშვება საჭირო არ არის. */
const TABLES = [
  `CREATE TABLE IF NOT EXISTS lecturers (
    id     INTEGER PRIMARY KEY AUTOINCREMENT,
    name   TEXT NOT NULL UNIQUE,
    sort   INTEGER NOT NULL DEFAULT 0,
    active INTEGER NOT NULL DEFAULT 1
  )`,
  `CREATE TABLE IF NOT EXISTS groups (
    key        TEXT PRIMARY KEY,
    label      TEXT NOT NULL,
    created_at TEXT NOT NULL
  )`,
  `CREATE TABLE IF NOT EXISTS results (
    id          INTEGER PRIMARY KEY AUTOINCREMENT,
    quiz        TEXT NOT NULL,
    name        TEXT NOT NULL,
    name_key    TEXT NOT NULL,
    lecturer_id INTEGER NOT NULL REFERENCES lecturers(id),
    group_key   TEXT NOT NULL REFERENCES groups(key),
    point       INTEGER NOT NULL,
    max_point   INTEGER NOT NULL,
    seconds     INTEGER NOT NULL,
    detail      TEXT NOT NULL,
    created_at  TEXT NOT NULL,
    UNIQUE (quiz, group_key, name_key)
  )`,
  'CREATE INDEX IF NOT EXISTS results_group ON results (group_key)'
];

let ready = null;

export function ensureReady(db) {
  if (!ready) ready = init(db).catch(err => { ready = null; throw err; });
  return ready;
}

async function init(db) {
  const marks = LECTURERS.map(() => '?').join(',');
  await db.batch([
    ...TABLES.map(sql => db.prepare(sql)),
    ...LECTURERS.map((name, i) =>
      db.prepare('INSERT INTO lecturers (name, sort, active) VALUES (?, ?, 1) ON CONFLICT(name) DO UPDATE SET sort = excluded.sort, active = 1').bind(name, i)),
    db.prepare(`UPDATE lecturers SET active = 0 WHERE name NOT IN (${marks})`).bind(...LECTURERS)
  ]);
}
