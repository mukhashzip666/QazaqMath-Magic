/**
 * «Виртуалды Сиқыршы» ЖИ-көмекшісінің интеллектуалды жауап беру жүйесі.
 * Серверлік Gemini API-мен және автономды ақылды математикалық талдағышпен жұмыс істейді.
 */

import { GameRangeMode, getColumnsForMode } from './magicTable';

const DEFAULT_API_KEY = '';

/**
 * Кез келген бүтін санды 2-нің дәрежелеріне жіктеу (мысалы: 27 -> "16 + 8 + 2 + 1")
 */
export function decomposeNumberToPowers(n: number): {
  powers: number[];
  binary: string;
  formula: string;
} {
  if (n <= 0 || !Number.isInteger(n)) {
    return { powers: [], binary: '0', formula: '0' };
  }
  const binary = n.toString(2);
  const powers: number[] = [];
  let temp = n;
  let bitValue = 1;
  while (temp > 0) {
    if (temp & 1) {
      powers.unshift(bitValue);
    }
    temp >>= 1;
    bitValue <<= 1;
  }
  return {
    powers,
    binary: binary.padStart(Math.max(5, binary.length), '0'),
    formula: `${powers.join(' + ')} = ${n}`,
  };
}

/**
 * Пайдаланушының кез келген сұрағына (қазақша немесе орысша жазса да)
 * таза қазақ тілінде мазмұнды, нақты әрі қызықты жауап құрастыру
 */
