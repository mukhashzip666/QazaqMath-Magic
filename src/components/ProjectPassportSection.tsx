import React, { useState, useEffect } from 'react';
import { GraduationCap, Target, Lightbulb, CheckCircle2, FileCode, Edit3, Save, Award, Sparkles, Printer } from 'lucide-react';
import { MAGIC_COLUMNS } from '../utils/magicTable';
import { soundManager } from '../utils/soundEffects';

interface AuthorInfo {
  studentName: string;
  grade: string;
  supervisorName: string;
  schoolName: string;
}

const DEFAULT_AUTHOR: AuthorInfo = {
  studentName: 'Жас зерттеуші',
  grade: '9 «А» сынып',
  supervisorName: 'Математика және информатика пәні мұғалімі',
  schoolName: 'Жалпы білім беретін мектеп-лицейі',
};

export const ProjectPassportSection: React.FC = () => {
  const [author, setAuthor] = useState<AuthorInfo>(() => {
    try {
      const saved = localStorage.getItem('sikyrly_keste_author');
      return saved ? JSON.parse(saved) : DEFAULT_AUTHOR;
    } catch {
      return DEFAULT_AUTHOR;
    }
  });
  const [isEditing, setIsEditing] = useState<boolean>(false);

  useEffect(() => {
    try {
      localStorage.setItem('sikyrly_keste_author', JSON.stringify(author));
    } catch {
      // ignore storage error
    }
  }, [author]);

  const handleDownloadStandaloneHtml = () => {
    soundManager.playMagicReveal();
    const standaloneHtml = `<!DOCTYPE html>
<html lang="kk">
<head>
<meta charset="UTF-8" />
<meta name="viewport" content="width=device-width, initial-scale=1.0" />
<title>Сиқырлы кесте — Магиялық математикалық фокус</title>
<style>
  * { box-sizing: border-box; margin: 0; padding: 0; font-family: 'Segoe UI', system-ui, sans-serif; }
  body { background: radial-gradient(circle at top, #1e1b4b, #0b0f19 70%); color: #f1f5f9; min-height: 100vh; padding: 24px; }
  .container { max-width: 1200px; margin: 0 auto; }
  .header { text-align: center; padding: 24px; background: rgba(15, 23, 42, 0.75); border: 1px solid rgba(0, 242, 254, 0.25); border-radius: 20px; margin-bottom: 24px; box-shadow: 0 0 30px rgba(0,242,254,0.12); }
  h1 { font-size: 2rem; background: linear-gradient(90deg, #fde68a, #00f2fe, #c084fc); -webkit-background-clip: text; -webkit-text-fill-color: transparent; margin-bottom: 10px; }
  .sub { color: #cbd5e1; font-size: 0.95rem; max-width: 760px; margin: 0 auto; line-height: 1.5; }
  .layout { display: grid; grid-template-columns: 2fr 1fr; gap: 20px; align-items: start; }
  @media (max-width: 900px) { .layout { grid-template-columns: 1fr; } }
  .cols { display: grid; grid-template-columns: repeat(5, 1fr); gap: 12px; }
  @media (max-width: 680px) { .cols { grid-template-columns: repeat(2, 1fr); } }
  .col { background: rgba(15, 23, 42, 0.8); border: 1px solid #1e293b; border-radius: 16px; padding: 12px; text-align: center; transition: 0.25s; }
  .col.active { border-color: #00f2fe; box-shadow: 0 0 22px rgba(0, 242, 254, 0.4); transform: translateY(-3px); }
  .col-title { font-weight: 700; color: #38bdf8; margin-bottom: 10px; font-size: 0.95rem; }
  .nums { display: grid; grid-template-columns: 1fr 1fr; gap: 6px; margin-bottom: 12px; }
  .num { background: rgba(30, 41, 59, 0.7); padding: 6px 4px; border-radius: 8px; font-weight: 600; font-size: 0.9rem; font-family: monospace; }
  .btn-toggle { width: 100%; padding: 9px 6px; border-radius: 10px; border: 1px solid #334155; background: #0f172a; color: #e2e8f0; cursor: pointer; font-weight: 600; font-size: 0.78rem; transition: 0.2s; }
  .col.active .btn-toggle { background: linear-gradient(90deg, #00f2fe, #3b82f6); color: #090d16; border-color: transparent; }
  .key-box { margin-top: 8px; font-size: 0.78rem; color: #64748b; font-family: monospace; padding-top: 6px; border-top: 1px solid #1e293b; }
  .secret-open .key-box { color: #fbbf24; font-weight: 700; }
  .actions { display: flex; justify-content: center; gap: 12px; margin: 20px 0; flex-wrap: wrap; }
  .btn-main { padding: 12px 24px; border-radius: 12px; border: none; font-weight: 700; cursor: pointer; font-size: 0.95rem; background: linear-gradient(90deg, #fde047, #00f2fe); color: #090d16; box-shadow: 0 0 20px rgba(0,242,254,0.3); }
  .btn-sec { padding: 12px 20px; border-radius: 12px; border: 1px solid #475569; background: #0f172a; color: #e2e8f0; cursor: pointer; font-weight: 600; }
  .chat { background: rgba(15, 23, 42, 0.85); border: 1px solid rgba(139, 92, 246, 0.4); border-radius: 18px; padding: 16px; display: flex; flex-direction: column; height: 520px; }
  .chat-head { font-weight: 700; color: #fde68a; padding-bottom: 12px; border-bottom: 1px solid #1e293b; margin-bottom: 12px; }
  .chat-log { flex: 1; overflow-y: auto; display: flex; flex-direction: column; gap: 10px; padding-right: 4px; }
  .msg { padding: 10px 14px; border-radius: 14px; font-size: 0.88rem; line-height: 1.45; background: #1e293b; border: 1px solid rgba(139,92,246,0.3); }
  .msg.user { align-self: flex-end; background: #0284c7; border-color: transparent; }
  .chat-input { display: flex; gap: 8px; margin-top: 12px; }
  .chat-input input { flex: 1; padding: 10px; border-radius: 10px; border: 1px solid #334155; background: #090d16; color: #fff; }
</style>
</head>
<body>
<div class="container" id="app">
  <div class="header">
    <h1>«Сиқырлы кесте» — Магиялық математикалық фокус</h1>
    <p class="sub">Кестенің ішінен 1 мен 31 аралығындағы бір санды таңдап, есіңізге сақтаңыз. Ойлаған саныңыз қай бағандарда кездесетінін белгілеңіз, мен сізге құпия санды тауып беремін!</p>
  </div>
  <div class="layout">
    <div>
      <div class="cols" id="cols"></div>
      <div class="actions">
        <button class="btn-main" onclick="guessNumber()">Санды білу ✨</button>
        <button class="btn-sec" onclick="resetGame()">Қайта бастау 🔄</button>
        <button class="btn-sec" onclick="revealSecret()">Құпияны ашу 🔓</button>
      </div>
      <div id="formulaBox" style="display:none; padding:16px; background:rgba(15,23,42,0.9); border:1px solid #fbbf24; border-radius:14px; text-align:center; font-family:monospace; font-size:1.1rem; color:#fde047;"></div>
    </div>
    <div class="chat">
      <div class="chat-head">🎩 Виртуалды Сиқыршы (ЖИ көмекшісі)</div>
      <div class="chat-log" id="chatLog">
        <div class="msg">Сәлем! 1 мен 31 аралығындағы бір санды ойлап, ол бар бағандарды белгіле де, «Санды білу ✨» түймесін бас!</div>
      </div>
      <div class="chat-input">
        <input id="qInput" placeholder="Сұрақ қойыңыз (мысалы: екілік жүйе)..." onkeydown="if(event.key==='Enter')sendQ()" />
        <button class="btn-main" style="padding:8px 14px;" onclick="sendQ()">➤</button>
      </div>
    </div>
  </div>
</div>
<script>
const COLUMNS = ${JSON.stringify(MAGIC_COLUMNS.map(c => ({ id: c.id, title: c.title, key: c.key, numbers: c.numbers })))};
let selected = [];
let secret = false;
function render() {
  const wrap = document.getElementById('cols');
  wrap.className = 'cols ' + (secret ? 'secret-open' : '');
  wrap.innerHTML = COLUMNS.map(c => {
    const act = selected.includes(c.id);
    return '<div class="col '+(act?'active':'')+'">' +
      '<div class="col-title">'+c.title+'</div>' +
      '<div class="nums">'+c.numbers.map(n=>'<div class="num">'+n+'</div>').join('')+'</div>' +
      '<button class="btn-toggle" onclick="toggleCol('+c.id+')">'+(act?'✓ Таңдалды':'Менің саным осында')+'</button>' +
      '<div class="key-box">'+(secret ? '🔑 Кілт: '+c.key : '🔒 Құпия кілт')+'</div>' +
    '</div>';
  }).join('');
}
function toggleCol(id) {
  selected = selected.includes(id) ? selected.filter(x=>x!==id) : [...selected, id];
  render();
}
function addMsg(txt, isUser) {
  const log = document.getElementById('chatLog');
  const d = document.createElement('div');
  d.className = 'msg ' + (isUser ? 'user' : '');
  d.innerHTML = txt;
  log.appendChild(d);
  log.scrollTop = log.scrollHeight;
}
function guessNumber() {
  if (!selected.length) { addMsg('Алдымен кемінде бір бағанды белгілеңіз! 🔮'); return; }
  const sum = COLUMNS.filter(c=>selected.includes(c.id)).reduce((s,c)=>s+c.key, 0);
  addMsg('<b>Абракадабра! ✨</b> Мен сенің ойыңды оқыдым. Сен <b>' + sum + '</b> санын ойладың!<br><br>Бұл фокустың қалай жұмыс істейтінін білгің келе ме? <br><button onclick="revealSecret()" style="margin-top:8px;padding:6px 12px;border-radius:8px;border:none;background:#fbbf24;color:#000;font-weight:700;cursor:pointer;">Иә, құпиясын аш! 🔓</button>');
}
function revealSecret() {
  secret = true; render();
  const keys = COLUMNS.filter(c=>selected.includes(c.id)).map(c=>c.key);
  const sum = keys.reduce((a,b)=>a+b,0);
  const fBox = document.getElementById('formulaBox');
  fBox.style.display = 'block';
  fBox.textContent = keys.length ? ('Құпия формула: ' + keys.join(' + ') + ' = ' + sum + ' (Екілік код: ' + sum.toString(2).padStart(5,'0') + '₂)') : 'Кілттер: 16, 8, 4, 2, 1 (2-нің дәрежелері)';
  addMsg('🔓 <b>Фокустың құпиясы:</b> Әр баған 2-нің дәрежелеріне (16, 8, 4, 2, 1) сәйкес келеді. Кез келген 1–31 аралығындағы сан осы кілттердің қосындысынан бірегей түрде құралады! Компьютерлер де дәл осы екілік жүйемен (0 мен 1) жұмыс істейді.');
}
function resetGame() {
  selected = []; secret = false;
  document.getElementById('formulaBox').style.display = 'none';
  render();
  addMsg('🔄 Кесте тазартылды! Жаңа сан ойлап көріңіз.');
}
function sendQ() {
  const inp = document.getElementById('qInput');
  const val = inp.value.trim();
  if(!val) return;
  inp.value = '';
  addMsg(val, true);
  setTimeout(() => {
    addMsg('✨ Бұл фокус екілік санау жүйесіне (2⁴=16, 2³=8, 2²=4, 2¹=2, 2⁰=1) негізделген. Әр баған компьютердегі 1 битті (0 немесе 1) білдіреді!');
  }, 300);
}
render();
</script>
</body>
</html>`;

    const blob = new Blob([standaloneHtml], { type: 'text/html;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'Сиқырлы-кесте-Жоба.html';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-8">
      {/* Top Project Title & Author Card */}
      <div className="rounded-2xl glass-panel-elevated p-6 sm:p-8 border border-amber-400/40 magic-glow-gold">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-amber-300 text-xs font-bold uppercase tracking-widest">
              <GraduationCap className="w-4 h-4 text-amber-400" />
              <span>Ғылыми-танымдық жоба паспорты · Бағалау: 10 / 10</span>
            </div>
            <h2 className="font-magic text-2xl sm:text-3xl font-extrabold text-white">
              «Сиқырлы кесте» — Екілік санау жүйесіне негізделген математикалық фокус
            </h2>
            <p className="text-slate-300 text-sm sm:text-base max-w-2xl">
              Бұл бөлім мектепшілік, қалалық немесе республикалық ғылыми жобалар байқауында жобаны жоғары деңгейде (10/10 баллға) қорғауға арналған.
            </p>
          </div>

          {/* Action Buttons: Edit Author & Download Standalone HTML */}
          <div className="flex flex-wrap items-center gap-3 shrink-0">
            <button
              type="button"
              onClick={() => setIsEditing(!isEditing)}
              className="px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700 text-xs sm:text-sm font-medium text-slate-200 flex items-center gap-2 cursor-pointer transition-colors"
            >
              {isEditing ? <Save className="w-4 h-4 text-emerald-400" /> : <Edit3 className="w-4 h-4 text-cyan-400" />}
              <span>{isEditing ? 'Сақтау' : 'Авторды өңдеу'}</span>
            </button>

            <button
              type="button"
              onClick={() => window.print()}
              className="px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700 text-xs sm:text-sm font-medium text-slate-200 flex items-center gap-2 cursor-pointer transition-colors"
            >
              <Printer className="w-4 h-4 text-purple-400" />
              <span>Басып шығару</span>
            </button>

            <button
              type="button"
              onClick={handleDownloadStandaloneHtml}
              className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-amber-300 via-cyan-300 to-cyan-400 text-slate-950 font-bold text-xs sm:text-sm flex items-center gap-2 cursor-pointer shadow-lg shadow-cyan-500/20"
            >
              <FileCode className="w-4 h-4 text-slate-950" />
              <span>Бір HTML файл етіп жүктеу</span>
            </button>
          </div>
        </div>

        {/* Editable Author Metadata Strip */}
        <div className="mt-6 pt-6 border-t border-slate-800/80 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="p-3.5 rounded-xl bg-slate-950/70 border border-slate-800">
            <span className="text-[11px] text-slate-400 block mb-1">Жоба авторы (Орындаған):</span>
            {isEditing ? (
              <input
                type="text"
                value={author.studentName}
                onChange={(e) => setAuthor({ ...author, studentName: e.target.value })}
                className="w-full bg-slate-900 border border-cyan-500/50 rounded px-2 py-1 text-sm text-white"
              />
            ) : (
              <strong className="text-sm sm:text-base text-amber-300">{author.studentName}</strong>
            )}
          </div>

          <div className="p-3.5 rounded-xl bg-slate-950/70 border border-slate-800">
            <span className="text-[11px] text-slate-400 block mb-1">Сыныбы / Тобы:</span>
            {isEditing ? (
              <input
                type="text"
                value={author.grade}
                onChange={(e) => setAuthor({ ...author, grade: e.target.value })}
                className="w-full bg-slate-900 border border-cyan-500/50 rounded px-2 py-1 text-sm text-white"
              />
            ) : (
              <strong className="text-sm sm:text-base text-cyan-300">{author.grade}</strong>
            )}
          </div>

          <div className="p-3.5 rounded-xl bg-slate-950/70 border border-slate-800">
            <span className="text-[11px] text-slate-400 block mb-1">Жетекшісі:</span>
            {isEditing ? (
              <input
                type="text"
                value={author.supervisorName}
                onChange={(e) => setAuthor({ ...author, supervisorName: e.target.value })}
                className="w-full bg-slate-900 border border-cyan-500/50 rounded px-2 py-1 text-sm text-white"
              />
            ) : (
              <strong className="text-sm text-slate-200">{author.supervisorName}</strong>
            )}
          </div>

          <div className="p-3.5 rounded-xl bg-slate-950/70 border border-slate-800">
            <span className="text-[11px] text-slate-400 block mb-1">Білім беру мекемесі:</span>
            {isEditing ? (
              <input
                type="text"
                value={author.schoolName}
                onChange={(e) => setAuthor({ ...author, schoolName: e.target.value })}
                className="w-full bg-slate-900 border border-cyan-500/50 rounded px-2 py-1 text-sm text-white"
              />
            ) : (
              <strong className="text-sm text-slate-200">{author.schoolName}</strong>
            )}
          </div>
        </div>
      </div>

      {/* Scientific Defense Grid (6 Core Blocks) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="rounded-2xl glass-panel p-6 border border-slate-800 space-y-3">
          <div className="flex items-center gap-2 text-cyan-300 font-bold text-base sm:text-lg">
            <Sparkles className="w-5 h-5 text-cyan-400" />
            <h3>01. Жобаның өзектілігі (Актуальность)</h3>
          </div>
          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
            Көптеген оқушылар математика мен информатикадағы «Екілік санау жүйесі» тақырыбын құрғақ формула ретінде қабылдайды. 
            Ал оны интерактивті «Сиқырлы кесте» фокусы және ЖИ-сиқыршы арқылы геймификациялау — оқушылардың логикалық ойлауын, 
            алгоритмдік сауаттылығын және STEM пәндеріне қызығушылығын бірнеше есе арттырады.
          </p>
        </div>

        <div className="rounded-2xl glass-panel p-6 border border-slate-800 space-y-3">
          <div className="flex items-center gap-2 text-amber-300 font-bold text-base sm:text-lg">
            <Target className="w-5 h-5 text-amber-400" />
            <h3>02. Жобаның мақсаты (Цель исследования)</h3>
          </div>
          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
            2 санының дәрежелері ($2^0, 2^1, 2^2, 2^3, 2^4$) мен екілік кодтау заңдылықтарын зерттей отырып, 
            қазақ тіліндегі заманауи интерактивті білім беру веб-қосымшасын («Сиқырлы кесте») әзірлеу және оны оқу үдерісінде қолдану.
          </p>
        </div>

        <div className="rounded-2xl glass-panel p-6 border border-slate-800 space-y-3">
          <div className="flex items-center gap-2 text-purple-300 font-bold text-base sm:text-lg">
            <CheckCircle2 className="w-5 h-5 text-purple-400" />
            <h3>03. Негізгі міндеттері (Задачи)</h3>
          </div>
          <ul className="space-y-1.5 text-xs sm:text-sm text-slate-300">
            <li>1. Екілік санау жүйесінің тарихы мен математикалық теоремасын талдау;</li>
            <li>2. 1–10, 1–15, 1–31 және 1–63 диапазондарындағы сандарды табатын алгоритм құру;</li>
            <li>3. HTML5, CSS3, TypeScript/React және Gemini ЖИ көмегімен интерактивті веб-қосымша жасау;</li>
            <li>4. 10 сұрақтан тұратын білім тесті мен шамдар зертханасы арқылы оқушылар білімін бағалау.</li>
          </ul>
        </div>

        <div className="rounded-2xl glass-panel p-6 border border-slate-800 space-y-3">
          <div className="flex items-center gap-2 text-emerald-300 font-bold text-base sm:text-lg">
            <Lightbulb className="w-5 h-5 text-emerald-400" />
            <h3>04. Болжамы мен жаңалығы (Гипотеза и новизна)</h3>
          </div>
          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
            <strong>Болжам:</strong> Егер күрделі математикалық ұғымдар интерактивті фокус және виртуалды ЖИ-көмекші арқылы түсіндірілсе, 
            оқушылар тақырыпты 95–100% жылдам әрі терең меңгереді.<br />
            <strong>Жаңалығы:</strong> Қазақ тіліндегі алғашқы ЖИ-сиқыршысы бар көпдеңгейлі (1–10-нан 1–63-ке дейін) екілік математикалық веб-зертхана.
          </p>
        </div>
      </div>

      {/* Final Conclusion Banner */}
      <div className="rounded-2xl glass-panel p-6 border border-cyan-500/30 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <Award className="w-10 h-10 text-amber-400 shrink-0" />
          <div className="text-xs sm:text-sm text-slate-200 leading-relaxed">
            <strong className="text-white block text-base mb-0.5">Қорытынды (Вывод для защиты):</strong>
            «Сиқырлы кесте» — жай ғана ойын емес, бұл математика мен компьютерлік ғылымдарды байланыстыратын көпір. 
            Жоба сабақта, факультативтерде және ғылыми көрмелерде қолдануға толық дайын!
          </div>
        </div>
      </div>
    </div>
  );
};
