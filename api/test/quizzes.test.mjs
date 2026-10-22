/* ტესტების (student/quizzes/*.js) სტრუქტურის შემოწმება. სერვერი არ სჭირდება: `npm test`.
   ამოწმებს, რომ კითხვები სწორადაა აღწერილი და id/max ემთხვევა API-ის კონფიგურაციას. */
import { test } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
import { fileURLToPath } from 'node:url';
import { QUIZZES } from '../src/config.js';

const STUDENT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../../student');
const DIR = path.join(STUDENT, 'quizzes');

function load(file) {
  const ctx = vm.createContext({});
  vm.runInContext(fs.readFileSync(path.join(DIR, file), 'utf8'), ctx, { filename: file });
  return { quiz: vm.runInContext('QUIZ', ctx), questions: vm.runInContext('QUESTIONS', ctx) };
}

const files = fs.readdirSync(DIR).filter(f => f.endsWith('.js')).sort();
const MARK = { html: '{}', js: '____' };
const TYPES = ['choice', 'order', 'bug', 'fill', 'match'];

test('every quiz file is registered in the API and the other way round', () => {
  assert.deepEqual(files.map(f => f.replace(/\.js$/, '')), Object.keys(QUIZZES).sort());
});

for (const file of files) {
  test(`${file}: definition and questions are consistent`, () => {
    const { quiz, questions } = load(file);
    assert.equal(file, `${quiz.id}.js`);
    assert.ok(QUIZZES[quiz.id], 'quiz id is missing from api/src/config.js');
    assert.equal(questions.length, QUIZZES[quiz.id].max, 'number of questions must equal max in api/src/config.js');
    const topics = QUIZZES[quiz.id].topics;
    if (topics) {
      // ყოველი კითხვის თემა კონფიგურაციის რიგსა და რაოდენობას უნდა ემთხვეოდეს (დაფა მათი მიხედვით აჯგუფებს შედეგებს)
      const expected = topics.flatMap(([name, n]) => Array(n).fill(name));
      assert.deepEqual(Array.from(questions, q => q.topic), expected, 'question topics must follow QUIZZES[...].topics in api/src/config.js');
    }
    assert.ok(['html', 'js'].includes(quiz.lang));
    assert.ok(quiz.title);
    if (quiz.hero) assert.ok(fs.existsSync(path.join(STUDENT, quiz.hero)), `missing ${quiz.hero}`);
    assert.equal(quiz.note.split(/(?<!\\)`/).length % 2, 1, 'unbalanced backticks in note');

    questions.forEach((q, i) => {
      const at = `${file} #${i + 1}`;
      assert.ok(TYPES.includes(q.type), `${at}: unknown type`);
      assert.ok(q.text && q.explain, `${at}: text and explain are required`);
      for (const field of [q.text, q.explain, ...(q.options || [])]) {
        assert.equal(field.split(/(?<!\\)`/).length % 2, 1, `${at}: unbalanced backticks in "${field.slice(0, 40)}"`);
        assert.ok(!/\*\*\p{L}/u.test(field), `${at}: markdown bold is not supported`);
      }
      if (q.image) assert.ok(fs.existsSync(path.join(STUDENT, q.image.src)), `${at}: missing ${q.image.src}`);

      switch (q.type) {
        case 'choice':
          assert.ok(q.options.length >= 3, `${at}: needs 3+ options`);
          assert.equal(new Set(q.options).size, q.options.length, `${at}: duplicate options`);
          assert.ok(Number.isInteger(q.answer) && q.answer >= 0 && q.answer < q.options.length, `${at}: bad answer index`);
          break;
        case 'order':
          assert.ok(q.lines.length >= 3, `${at}: needs 3+ lines`);
          assert.notDeepEqual(q.lines.map(l => l.trim()), [...q.lines].map(l => l.trim()).sort(), `${at}: alphabetical order would already be correct`);
          break;
        case 'bug':
          assert.ok(q.bugs.length >= 1 && q.bugs.every(n => Number.isInteger(n) && n >= 1 && n <= q.code.length), `${at}: bug line out of range`);
          assert.deepEqual(Object.keys(q.fix).map(Number).sort(), [...q.bugs].sort(), `${at}: fix must exist for each bug line`);
          for (const n of q.bugs) assert.notEqual(q.fix[n].trim(), q.code[n - 1].trim(), `${at}: fix for line ${n} equals the buggy line`);
          break;
        case 'fill': {
          const mark = MARK[quiz.lang];
          assert.equal(q.template.split(mark).length, 2, `${at}: template needs exactly one ${mark}`);
          assert.ok(q.accept.length > 0 && q.accept.every(a => a.trim()), `${at}: accept list`);
          break;
        }
        case 'match': {
          assert.ok(q.pairs.length >= 3, `${at}: needs 3+ pairs`);
          assert.equal(new Set(q.pairs.map(p => p[1])).size, q.pairs.length, `${at}: right-hand sides must be distinct`);
          assert.equal(new Set(q.pairs.map(p => p[0])).size, q.pairs.length, `${at}: left-hand sides must be distinct`);
          break;
        }
      }
    });
  });
}
