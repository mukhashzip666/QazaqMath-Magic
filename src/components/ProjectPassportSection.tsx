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
<title>Сиқырлы кесте</title>
<script src="https://cdn.tailwindcss.com"></script>
</head>
<body class="min-h-screen bg-[#FFFFFF] text-[#172B3A] flex items-center justify-center p-6">
  <main class="w-full max-w-5xl rounded-2xl bg-gradient-to-br from-[#DCEEFF] via-[#F5F8FA] to-[#DCEEFF]/70 border border-[#E5EAF0] shadow-xl p-8 relative overflow-hidden">
    <div class="absolute top-0 left-0 right-0 h-1 bg-[#D92732]"></div>
    <div class="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
      <div class="lg:col-span-5 space-y-6">
        <h1 class="text-4xl font-extrabold text-[#D92732]">Сиқырлы кесте</h1>
        <p class="text-xl font-bold text-[#172B3A] leading-relaxed">
          Кестенің ішінен бір санды таңдап, есіңізге сақтаңыз. Кестенің қай бағанда осы сан бар екенін айтыңыз, мен сізге құпия санды айтам.
        </p>
        <div class="flex gap-3">
          <button onclick="reveal()" class="px-5 py-2.5 rounded-xl bg-[#D92732] text-white font-bold cursor-pointer">Құпия санды айту</button>
          <button onclick="sel=[];guessed=null;render();" class="px-4 py-2.5 rounded-xl bg-white border border-[#E5EAF0] font-semibold cursor-pointer">Қайта бастау</button>
        </div>
        <div id="out" class="text-3xl font-extrabold text-[#D92732]"></div>
      </div>
      <div class="lg:col-span-7 bg-white rounded-xl border border-[#E5EAF0] overflow-hidden">
        <div id="grid" class="grid grid-cols-5 divide-x divide-[#CBD5E1]"></div>
      </div>
    </div>
  </main>
  <script>
    const COLS = ${JSON.stringify(MAGIC_COLUMNS.map(c => ({ id: c.id, key: c.key, numbers: c.numbers })))};
    let sel = [], guessed = null;
    function render() {
      document.getElementById('grid').innerHTML = COLS.map(c => {
        const act = sel.includes(c.id);
        return '<div onclick="toggle('+c.id+')" class="flex flex-col cursor-pointer text-center '+(act?'bg-[#DCEEFF]':'bg-[#F5F8FA]')+'">' +
          '<div class="py-2 font-bold text-white '+(act?'bg-[#D92732]':'bg-[#0B3B8C]')+'">'+c.id+'</div>' +
          '<div class="py-2 space-y-0.5">'+c.numbers.map(n=>'<div class="text-xs font-bold">'+n+'</div>').join('')+'<div class="text-xs font-bold">'+c.key+'</div></div></div>';
      }).join('');
      document.getElementById('out').textContent = guessed ? ('Құпия сан: ' + guessed) : '';
    }
    function toggle(id) { sel = sel.includes(id) ? sel.filter(x=>x!==id) : [...sel, id]; guessed=null; render(); }
    function reveal() { if(!sel.length) return; guessed = COLS.filter(c=>sel.includes(c.id)).reduce((s,c)=>s+c.key,0); render(); }
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
      <div className="rounded-2xl bg-[#F5F8FA] p-6 sm:p-8 border border-[#E5EAF0] relative overflow-hidden">
        <div className="absolute top-0 left-0 right-0 h-[2px] bg-[#D92732]" />
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-[#D92732] text-xs font-bold uppercase tracking-widest">
              <GraduationCap className="w-4 h-4" />
              <span>Ғылыми-танымдық жоба паспорты · Бағалау: 10 / 10</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-[#172B3A]">
              «Сиқырлы кесте» — Екілік санау жүйесіне негізделген математикалық фокус
            </h2>
            <p className="text-[#657786] text-sm sm:text-base max-w-2xl">
              Бұл бөлім мектепшілік, қалалық немесе республикалық ғылыми жобалар байқауында жобаны жоғары деңгейде (10/10 баллға) қорғауға арналған.
            </p>
          </div>

          {/* Action Buttons: Edit Author & Download Standalone HTML */}
          <div className="flex flex-wrap items-center gap-3 shrink-0">
            <button
              type="button"
              onClick={() => setIsEditing(!isEditing)}
              className="px-4 py-2.5 rounded-xl bg-[#FFFFFF] hover:bg-[#DCEEFF]/50 border border-[#E5EAF0] text-xs sm:text-sm font-semibold text-[#172B3A] flex items-center gap-2 cursor-pointer transition-colors"
            >
              {isEditing ? <Save className="w-4 h-4 text-[#4A9FE8]" /> : <Edit3 className="w-4 h-4 text-[#4A9FE8]" />}
              <span>{isEditing ? 'Сақтау' : 'Авторды өңдеу'}</span>
            </button>

            <button
              type="button"
              onClick={() => window.print()}
              className="px-4 py-2.5 rounded-xl bg-[#FFFFFF] hover:bg-[#DCEEFF]/50 border border-[#E5EAF0] text-xs sm:text-sm font-semibold text-[#172B3A] flex items-center gap-2 cursor-pointer transition-colors"
            >
              <Printer className="w-4 h-4 text-[#657786]" />
              <span>Басып шығару</span>
            </button>

            <button
              type="button"
              onClick={handleDownloadStandaloneHtml}
              className="px-4 py-2.5 rounded-xl bg-[#D92732] hover:bg-[#b81f29] text-white font-bold text-xs sm:text-sm flex items-center gap-2 cursor-pointer shadow-sm"
            >
              <FileCode className="w-4 h-4" />
              <span>Бір HTML файл етіп жүктеу</span>
            </button>
          </div>
        </div>

        {/* Editable Author Metadata Strip */}
        <div className="mt-6 pt-6 border-t border-[#E5EAF0] grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="p-3.5 rounded-xl bg-[#FFFFFF] border border-[#E5EAF0]">
            <span className="text-[11px] text-[#657786] block mb-1">Жоба авторы (Орындаған):</span>
            {isEditing ? (
              <input
                type="text"
                value={author.studentName}
                onChange={(e) => setAuthor({ ...author, studentName: e.target.value })}
                className="w-full bg-[#F5F8FA] border border-[#4A9FE8] rounded px-2 py-1 text-sm text-[#172B3A]"
              />
            ) : (
              <strong className="text-sm sm:text-base text-[#D92732]">{author.studentName}</strong>
            )}
          </div>

          <div className="p-3.5 rounded-xl bg-[#FFFFFF] border border-[#E5EAF0]">
            <span className="text-[11px] text-[#657786] block mb-1">Сыныбы / Тобы:</span>
            {isEditing ? (
              <input
                type="text"
                value={author.grade}
                onChange={(e) => setAuthor({ ...author, grade: e.target.value })}
                className="w-full bg-[#F5F8FA] border border-[#4A9FE8] rounded px-2 py-1 text-sm text-[#172B3A]"
              />
            ) : (
              <strong className="text-sm sm:text-base text-[#4A9FE8]">{author.grade}</strong>
            )}
          </div>

          <div className="p-3.5 rounded-xl bg-[#FFFFFF] border border-[#E5EAF0]">
            <span className="text-[11px] text-[#657786] block mb-1">Жетекшісі:</span>
            {isEditing ? (
              <input
                type="text"
                value={author.supervisorName}
                onChange={(e) => setAuthor({ ...author, supervisorName: e.target.value })}
                className="w-full bg-[#F5F8FA] border border-[#4A9FE8] rounded px-2 py-1 text-sm text-[#172B3A]"
              />
            ) : (
              <strong className="text-sm text-[#172B3A]">{author.supervisorName}</strong>
            )}
          </div>

          <div className="p-3.5 rounded-xl bg-[#FFFFFF] border border-[#E5EAF0]">
            <span className="text-[11px] text-[#657786] block mb-1">Білім беру мекемесі:</span>
            {isEditing ? (
              <input
                type="text"
                value={author.schoolName}
                onChange={(e) => setAuthor({ ...author, schoolName: e.target.value })}
                className="w-full bg-[#F5F8FA] border border-[#4A9FE8] rounded px-2 py-1 text-sm text-[#172B3A]"
              />
            ) : (
              <strong className="text-sm text-[#172B3A]">{author.schoolName}</strong>
            )}
          </div>
        </div>
      </div>

      {/* Scientific Defense Grid (4 Core Blocks) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="rounded-2xl bg-[#FFFFFF] p-6 border border-[#E5EAF0] shadow-xs space-y-3">
          <div className="w-10 h-[2px] bg-[#D92732]" />
          <div className="flex items-center gap-2 text-[#172B3A] font-extrabold text-base sm:text-lg">
            <Sparkles className="w-5 h-5 text-[#4A9FE8]" />
            <h3>01. Жобаның өзектілігі (Актуальность)</h3>
          </div>
          <p className="text-xs sm:text-sm text-[#657786] leading-relaxed">
            Көптеген оқушылар математика мен информатикадағы «Екілік санау жүйесі» тақырыбын құрғақ формула ретінде қабылдайды. 
            Ал оны интерактивті «Сиқырлы кесте» фокусы және ЖИ-сиқыршы арқылы геймификациялау — оқушылардың логикалық ойлауын 
            және STEM пәндеріне қызығушылығын бірнеше есе арттырады.
          </p>
        </div>

        <div className="rounded-2xl bg-[#FFFFFF] p-6 border border-[#E5EAF0] shadow-xs space-y-3">
          <div className="w-10 h-[2px] bg-[#D92732]" />
          <div className="flex items-center gap-2 text-[#172B3A] font-extrabold text-base sm:text-lg">
            <Target className="w-5 h-5 text-[#D92732]" />
            <h3>02. Жобаның мақсаты (Цель исследования)</h3>
          </div>
          <p className="text-xs sm:text-sm text-[#657786] leading-relaxed">
            2 санының дәрежелері ($2^0, 2^1, 2^2, 2^3, 2^4$) мен екілік кодтау заңдылықтарын зерттей отырып, 
            қазақ тіліндегі заманауи интерактивті білім беру веб-қосымшасын («Сиқырлы кесте») әзірлеу және оны оқу үдерісінде қолдану.
          </p>
        </div>

        <div className="rounded-2xl bg-[#FFFFFF] p-6 border border-[#E5EAF0] shadow-xs space-y-3">
          <div className="w-10 h-[2px] bg-[#D92732]" />
          <div className="flex items-center gap-2 text-[#172B3A] font-extrabold text-base sm:text-lg">
            <CheckCircle2 className="w-5 h-5 text-[#4A9FE8]" />
            <h3>03. Негізгі міндеттері (Задачи)</h3>
          </div>
          <ul className="space-y-1.5 text-xs sm:text-sm text-[#657786]">
            <li>1. Екілік санау жүйесінің тарихы мен математикалық теоремасын талдау;</li>
            <li>2. 1–10, 1–15, 1–31 және 1–63 диапазондарындағы сандарды табатын алгоритм құру;</li>
            <li>3. Заманауи веб-технологиялар және ЖИ көмегімен интерактивті қосымша жасау;</li>
            <li>4. 10 сұрақтан тұратын білім тесті мен шамдар зертханасы арқылы оқушылар білімін бағалау.</li>
          </ul>
        </div>

        <div className="rounded-2xl bg-[#FFFFFF] p-6 border border-[#E5EAF0] shadow-xs space-y-3">
          <div className="w-10 h-[2px] bg-[#D92732]" />
          <div className="flex items-center gap-2 text-[#172B3A] font-extrabold text-base sm:text-lg">
            <Lightbulb className="w-5 h-5 text-[#D92732]" />
            <h3>04. Болжамы мен жаңалығы (Гипотеза и новизна)</h3>
          </div>
          <p className="text-xs sm:text-sm text-[#657786] leading-relaxed">
            <strong className="text-[#172B3A]">Болжам:</strong> Егер күрделі математикалық ұғымдар интерактивті фокус және виртуалды ЖИ-көмекші арқылы түсіндірілсе, 
            оқушылар тақырыпты 95–100% жылдам әрі терең меңгереді.<br />
            <strong className="text-[#172B3A]">Жаңалығы:</strong> Қазақ тіліндегі алғашқы ЖИ-сиқыршысы бар көпдеңгейлі екілік математикалық веб-зертхана.
          </p>
        </div>
      </div>

      {/* Final Conclusion Banner */}
      <div className="rounded-2xl bg-[#DCEEFF]/60 p-6 border border-[#4A9FE8]/40 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <Award className="w-10 h-10 text-[#D92732] shrink-0" />
          <div className="text-xs sm:text-sm text-[#172B3A] leading-relaxed">
            <strong className="text-[#172B3A] block text-base mb-0.5">Қорытынды (Вывод для защиты):</strong>
            «Сиқырлы кесте» — жай ғана ойын емес, бұл математика мен компьютерлік ғылымдарды байланыстыратын көпір. 
            Жоба сабақта, факультативтерде және ғылыми көрмелерде қолдануға толық дайын!
          </div>
        </div>
      </div>
    </div>
  );
};
