import { test } from 'node:test';
import assert from 'node:assert/strict';
import { cleanName, nameKey, normalizeGroup } from '../src/normalize.js';

test('group: lower/upper case land on the same group', () => {
  for (const v of ['se-621-6', 'SE-621-6', 'Se-621-6', '  sE-621-6  ']) {
    assert.deepEqual(normalizeGroup(v), { label: 'SE-621-6', key: 'SE-621-6' }, v);
  }
});

test('group: underscore groups keep their label and match other separators', () => {
  assert.deepEqual(normalizeGroup('jp_539_4'), { label: 'JP_539_4', key: 'JP-539-4' });
  assert.equal(normalizeGroup('JP_539_4').key, normalizeGroup('jp-539-4').key);
});

test('group: spaces become separators', () => {
  assert.equal(normalizeGroup('se 621 6').label, 'SE-621-6');
  assert.equal(normalizeGroup('SE - 621 - 6').label, 'SE-621-6');
  assert.equal(normalizeGroup('SE--621__6').label, 'SE-621_6');
});

test('group: Georgian letters are not touched', () => {
  assert.equal(normalizeGroup('ინფ-21-3').label, 'ინფ-21-3');
});

test('group: junk is rejected', () => {
  for (const v of ['', ' ', 'X', '-SE-621', 'SE-621-', 'SE;DROP TABLE', '<b>SE</b>', 'A'.repeat(25), null, undefined, 42]) {
    assert.equal(normalizeGroup(v), null, String(v));
  }
});

test('name: needs a first and a last name', () => {
  assert.equal(cleanName('Giorgi'), null);
  assert.equal(cleanName('  '), null);
  assert.equal(cleanName('გიორგი ბერიძე'), 'გიორგი ბერიძე');
  assert.equal(cleanName('  Nika    Beridze \n'), 'Nika Beridze');
  assert.equal(cleanName('x'.repeat(61) + ' y'), null);
});

test('name: tags and control characters are stripped', () => {
  assert.equal(cleanName('<b>Nika</b> Beridze'), 'bNika/b Beridze');
  assert.equal(cleanName('Nika\u0000 Beridze'), 'Nika Beridze');
});

test('name key: case, spacing and word order do not matter', () => {
  const k = nameKey(cleanName('Giorgi Beridze'));
  assert.equal(nameKey(cleanName('giorgi   BERIDZE')), k);
  assert.equal(nameKey(cleanName('Beridze Giorgi')), k);
  assert.notEqual(nameKey(cleanName('Giorgi Beridzee')), k);
});