export function generateSmartMagicianReply(
  userMessage: string,
  currentNumber?: number | null,
  selectedKeys?: number[],
  mode: GameRangeMode = '1-31'
): string {
  const text = userMessage.trim();
  const lower = text.toLowerCase();

  // 1. Сәлемдесу / танысу
  if (
    /^(сәлем|салем|салам|привет|здравствуй|ассалаумағалейкум|қайырлы|хай|hello|hi)\b/i.test(lower) ||
    lower.includes('қалайсың') ||
    lower.includes('калайсын') ||
    lower.includes('кімсің') ||
    lower.includes('кто ты')
  ) {
    return `🎩✨ **Сәлем, жас дос!** Мен — «Сиқырлы кестенің» Виртуалды Сиқыршысымын!
Көңіл-күйім керемет, сенің ойлаған сандарыңды оқуға және математикалық фокустың құпиясын ашуға дайынмын!

Маған кез келген сұрақ қоя аласың:
• **«Екілік жүйе деген не?»**
• **«19 саны қалай шығады?»** (кез келген санды жазсаң, жіктеп беремін!)
• **«Жобаны мұғалім алдында қалай қорғаймын?»**
• **«Маған математикалық жұмбақ жасыршы!»**`;
  }

  // 2. Егер пайдаланушы нақты бір сан туралы сұраса немесе сан жазса (мысалы "19", "25 саны қалай шығады?", "42")
  const numberMatch = lower.match(/\b(\d{1,4})\b/);
  if (
    numberMatch &&
    !lower.includes('16, 8, 4') &&
    !lower.includes('1-ден') &&
    (lower.length <= 4 ||
      lower.includes('сан') ||
      lower.includes('қалай') ||
      lower.includes('калай') ||
      lower.includes('екілік') ||
      lower.includes('жікте') ||
      lower.includes('баған') ||
      lower.includes('тап') ||
      lower.includes('число') ||
      lower.includes('как'))
  ) {
    const num = parseInt(numberMatch[1], 10);
    if (num >= 1 && num <= 1023) {
      const dec = decomposeNumberToPowers(num);
      const cols = getColumnsForMode(mode);
      const matchingCols = cols.filter((c) => (num & c.key) === c.key).map((c) => `${c.title} (кілті ${c.key})`);

      return `🔮 **${num} санының математикалық талдауы:**
• **2-нің дәрежелеріне жіктелуі:** \`${dec.formula}\`
• **Екілік санау жүйесіндегі коды:** \`${dec.binary}₂\`
${
  num <= (mode === '1-63' ? 63 : 31) && matchingCols.length > 0
    ? `• **Кестедегі орны:** Бұл сан мына бағандарда кездеседі: **${matchingCols.join(', ')}**.`
    : `• **Ескерту:** ${num} санын кестеден табу үшін кілті **${dec.powers[0]}** болатын бағанға дейін кеңейту керек!`
}

Көрдің бе? ${num} санын 2-нің дәрежелері арқылы тек осы жалғыз жолмен ғана құрастыруға болады! ✨`;
    }
  }

  // 3. Екілік санау жүйесі туралы сұрақтар
  if (
    lower.includes('екілік') ||
    lower.includes('двоичн') ||
    lower.includes('binary') ||
    lower.includes('0 мен 1') ||
    lower.includes('0 және 1') ||
    lower.includes('жүйе')
  ) {
    return `✨ **Екілік санау жүйесі (Binary System) деген не?**
Күнделікті өмірде біз **ондық жүйені** (0, 1, 2, 3, 4, 5, 6, 7, 8, 9) қолданамыз. Ал компьютерлер мен смартфондар тек **екі цифрды** ғана түсінеді:
• **1** — ток бар («Иә» / баған таңдалды)
• **0** — ток жоқ («Жоқ» / баған таңдалмады)

«Сиқырлы кестедегі» 5 баған — компьютер жадындағы **5 бит**:
• 1-баған = $2^4 = 16$
• 2-баған = $2^3 = 8$
• 3-баған = $2^2 = 4$
• 4-баған = $2^1 = 2$
• 5-баған = $2^0 = 1$

Пайдаланушы бағандарды таңдағанда, ол өзі байқамай ойлаған санын екілік кодқа айналдырып береді! 💻⚡`;
  }

  // 4. Фокустың құпиясы / неге 16, 8, 4, 2, 1
  if (
    lower.includes('неге') ||
    lower.includes('құпия') ||
    lower.includes('купия') ||
    lower.includes('сыр') ||
    lower.includes('секрет') ||
    lower.includes('қалай жұмыс') ||
    lower.includes('как работает') ||
    lower.includes('объясни') ||
    lower.includes('түсіндір') ||
    lower.includes('кілт')
  ) {
    if (currentNumber && currentNumber > 0 && selectedKeys && selectedKeys.length > 0) {
      return `🔓 **Дәл қазіргі ${currentNumber} санының құпиясы:**
Сен белгілеген бағандардың ең бірінші тұрған кілт сандары: **${selectedKeys.join(', ')}**.
Сиқыршы ретінде мен тек сол кілттерді қостым:
👉 **${selectedKeys.join(' + ')} = ${currentNumber}**

Кестедегі әрбір бағанға тек сол бағанның кілті қосындыға қатысатын сандар ғана жазылған. Сондықтан қателесу мүмкін емес! 🪄`;
    }

    return `🔓 **Фокустың басты құпиясы:**
Әр бағанның ең басында тұрған санға мұқият қара: **16, 8, 4, 2, 1**.
Бұл — 2 санының дәрежелері ($2^4, 2^3, 2^2, 2^1, 2^0$).
Математика заңы бойынша 1-ден 31-ге дейінгі кез келген санды осы бес санның қосындысынан **бір ғана тәсілмен** алуға болады:
• $7 = 4 + 2 + 1$
• $13 = 8 + 4 + 1$
• $21 = 16 + 4 + 1$
• $31 = 16 + 8 + 4 + 2 + 1$

Досың бағандарды көрсеткен сәтте, сен сол бағандардың ең бірінші сандарын ойша қоса қоясың — міне, нағыз математикалық магия! ✨`;
  }

  // 5. Кестені кеңейту (63, 64, 100, 127...)
  if (
    lower.includes('64') ||
    lower.includes('63') ||
    lower.includes('100') ||
    lower.includes('127') ||
    lower.includes('кеңейт') ||
    lower.includes('көбейт') ||
    lower.includes('больше')
  ) {
    return `🌟 **Фокусты үлкен сандарға қалай кеңейтуге болады?**
Әрбір жаңа баған мүмкіндікті **2 есе** арттырады ($2^k - 1$ формуласы):
• **4 баған** (8, 4, 2, 1) $\rightarrow$ **15-ке дейін**
• **5 баған** (16, 8, 4, 2, 1) $\rightarrow$ **31-ге дейін**
• **6 баған** (32, 16, 8, 4, 2, 1) $\rightarrow$ **63-ке дейін** (жоғарыдағы «1–63 Шебер» режимін басып көр!)
• **7 баған** (64 кілтімен) $\rightarrow$ **127-ге дейін**
• **10 баған** (512 кілтімен) $\rightarrow$ **1023-ке дейін!**`;
  }

  // 6. Жобаны қорғау / Мұғалімге немесе комиссияға қалай түсіндіру керек
  if (
    lower.includes('жоба') ||
    lower.includes('қорғау') ||
    lower.includes('проект') ||
    lower.includes('защит') ||
    lower.includes('мұғалім') ||
    lower.includes('комисси') ||
    lower.includes('10')
  ) {
    return `🏆 **Жобаны 10/10 баллға қорғауға арналған кеңес:**
1. **Кіріспе (Интрига):** Комиссия мүшелерінің бірінен 1 мен 31 аралығында сан ойлауды сұрап, экраннан санын 3 секундта тауып беріңіз.
2. **Ғылыми негіздеме:** «Құпияны ашу 🔓» түймесін басып, фокустың Г. В. Лейбниц ашқан екілік санау жүйесіне ($2^n$) негізделгенін көрсетіңіз.
3. **Практикалық бөлім:** Жоғарыдағы **«Теория мен зертхана»** бөлімін ашып, 5-биттік шамдарды қосып-өшіріп көрсетіңіз.
4. **Қорытынды:** **«Жоба паспорты»** мен **«Білім тесті (10/10)»** бөлімдерін көрсетіп, қосымшаның мектепте информатика мен математика сабақтарында дайын тренажер екенін айтыңыз!`;
  }

  // 7. Тарихы туралы сұрақ
  if (
    lower.includes('тарих') ||
    lower.includes('истори') ||
    lower.includes('лейбниц') ||
    lower.includes('кім ашты') ||
    lower.includes('кім ойлап')
  ) {
    return `📜 **Фокус пен екілік жүйенің тарихы:**
• **1679–1703 жж.** — Неміс ғалымы **Готфрид Вильгельм Лейбниц** барлық сандарды тек 0 мен 1 арқылы өрнектеуге болатынын ғылыми түрде дәлелдеді.
• **1854 ж.** — Ағылшын математигі **Джордж Буль** логикалық алгебраны (True = 1, False = 0) жасады.
• **1937 ж.** — **Клод Шеннон** екілік алгебраны электр тізбектері мен компьютерлерге қолдануды ұсынды.
Ал «Сиқырлы кесте» — осы ұлы жаңалықтың ең көрнекі математикалық ойын түрі! 🎓`;
  }

  // 8. Жұмбақ немесе қызық факт сұраса
  if (
    lower.includes('жұмбақ') ||
    lower.includes('загадк') ||
    lower.includes('факт') ||
    lower.includes('қызық')
  ) {
    return `🧩 **Сиқыршының математикалық жұмбағы:**
*«Әлемде адамдардың 10 түрі бар: екілік санау жүйесін түсінетіндер және түсінбейтіндер!»* 😄
Неліктен «2 түрі» емес, «10 түрі» делінген?
Өйткені екілік санау жүйесінде **2** саны **10₂** ($2 + 0 = 2$) деп жазылады!

Ал сен мына сұраққа жауап беріп көрші: егер мен **1-ші (16)** және **4-ші (2)** бағандарды таңдасам, мен қандай сан ойладым? Жауабын жаз! ✨`;
  }

  // 9. Алғыс білдіру
  if (
    lower.includes('рахмет') ||
    lower.includes('рақмет') ||
    lower.includes('спасибо') ||
    lower.includes('күшті') ||
    lower.includes('жарайсың') ||
    lower.includes('молодец')
  ) {
    return `🌟 **Оқасы жоқ, жас зерттеуші!** Саған да үлкен рахмет! 
Жобаңды ең жоғары **10/10 баллға** қорғап шығуыңа тілектеспін! Тағы сұрақтарың немесе тексергің келетін сандар болса, жаза бер! 🎩✨`;
  }

  // 10. Әмбебап ақылды жауап (пайдаланушының сөзіне бейімделген)
  return `✨ **Қызықты сұрақ!** («*${text}*»)

Мен — «Сиқырлы кестенің» Виртуалды Сиқыршысымын. Бұл жобада біз **екілік санау жүйесі ($2^0=1, 2^1=2, 2^2=4, 2^3=8, 2^4=16$)** арқылы ойлаған санды қалай табуға болатынын зерттейміз.
${
  currentNumber && currentNumber > 0
    ? `\nҚазір кестеде **${currentNumber}** саны таңдалып тұр (кілттер қосындысы: **${selectedKeys?.join(' + ') || currentNumber}**).`
    : ''
}

Менен мыналарды сұрап көрсең болады:
1. Кез келген санды жаз (мысалы: **«23 саны қалай шығады?»**) — мен оны екілік кодқа жіктеп беремін;
2. **«Фокустың құпиясы неде?»** немесе **«Компьютермен байланысы қандай?»**;
3. **«Жобаны 10 баллға қалай қорғаймын?»** — қорғау сценарийін беремін! 🔮`;
}

