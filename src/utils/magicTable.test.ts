import test from 'node:test';
import assert from 'node:assert/strict';
import { 
  MAGIC_COLUMNS, 
  calculateGuessedNumber, 
  getColumnIdsForNumber, 
  getBinaryString, 
  getMathFormula,
  getColumnsForMode,
  QUIZ_QUESTIONS
} from './magicTable';
import { decomposeNumberToPowers, generateSmartMagicianReply } from './magicianBrain';

test('Барлық 5 бағанда дәл 16 саннан бар (1-31 режимі)', () => {
  assert.equal(MAGIC_COLUMNS.length, 5);
  for (const col of MAGIC_COLUMNS) {
    assert.equal(col.numbers.length, 16, `${col.title} 16 саннан тұруы керек`);
  }
});

test('Әр бағанның сандары дұрыс екілік бит бойынша сәйкес келеді', () => {
  for (const col of MAGIC_COLUMNS) {
    for (const num of col.numbers) {
      assert.ok(num >= 1 && num <= 31);
      assert.equal((num & col.key), col.key, `${num} санында ${col.key} биті болуы керек`);
    }
  }
});

test('1-ден 31-ге дейінгі кез келген санның бағандар қосындысы дәл сол санды береді', () => {
  for (let n = 1; n <= 31; n++) {
    const colIds = getColumnIdsForNumber(n);
    const calculated = calculateGuessedNumber(colIds);
    assert.equal(calculated, n, `${n} саны қайта қалпына келтірілуі тиіс`);
  }
});

test('1-ден 10-ға дейінгі режимде (1-10) барлық сандар дұрыс есептеледі', () => {
  const cols10 = getColumnsForMode('1-10');
  assert.equal(cols10.length, 4);
  for (let n = 1; n <= 10; n++) {
    const colIds = getColumnIdsForNumber(n, '1-10');
    const calculated = calculateGuessedNumber(colIds, '1-10');
    assert.equal(calculated, n, `1-10 режиміндегі ${n} саны дұрыс табылуы тиіс`);
  }
});

test('1-ден 63-ке дейінгі шебер режимінде (1-63) барлық сандар дұрыс есептеледі', () => {
  const cols63 = getColumnsForMode('1-63');
  assert.equal(cols63.length, 6);
  for (let n = 1; n <= 63; n++) {
    const colIds = getColumnIdsForNumber(n, '1-63');
    const calculated = calculateGuessedNumber(colIds, '1-63');
    assert.equal(calculated, n, `1-63 режиміндегі ${n} саны дұрыс табылуы тиіс`);
  }
});

test('13 саны үшін тест: 8 + 4 + 1 = 13 (2-ші, 3-ші, 5-ші бағандар)', () => {
  const colIds = getColumnIdsForNumber(13);
  assert.deepEqual(colIds.sort(), [2, 3, 5]);
  assert.equal(calculateGuessedNumber(colIds), 13);
  
  const formula = getMathFormula(colIds);
  assert.equal(formula.formulaText, '8 + 4 + 1 = 13');
  assert.equal(formula.total, 13);
  assert.equal(formula.binaryRepresentation, '01101');
});

test('21 саны үшін тест: 16 + 4 + 1 = 21 (1-ші, 3-ші, 5-ші бағандар)', () => {
  const colIds = getColumnIdsForNumber(21);
  assert.deepEqual(colIds.sort(), [1, 3, 5]);
  assert.equal(calculateGuessedNumber(colIds), 21);
  const formula = getMathFormula(colIds);
  assert.equal(formula.formulaText, '16 + 4 + 1 = 21');
  assert.equal(formula.binaryRepresentation, '10101');
});

test('31 саны үшін тест: барлық 5 баған (16 + 8 + 4 + 2 + 1 = 31)', () => {
  const colIds = [1, 2, 3, 4, 5];
  assert.equal(calculateGuessedNumber(colIds), 31);
  const formula = getMathFormula(colIds);
  assert.equal(formula.formulaText, '16 + 8 + 4 + 2 + 1 = 31');
  assert.equal(formula.binaryRepresentation, '11111');
});

test('Ешбір баған таңдалмағанда 0 қайтарады', () => {
  assert.equal(calculateGuessedNumber([]), 0);
  const formula = getMathFormula([]);
  assert.equal(formula.total, 0);
  assert.equal(formula.formulaText, '0');
});

test('Білім тестінде дәл 10 сұрақ бар және әрқайсысының жауабы дұрыс индексте', () => {
  assert.equal(QUIZ_QUESTIONS.length, 10);
  for (const q of QUIZ_QUESTIONS) {
    assert.equal(q.options.length, 4);
    assert.ok(q.correctIndex >= 0 && q.correctIndex < 4);
    assert.ok(q.explanation.length > 10);
  }
});

test('Виртуалды Сиқыршы кез келген санды 2-нің дәрежелеріне дұрыс жіктеп жауап береді', () => {
  const dec = decomposeNumberToPowers(19);
  assert.deepEqual(dec.powers, [16, 2, 1]);
  assert.equal(dec.formula, '16 + 2 + 1 = 19');
  assert.equal(dec.binary, '10011');

  const reply = generateSmartMagicianReply('19 саны қалай шығады?');
  assert.ok(reply.includes('16 + 2 + 1 = 19'));
  assert.ok(reply.includes('10011'));
});

test('Виртуалды Сиқыршы сәлемдесуге және сұрақтарға қазақша мазмұнды жауап қайтарады', () => {
  const helloReply = generateSmartMagicianReply('Сәлем');
  assert.ok(helloReply.includes('Виртуалды Сиқыршы'));

  const secretReply = generateSmartMagicianReply('Фокустың құпиясы неде?', 13, [8, 4, 1]);
  assert.ok(secretReply.includes('8 + 4 + 1 = 13'));
});

