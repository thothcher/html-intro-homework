import { QUIZZES } from './config.js';
import { ensureReady } from './schema.js';
import { cleanName, nameKey, normalizeGroup } from './normalize.js';

/* Cloudflare Worker: სტუდენტების შედეგების API.
   სტუდენტის გვერდი:  GET /api/meta · POST /api/check · POST /api/submit   (საჯარო)
   ლექტორის გვერდი:   GET /api/results · DELETE /api/results/:id           (საჭიროა X-Access-Code) */

const CORS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, DELETE, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, X-Access-Code',
  'Access-Control-Max-Age': '86400'
};

class HttpError extends Error {
  constructor(status, code, field) {
    super(code);
    this.status = status;
    this.code = code;
    this.field = field;
  }
}

const json = (data, status = 200) => new Response(JSON.stringify(data), {
  status,
  headers: { ...CORS, 'Content-Type': 'application/json; charset=utf-8', 'Cache-Control': 'no-store' }
});

export default {
  async fetch(request, env) {
    if (request.method === 'OPTIONS') return new Response(null, { status: 204, headers: CORS });
    try {
      await ensureReady(env.DB);
      return await route(request, env);
    } catch (err) {
      if (err instanceof HttpError) return json({ error: err.code, field: err.field }, err.status);
      console.error(err);
      return json({ error: 'server_error' }, 500);
    }
  }
};

async function route(request, env) {
  const { pathname } = new URL(request.url);
  const method = request.method;
  if (pathname === '/api/meta' && method === 'GET') return meta(env);
  if (pathname === '/api/check' && method === 'POST') return check(request, env);
  if (pathname === '/api/submit' && method === 'POST') return submit(request, env);
  if (pathname === '/api/results' && method === 'GET') return results(request, env);
  const del = pathname.match(/^\/api\/results\/(\d+)$/);
  if (del && method === 'DELETE') return remove(request, env, Number(del[1]));
  if (pathname === '/' || pathname === '/api/health') return json({ ok: true });
  throw new HttpError(404, 'not_found');
}

/* ---------- დამხმარეები ---------- */

async function readBody(request) {
  const text = await request.text();
  if (text.length > 4096) throw new HttpError(413, 'too_large');
  try {
    const body = JSON.parse(text);
    if (body && typeof body === 'object' && !Array.isArray(body)) return body;
  } catch { /* ქვემოთ bad_json */ }
  throw new HttpError(400, 'bad_json');
}

// quiz + სახელი + ჯგუფი - /check და /submit ორივეს სჭირდება
function identify(body) {
  if (typeof body.quiz !== 'string' || !Object.hasOwn(QUIZZES, body.quiz)) throw new HttpError(400, 'bad_quiz', 'quiz');
  const name = cleanName(body.name);
  if (!name) throw new HttpError(400, 'bad_name', 'name');
  const group = normalizeGroup(body.group);
  if (!group) throw new HttpError(400, 'bad_group', 'group');
  return { quiz: body.quiz, max: QUIZZES[body.quiz].max, name, nameKey: nameKey(name), group };
}

async function safeEqual(a, b) {
  const enc = new TextEncoder();
  const [x, y] = await Promise.all([crypto.subtle.digest('SHA-256', enc.encode(a)), crypto.subtle.digest('SHA-256', enc.encode(b))]);
  const A = new Uint8Array(x), B = new Uint8Array(y);
  let diff = 0;
  for (let i = 0; i < A.length; i++) diff |= A[i] ^ B[i];
  return diff === 0;
}

// კოდი ჰედერში encodeURIComponent-ით მოდის (ჰედერში მხოლოდ ლათინური სიმბოლოებია დასაშვები)
async function requireLecturer(request, env) {
  if (!env.LECTURER_CODE) throw new HttpError(503, 'not_configured');
  let given = request.headers.get('X-Access-Code') ?? '';
  try { given = decodeURIComponent(given); } catch { /* დარჩეს როგორც არის */ }
  if (!(await safeEqual(given, String(env.LECTURER_CODE)))) throw new HttpError(401, 'bad_code');
}

const GROUPS_WITH_RESULTS = 'SELECT key, label FROM groups g WHERE EXISTS (SELECT 1 FROM results r WHERE r.group_key = g.key) ORDER BY label';

/* ---------- საჯარო: სტუდენტის გვერდი ---------- */