/**
 * Серверге немесе тікелей Gemini API-ға сұраныс жіберіп,
 * қате болған жағдайда локалды ақылды Сиқыршы жауабын қайтарады.
 */
export async function askMagicianAI(
  userMessage: string,
  currentNumber?: number | null,
  selectedKeys?: number[],
  mode: GameRangeMode = '1-31'
): Promise<{ reply: string; source: 'gemini' | 'local' }> {
  // 1. Try backend Express endpoint first (/api/magician/chat)
  try {
    const response = await fetch('/api/magician/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        message: userMessage,
        currentNumber: currentNumber && currentNumber > 0 ? currentNumber : undefined,
        selectedKeys,
        mode,
      }),
    });

    if (response.ok) {
      const data = await response.json();
      if (data && typeof data.reply === 'string' && data.reply.trim().length > 0) {
        return { reply: data.reply, source: data.source || 'gemini' };
      }
    }
  } catch {
    // Server endpoint not reachable (e.g. pure Vite mode or offline), continue to next step
  }

  // 2. Try direct Gemini REST API if key is configured
  const apiKey = localStorage.getItem('sikyrly_gemini_api_key') || DEFAULT_API_KEY;
  if (apiKey) {
    try {
      const systemPrompt = `Сен — «Сиқырлы кесте» (Магиялық математикалық фокус) білім беру веб-қосымшасының мейірімді, шабыттандырушы және білімді Виртуалды Сиқыршысысың. Барлық жауаптарыңды тек қазақ тілінде жаз. Фокустың мәні: 1 мен 31 аралығындағы сандар 5 бағанға бөлінген (кілттері: 16, 8, 4, 2, 1 — екілік санау жүйесі). Пайдаланушы сұрағына қысқа, нақты, эмодзилермен жауап бер.`;
      const res = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${encodeURIComponent(apiKey)}`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            systemInstruction: { parts: [{ text: systemPrompt }] },
            contents: [{ role: 'user', parts: [{ text: userMessage }] }],
          }),
        }
      );
      if (res.ok) {
        const json = await res.json();
        const candidateText = json?.candidates?.[0]?.content?.parts?.[0]?.text;
        if (candidateText && candidateText.trim().length > 0) {
          return { reply: candidateText.trim(), source: 'gemini' };
        }
      }
    } catch {
      // Fallback to local smart brain
    }
  }

  // 3. Guaranteed smart local Kazakh response
  const smartReply = generateSmartMagicianReply(userMessage, currentNumber, selectedKeys, mode);
  return { reply: smartReply, source: 'local' };
}
