import { LECTURERS, GROUPS } from './config.js';
import { normalizeGroup } from './normalize.js';

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
    created_at TEXT NOT NULL,
    archived   INTEGER NOT NULL DEFAULT 0,
    pinned     INTEGER NOT NULL DEFAULT 0
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


  // უკვე არსებულ ბაზას "archived" სვეტი ემატება (დაარქივებული ჯგუფი სტუდენტებს ჯგუფების ჩამონათვალში არ ეჩვენებათ)
  const cols = await db.prepare('PRAGMA table_info(groups)').all();
  if (!cols.results.some(c => c.name === 'archived')) {
    await db.prepare('ALTER TABLE groups ADD COLUMN archived INTEGER NOT NULL DEFAULT 0').run();
  }
  if (!cols.results.some(c => c.name === 'pinned')) {
    await db.prepare('ALTER TABLE groups ADD COLUMN pinned INTEGER NOT NULL DEFAULT 0').run();
  }

  // config.js-ში ჩამოთვლილი ჯგუფები ჩამონათვალში შედეგების გარეშეც ჩანს (pinned)
  const pinned = GROUPS.map(normalizeGroup);
  const now = new Date().toISOString();
  await db.batch([
    db.prepare('UPDATE groups SET pinned = 0'),
    ...pinned.map(g => db.prepare('INSERT OR IGNORE INTO groups (key, label, created_at) VALUES (?, ?, ?)').bind(g.key, g.label, now)),
    ...pinned.map(g => db.prepare('UPDATE groups SET pinned = 1, archived = 0 WHERE key = ?').bind(g.key))
  ]);
}