async function meta(env) {
  const [lecturers, groups] = await env.DB.batch([
    env.DB.prepare('SELECT id, name FROM lecturers WHERE active = 1 ORDER BY sort'),
    env.DB.prepare(GROUPS_WITH_RESULTS)
  ]);
  return json({
    configured: Boolean(env.LECTURER_CODE),
    lecturers: lecturers.results,
    groups: groups.results.map(g => g.label),
    quizzes: Object.entries(QUIZZES).map(([id, q]) => ({ id, ...q }))
  });
}

// ნიშნავს თუ არა ეს სახელი+ჯგუფი, რომ ტესტი უკვე გავლილია. ქულას არ აბრუნებს - ქულები მხოლოდ ლექტორებისთვისაა.
async function check(request, env) {
  const who = identify(await readBody(request));
  const row = await env.DB
    .prepare('SELECT 1 AS hit FROM results WHERE quiz = ? AND group_key = ? AND name_key = ?')
    .bind(who.quiz, who.group.key, who.nameKey)
    .first();
  return json({ taken: Boolean(row), group: who.group.label });
}

async function submit(request, env) {
  const body = await readBody(request);
  const who = identify(body);

  const lecturer = Number.isInteger(body.lecturerId)
    ? await env.DB.prepare('SELECT id FROM lecturers WHERE id = ? AND active = 1').bind(body.lecturerId).first()
    : null;
  if (!lecturer) throw new HttpError(400, 'bad_lecturer', 'lecturer');

  const { point, time, detail } = body;
  const ones = typeof detail === 'string' ? detail.split('1').length - 1 : -1;
  const valid = Number.isInteger(point) && point >= 0 && point <= who.max
    && Number.isInteger(time) && time >= 0
    && typeof detail === 'string' && detail.length === who.max && /^[01]+$/.test(detail)
    && ones === point;                       // ქულა უნდა ემთხვეოდეს სწორად მონიშნულ კითხვებს
  if (!valid) throw new HttpError(400, 'bad_result');
  const seconds = Math.max(1, Math.min(time, 86400));

  const now = new Date().toISOString();
  try {
    await env.DB.batch([
      env.DB.prepare('INSERT OR IGNORE INTO groups (key, label, created_at) VALUES (?, ?, ?)').bind(who.group.key, who.group.label, now),
      env.DB.prepare(`INSERT INTO results (quiz, name, name_key, lecturer_id, group_key, point, max_point, seconds, detail, created_at)
                      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`)
        .bind(who.quiz, who.name, who.nameKey, lecturer.id, who.group.key, point, who.max, seconds, detail, now)
    ]);
  } catch (err) {
    const text = `${err?.message ?? ''} ${err?.cause?.message ?? ''}`;
    if (/UNIQUE/i.test(text)) throw new HttpError(409, 'already_submitted');
    throw err;
  }
  return json({ ok: true, group: who.group.label }, 201);
}

/* ---------- მხოლოდ ლექტორებისთვის ---------- */

async function results(request, env) {
  await requireLecturer(request, env);
  const [lecturers, groups, rows] = await env.DB.batch([
    env.DB.prepare('SELECT id, name, active FROM lecturers ORDER BY sort'),
    env.DB.prepare(GROUPS_WITH_RESULTS),
    env.DB.prepare(`SELECT id, quiz, name, lecturer_id, group_key, point, max_point, seconds, detail, created_at
                    FROM results ORDER BY id LIMIT 20000`)
  ]);
  return json({
    quizzes: Object.entries(QUIZZES).map(([id, q]) => ({ id, ...q })),
    lecturers: lecturers.results.map(l => ({ id: l.id, name: l.name, active: Boolean(l.active) })),
    groups: groups.results,
    results: rows.results.map(r => ({
      id: r.id, quiz: r.quiz, name: r.name, lecturer: r.lecturer_id, group: r.group_key,
      point: r.point, max: r.max_point, time: r.seconds, detail: r.detail, at: r.created_at
    }))
  });
}

// ლექტორს შეუძლია ჩანაწერის წაშლა - სტუდენტს ტესტის თავიდან გავლის უფლება ეძლევა (მაგ. არასწორი ჯგუფი რომ ჩაწერა)
async function remove(request, env, id) {
  await requireLecturer(request, env);
  const res = await env.DB.prepare('DELETE FROM results WHERE id = ?').bind(id).run();
  return json({ ok: true, deleted: res.meta?.changes ?? 0 });
}
