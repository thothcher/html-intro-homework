/* ინტეგრაციული ტესტი მუშა სერვერზე. ჯერ გაუშვი `npm run dev` (სხვა ტერმინალში), მერე `npm test`.
   ლოკალური კოდი უნდა ემთხვეოდეს .dev.vars-ს: LECTURER_CODE=... (ან გადმოეცი გარემოს ცვლადით).
   ტესტი თავის ჩანაწერებს თავადვე შლის. */
import { test, after } from 'node:test';
import assert from 'node:assert/strict';

const API = process.env.API_URL || 'http://127.0.0.1:8787';
const CODE = process.env.LECTURER_CODE || 'change-me';   // = .dev.vars.example
const run = Math.random().toString(36).slice(2, 6).toUpperCase();
const GROUP = `T${run}-621-6`;
const QUIZ = 'html-intro-4';
const created = [];

async function call(method, path, body, code) {
  const headers = { 'Content-Type': 'application/json' };
  if (code !== undefined) headers['X-Access-Code'] = encodeURIComponent(code);
  const res = await fetch(API + path, { method, headers, body: body === undefined ? undefined : JSON.stringify(body) });
  return { status: res.status, headers: res.headers, data: await res.json().catch(() => null) };
}

const detail = n => '1'.repeat(n) + '0'.repeat(24 - n);
const attempt = (over = {}) => ({ quiz: QUIZ, name: `Test${run} Student`, lecturerId: 1, group: GROUP.toLowerCase(), point: 17, time: 600, detail: detail(17), ...over });
const listResults = async () => (await call('GET', '/api/results', undefined, CODE)).data.results;

after(async () => {
  for (const r of await listResults()) {
    if (r.name.startsWith(`Test${run}`)) await call('DELETE', `/api/results/${r.id}`, undefined, CODE);
  }
});

test('meta lists lecturers and quizzes without needing a code', async () => {
  const { status, data } = await call('GET', '/api/meta');
  assert.equal(status, 200);
  assert.ok(data.lecturers.length >= 6);
  assert.ok(data.lecturers.some(l => l.name === 'ლანა სტინი'));
  assert.equal(data.quizzes[0].id, QUIZ);
  assert.equal(data.configured, true);
});

test('CORS preflight allows the access-code header', async () => {
  const res = await fetch(API + '/api/results', { method: 'OPTIONS' });
  assert.equal(res.status, 204);
  assert.match(res.headers.get('access-control-allow-headers'), /X-Access-Code/i);
  assert.equal(res.headers.get('access-control-allow-origin'), '*');
});

test('results are for lecturers only', async () => {
  assert.equal((await call('GET', '/api/results')).status, 401);
  assert.equal((await call('GET', '/api/results', undefined, 'wrong')).status, 401);
  assert.equal((await call('GET', '/api/results', undefined, CODE)).status, 200);
  assert.equal((await call('DELETE', '/api/results/1')).status, 401);
});

test('a student can take the test once - case and word order do not matter', async () => {
  const who = { quiz: QUIZ, name: `Test${run} Student`, group: GROUP.toLowerCase() };
  const before = await call('POST', '/api/check', who);
  assert.deepEqual(before.data.taken, false);

  const first = await call('POST', '/api/submit', attempt());
  assert.equal(first.status, 201);

  const after1 = await call('POST', '/api/check', who);
  assert.equal(after1.data.taken, true);
  assert.equal('point' in after1.data, false, 'check must not leak the score');

  const again = await call('POST', '/api/submit', attempt({ name: `STUDENT  test${run}`, group: GROUP, point: 24, detail: detail(24) }));
  assert.equal(again.status, 409);
  assert.equal(again.data.error, 'already_submitted');

  const mine = (await listResults()).filter(r => r.name === `Test${run} Student`);
  assert.equal(mine.length, 1);
  assert.equal(mine[0].point, 17, 'the first attempt is the one that counts');
});

test('lower and upper case group names end up in the same group', async () => {
  await call('POST', '/api/submit', attempt({ name: `Test${run} Second`, group: GROUP }));
  await call('POST', '/api/submit', attempt({ name: `Test${run} Third`, group: GROUP.toLowerCase() }));
  const rows = (await listResults()).filter(r => r.name.startsWith(`Test${run}`));
  assert.equal(new Set(rows.map(r => r.group)).size, 1);
  const data = (await call('GET', '/api/results', undefined, CODE)).data;
  assert.equal(data.groups.filter(g => g.key === GROUP).length, 1);
  assert.equal(data.groups.find(g => g.key === GROUP).label, GROUP);
  assert.ok((await call('GET', '/api/meta')).data.groups.includes(GROUP));
});

test('bad input is rejected', async () => {
  const bad = async (over, error, field) => {
    const res = await call('POST', '/api/submit', attempt({ name: `Test${run} Bad`, ...over }));
    assert.equal(res.status, 400, JSON.stringify(over));
    assert.equal(res.data.error, error);
    if (field) assert.equal(res.data.field, field);
  };
  await bad({ name: 'Giorgi' }, 'bad_name', 'name');
  await bad({ group: '!!' }, 'bad_group', 'group');
  await bad({ group: 42 }, 'bad_group', 'group');
  await bad({ quiz: 'nope' }, 'bad_quiz', 'quiz');
  await bad({ lecturerId: 999 }, 'bad_lecturer', 'lecturer');
  await bad({ lecturerId: '1' }, 'bad_lecturer', 'lecturer');
  await bad({ point: 25, detail: detail(24) }, 'bad_result');
  await bad({ point: 10, detail: detail(11) }, 'bad_result');
  await bad({ detail: '1'.repeat(23) }, 'bad_result');
  await bad({ time: -5 }, 'bad_result');
  const junk = await fetch(API + '/api/submit', { method: 'POST', body: 'not json' });
  assert.equal(junk.status, 400);
  assert.equal((await listResults()).filter(r => r.name === `Test${run} Bad`).length, 0);
});

test('a lecturer can reset an attempt so the student may retake the test', async () => {
  const name = `Test${run} Retake`;
  assert.equal((await call('POST', '/api/submit', attempt({ name }))).status, 201);
  assert.equal((await call('POST', '/api/submit', attempt({ name }))).status, 409);
  const row = (await listResults()).find(r => r.name === name);
  assert.equal((await call('DELETE', `/api/results/${row.id}`, undefined, CODE)).data.deleted, 1);
  assert.equal((await call('POST', '/api/submit', attempt({ name, point: 20, detail: detail(20) }))).status, 201);
});
