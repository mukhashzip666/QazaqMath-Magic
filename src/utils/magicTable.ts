/**
 * «Сиқырлы кесте» математикалық фокусының логикасы
 * Екілік санау жүйесі мен 2-нің дәрежелеріне (32, 16, 8, 4, 2, 1) негізделген.
 */

export type GameRangeMode = '1-10' | '1-15' | '1-31' | '1-63';

export interface MagicColumn {
  id: number;          // 0 (for 32), 1 (16), 2 (8), 3 (4), 4 (2), 5 (1)
  title: string;       // «1-баған»
  key: number;         // 32, 16, 8, 4, 2, 1
  powerOfTwo: number;  // 5, 4, 3, 2, 1, 0
  numbers: number[];   // бағандағы сандар
  colorTheme: string;  // styling accent
}

export const MAGIC_COLUMNS: MagicColumn[] = [
  {
    id: 1,
    title: '1-баған',
    key: 16,
    powerOfTwo: 4,
    numbers: [16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31],
    colorTheme: 'from-purple-500/20 to-indigo-500/20 text-purple-300 border-purple-500/30'
  },
  {
    id: 2,
    title: '2-баған',
    key: 8,
    powerOfTwo: 3,
    numbers: [8, 9, 10, 11, 12, 13, 14, 15, 24, 25, 26, 27, 28, 29, 30, 31],
    colorTheme: 'from-blue-500/20 to-cyan-500/20 text-cyan-300 border-cyan-500/30'
  },
  {
    id: 3,
    title: '3-баған',
    key: 4,
    powerOfTwo: 2,
    numbers: [4, 5, 6, 7, 12, 13, 14, 15, 20, 21, 22, 23, 28, 29, 30, 31],
    colorTheme: 'from-teal-500/20 to-emerald-500/20 text-teal-300 border-teal-500/30'
  },
  {
    id: 4,
    title: '4-баған',
    key: 2,
    powerOfTwo: 1,
    numbers: [2, 3, 6, 7, 10, 11, 14, 15, 18, 19, 22, 23, 26, 27, 30, 31],
    colorTheme: 'from-amber-500/20 to-yellow-500/20 text-amber-300 border-amber-500/30'
  },
  {
    id: 5,
    title: '5-баған',
    key: 1,
    powerOfTwo: 0,
    numbers: [1, 3, 5, 7, 9, 11, 13, 15, 17, 19, 21, 23, 25, 27, 29, 31],
    colorTheme: 'from-rose-500/20 to-pink-500/20 text-rose-300 border-rose-500/30'
  }
];

/**
 * Берілген диапазон режимі бойынша бағандарды генерациялау
 */
export function getColumnsForMode(mode: GameRangeMode = '1-31'): MagicColumn[] {
  if (mode === '1-31') {
    return MAGIC_COLUMNS;
  }

  const maxNum = mode === '1-10' ? 10 : mode === '1-15' ? 15 : 63;
  const keys =
    mode === '1-10' || mode === '1-15'
      ? [
          { id: 2, key: 8, power: 3, theme: 'from-blue-500/20 to-cyan-500/20 text-cyan-300 border-cyan-500/30' },
          { id: 3, key: 4, power: 2, theme: 'from-teal-500/20 to-emerald-500/20 text-teal-300 border-teal-500/30' },
          { id: 4, key: 2, power: 1, theme: 'from-amber-500/20 to-yellow-500/20 text-amber-300 border-amber-500/30' },
          { id: 5, key: 1, power: 0, theme: 'from-rose-500/20 to-pink-500/20 text-rose-300 border-rose-500/30' },
        ]
      : [
          { id: 0, key: 32, power: 5, theme: 'from-fuchsia-500/20 to-purple-500/20 text-fuchsia-300 border-fuchsia-500/30' },
          { id: 1, key: 16, power: 4, theme: 'from-purple-500/20 to-indigo-500/20 text-purple-300 border-purple-500/30' },
          { id: 2, key: 8, power: 3, theme: 'from-blue-500/20 to-cyan-500/20 text-cyan-300 border-cyan-500/30' },
          { id: 3, key: 4, power: 2, theme: 'from-teal-500/20 to-emerald-500/20 text-teal-300 border-teal-500/30' },
          { id: 4, key: 2, power: 1, theme: 'from-amber-500/20 to-yellow-500/20 text-amber-300 border-amber-500/30' },
          { id: 5, key: 1, power: 0, theme: 'from-rose-500/20 to-pink-500/20 text-rose-300 border-rose-500/30' },
        ];

  return keys.map((item, idx) => {
    const nums: number[] = [];
    for (let n = 1; n <= maxNum; n++) {
      if ((n & item.key) === item.key) {
        nums.push(n);
      }
    }
    return {
      id: item.id,
      title: `${idx + 1}-баған`,
      key: item.key,
      powerOfTwo: item.power,
      numbers: nums,
      colorTheme: item.theme,
    };
  });
}

export function getMaxNumberForMode(mode: GameRangeMode): number {
  switch (mode) {
    case '1-10': return 10;
    case '1-15': return 15;
    case '1-31': return 31;
    case '1-63': return 63;
  }
}

/**
 * Таңдалған бағандардың кілттерін қосу арқылы жасырын санды есептеу
 */
export function calculateGuessedNumber(selectedColumnIds: number[], mode: GameRangeMode = '1-31'): number {
  const cols = getColumnsForMode(mode);
  return selectedColumnIds.reduce((sum, colId) => {
    const col = cols.find(c => c.id === colId);
    return sum + (col ? col.key : 0);
  }, 0);
}

/**
 * Берілген санның қай бағандарда бар екенін анықтау (екілік талдау)
 */
export function getColumnIdsForNumber(num: number, mode: GameRangeMode = '1-31'): number[] {
  const max = getMaxNumberForMode(mode);
  if (num < 1 || num > max) return [];
  const cols = getColumnsForMode(mode);
  return cols
    .filter(col => (num & col.key) === col.key)
    .map(col => col.id);
}

/**
 * Санды екілік жүйеге айналдыру (мысалы 13 -> "01101")
 */
export function getBinaryString(num: number, mode: GameRangeMode = '1-31'): string {
  const bits = mode === '1-10' || mode === '1-15' ? 4 : mode === '1-63' ? 6 : 5;
  const max = getMaxNumberForMode(mode);
  if (num < 1 || num > max) return '0'.repeat(bits);
  return num.toString(2).padStart(bits, '0');
}

/**
 * Есептеу формуласын құрастыру (мысалы, 13 саны үшін: "8 + 4 + 1 = 13")
 */
export function getMathFormula(selectedColumnIds: number[], mode: GameRangeMode = '1-31'): {
  formulaText: string;
  selectedKeys: number[];
  powersExplanation: string;
  binaryRepresentation: string;
  total: number;
} {
  const cols = getColumnsForMode(mode);
  const sortedCols = cols
    .filter(c => selectedColumnIds.includes(c.id))
    .sort((a, b) => b.key - a.key);
  
  const total = sortedCols.reduce((sum, c) => sum + c.key, 0);
  const selectedKeys = sortedCols.map(c => c.key);
  
  const formulaText = selectedKeys.length > 0 
    ? `${selectedKeys.join(' + ')} = ${total}` 
    : '0';

  const powersExplanation = sortedCols.length > 0
    ? sortedCols.map(c => `2^${c.powerOfTwo} (${c.key})`).join(' + ')
    : '';

  const bits = cols.map(c => (selectedColumnIds.includes(c.id) ? '1' : '0')).join('');
  const binaryRepresentation = total > 0 ? bits : '0'.repeat(cols.length);

  return {
    formulaText,
    selectedKeys,
    powersExplanation,
    binaryRepresentation,
    total
  };
}

/**
 * 10 сұрақтан тұратын білім тесті («1-ден 10-ға дейін» жобалық викторина)
 */
export interface QuizQuestion {
  id: number;
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}

export const QUIZ_QUESTIONS: QuizQuestion[] = [
  {
    id: 1,
    question: '«Сиқырлы кесте» фокусы математиканың қандай санау жүйесіне негізделген?',
    options: [
      'Ондық санау жүйесіне (0–9)',
      'Екілік санау жүйесіне (0 және 1)',
      'Рим цифрларына (I, V, X)',
      'Он алтылық санау жүйесіне',
    ],
    correctIndex: 1,
    explanation: 'Фокус толығымен екілік санау жүйесіне (binary system) негізделген: әр бағанның таңдалуы 1-ді, таңдалмауы 0-ді білдіреді.',
  },
  {
    id: 2,
    question: '1 мен 31 аралығындағы классикалық кестенің 5 бағанындағы жасырын кілт сандар қандай?',
    options: [
      '1, 3, 5, 7, 9',
      '5, 10, 15, 20, 25',
      '16, 8, 4, 2, 1',
      '31, 15, 7, 3, 1',
    ],
    correctIndex: 2,
    explanation: 'Жасырын кілттер — 2 санының дәрежелері: 2⁴=16, 2³=8, 2²=4, 2¹=2, 2⁰=1.',
  },
  {
    id: 3,
    question: 'Егер пайдаланушы тек 2-бағанды (кілті 8), 3-бағанды (кілті 4) және 5-бағанды (кілті 1) белгілесе, ол қай санды ойлаған?',
    options: [
      '11 санын',
      '13 санын',
      '15 санын',
      '12 санын',
    ],
    correctIndex: 1,
    explanation: 'Кілттерді қосамыз: 8 + 4 + 1 = 13. Екілік коды: 01101₂.',
  },
  {
    id: 4,
    question: '25 саны қай кілт сандардың қосындысынан құралады?',
    options: [
      '16 + 8 + 1',
      '16 + 4 + 2 + 1',
      '16 + 8 + 2',
      '8 + 4 + 2 + 1',
    ],
    correctIndex: 0,
    explanation: '25 = 16 + 8 + 1. Яғни 25 саны тек 1-ші, 2-ші және 5-ші бағандарда кездеседі.',
  },
  {
    id: 5,
    question: 'Неліктен 5-ші бағанда (кілті 1) тек тақ сандар (1, 3, 5, 7, ..., 31) орналасқан?',
    options: [
      'Кездейсоқ таңдалған',
      'Өйткені 16, 8, 4, 2 — жұп сандар, тақ сан алу үшін міндетті түрде +1 қосылуы керек',
      'Кесте әдемі көрінуі үшін',
      'Жұп сандар сыймай қалғандықтан',
    ],
    correctIndex: 1,
    explanation: '16, 8, 4, 2 — бәрі жұп сандар. Олардың кез келген қосындысы жұп болады. Сондықтан тақ сан шығуы үшін міндетті түрде соңғы разрядтағы 1 қосылуы шарт!',
  },
  {
    id: 6,
    question: 'Егер ойлаған сан барлық 5 бағанда да кездессе, ол қандай сан?',
    options: [
      '16',
      '30',
      '31',
      '32',
    ],
    correctIndex: 2,
    explanation: 'Барлық 5 кілттің қосындысы: 16 + 8 + 4 + 2 + 1 = 31 (екілік жүйеде: 11111₂).',
  },
  {
    id: 7,
    question: 'Кестеге 6-шы бағанды (кілті 32 = 2⁵) қоссақ, ең үлкен қандай санға дейін табуға болады?',
    options: [
      '50-ге дейін',
      '60-қа дейін',
      '63-ке дейін',
      '64-ке дейін',
    ],
    correctIndex: 2,
    explanation: '32 + 16 + 8 + 4 + 2 + 1 = 63 (формула бойынша: 2⁶ - 1 = 64 - 1 = 63).',
  },
  {
    id: 8,
    question: '10 саны екілік санау жүйесінде (4 битпен) қалай жазылады?',
    options: [
      '1010₂ (8 + 2)',
      '1100₂ (8 + 4)',
      '1001₂ (8 + 1)',
      '0111₂ (4 + 2 + 1)',
    ],
    correctIndex: 0,
    explanation: '10 = 8 + 2, яғни 8 бар (1), 4 жоқ (0), 2 бар (1), 1 жоқ (0) -> 1010₂.',
  },
  {
    id: 9,
    question: 'Заманауи екілік санау жүйесін XVII ғасырда ғылыми түрде кім негіздеді?',
    options: [
      'Исаак Ньютон',
      'Готфрид Вильгельм Лейбниц',
      'Пифагор',
      'Альберт Эйнштейн',
    ],
    correctIndex: 1,
    explanation: 'Неміс математигі Готфрид Вильгельм Лейбниц 1679–1703 жылдары тек 0 мен 1 цифрларынан тұратын екілік жүйені толық сипаттап шықты.',
  },
  {
    id: 10,
    question: 'Әр бағанның ең бірінші санына қарап, сиқыршы құпияны қалай жылдам есептейді?',
    options: [
      'Барлық 16 санды жатқа біледі',
      'Таңдалған бағандардағы ең бірінші тұрған кілт сандарды (16, 8, 4, 2, 1) ойша қосады',
      'Көріпкелдік қасиетті пайдаланады',
      'Соңғы сандарды бір-біріне көбейтеді',
    ],
    correctIndex: 1,
    explanation: 'Әр баған өзінің кілт санынан (16, 8, 4, 2, 1) басталады! Сиқыршыға тек таңдалған бағандардың бірінші сандарын қоса салу жеткілікті.',
  },
];
