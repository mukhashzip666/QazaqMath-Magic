import React, { useState } from 'react';
import { Binary, Cpu, BookOpen, Lightbulb, Sparkles, History, ArrowRight } from 'lucide-react';
import { soundManager } from '../utils/soundEffects';

export const TheorySection: React.FC = () => {
  // Interactive 5-bit laboratory state: [16, 8, 4, 2, 1]
  const [bits, setBits] = useState<boolean[]>([false, true, true, false, true]); // default 13 (01101)
  const weights = [16, 8, 4, 2, 1];
  const powers = [4, 3, 2, 1, 0];

  const toggleBit = (index: number) => {
    setBits((prev) => {
      const next = [...prev];
      next[index] = !next[index];
      return next;
    });
    soundManager.playSelect(460 + index * 45);
  };

  const totalDecimal = bits.reduce((acc, isOn, idx) => acc + (isOn ? weights[idx] : 0), 0);
  const binaryString = bits.map((b) => (b ? '1' : '0')).join('');
  const activeWeights = weights.filter((_, idx) => bits[idx]);

  return (
    <div className="space-y-8">
      {/* Hero Banner */}
      <div className="rounded-2xl glass-panel-elevated p-6 sm:p-8 border border-cyan-500/30">
        <div className="flex items-center gap-2 text-cyan-400 text-xs font-bold uppercase tracking-wider mb-2">
          <BookOpen className="w-4 h-4" />
          <span>Ғылыми-математикалық негіздеме</span>
        </div>
        <h2 className="font-magic text-2xl sm:text-3xl font-bold text-white mb-3">
          «Сиқырлы кестенің» математикалық теориясы мен тарихы
        </h2>
        <p className="text-slate-300 text-sm sm:text-base leading-relaxed max-w-3xl">
          Бұл фокус сиқыр емес — бұл информатика мен дискретті математиканың іргетасы саналатын{' '}
          <strong className="text-amber-300">екілік санау жүйесінің (binary numeral system)</strong>{' '}
          көрнекі демонстрациясы. Төмендегі интерактивті зертханада әр битті қосып-өшіріп, сандардың қалай түзілетінін зерттеңіз!
        </p>
      </div>

      {/* Interactive Binary Switch Laboratory */}
      <div className="rounded-2xl glass-panel p-6 sm:p-8 border border-purple-500/30 magic-glow-purple">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 pb-4 border-b border-slate-800">
          <div>
            <div className="flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-amber-400" />
              <h3 className="text-lg sm:text-xl font-bold text-white">
                Интерактивті 5-биттік шамдар зертханасы
              </h3>
            </div>
            <p className="text-xs sm:text-sm text-slate-400 mt-1">
              Шамдарды басып қосыңыз (1) немесе өшіріңіз (0) — ондық санның қалай өзгеретінін бақылаңыз
            </p>
          </div>

          <div className="flex items-center gap-2">
            {[7, 13, 21, 31].map((preset) => (
              <button
                key={preset}
                type="button"
                onClick={() => {
                  setBits(weights.map((w) => (preset & w) === w));
                  soundManager.playMagicReveal();
                }}
                className="px-3 py-1.5 rounded-lg bg-slate-900 hover:bg-cyan-950 border border-slate-700 hover:border-cyan-500/50 text-xs font-mono text-cyan-300 cursor-pointer transition-colors"
              >
                Сан: {preset}
              </button>
            ))}
          </div>
        </div>

        {/* 5 Bit Switches */}
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 sm:gap-4 mb-6">
          {weights.map((weight, idx) => {
            const isOn = bits[idx];
            return (
              <button
                key={weight}
                type="button"
                onClick={() => toggleBit(idx)}
                className={`p-4 rounded-2xl border text-center transition-all cursor-pointer flex flex-col items-center justify-between ${
                  isOn
                    ? 'bg-gradient-to-b from-cyan-500/25 to-purple-900/30 border-cyan-400 magic-glow-cyan scale-[1.02]'
                    : 'bg-slate-900/70 border-slate-800 hover:border-slate-700 text-slate-500'
                }`}
              >
                <span className="text-xs font-medium text-slate-400">
                  {idx + 1}-баған кілті
                </span>

                <div
                  className={`my-3 w-12 h-12 rounded-full flex items-center justify-center transition-all ${
                    isOn
                      ? 'bg-amber-400 text-slate-950 shadow-lg shadow-amber-400/50'
                      : 'bg-slate-800 text-slate-500'
                  }`}
                >
                  <Lightbulb className="w-6 h-6" />
                </div>

                <div className="text-2xl font-extrabold font-mono text-white">
                  {weight}
                </div>
                <div className="text-xs font-mono text-cyan-300/80 mb-2">
                  2^{powers[idx]} = {weight}
                </div>

                <div
                  className={`w-full py-1.5 rounded-lg font-mono text-xs font-bold ${
                    isOn
                      ? 'bg-cyan-400 text-slate-950'
                      : 'bg-slate-950 text-slate-500'
                  }`}
                >
                  Бит: {isOn ? '1 (ҚОСУЛЫ)' : '0 (ӨШІРУЛІ)'}
                </div>
              </button>
            );
          })}
        </div>

        {/* Live Calculation Readout */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 sm:p-5 rounded-2xl bg-slate-950/90 border border-cyan-500/30">
          <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800">
            <span className="text-xs text-slate-400 block mb-1">Екілік код (Binary):</span>
            <span className="text-2xl font-bold font-mono text-amber-300 tracking-widest">
              {binaryString}₂
            </span>
          </div>

          <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800">
            <span className="text-xs text-slate-400 block mb-1">Қосылатын кілттер:</span>
            <span className="text-lg font-bold font-mono text-cyan-300">
              {activeWeights.length > 0 ? activeWeights.join(' + ') : '0 (ешбір баған жоқ)'}
            </span>
          </div>

          <div className="p-3 rounded-xl bg-gradient-to-r from-purple-900/50 to-cyan-900/50 border border-cyan-400/40 flex items-center justify-between">
            <div>
              <span className="text-xs text-cyan-200 block mb-0.5">Нәтиже (Ондық сан):</span>
              <span className="text-3xl font-extrabold font-mono text-white tabular-nums">
                = {totalDecimal}
              </span>
            </div>
            <ArrowRight className="w-6 h-6 text-cyan-300" />
          </div>
        </div>
      </div>

      {/* Mathematical Theorem & Historical Timeline */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Theorem Card */}
        <div className="rounded-2xl glass-panel p-6 border border-slate-800 space-y-4">
          <div className="flex items-center gap-2.5 text-amber-300 font-bold text-lg">
            <Binary className="w-5 h-5 text-amber-400" />
            <h3>Математикалық теорема және дәлелдеме</h3>
          </div>
          <p className="text-sm text-slate-300 leading-relaxed">
            Кез келген $N$ натурал санын ($1 \le N \le 2^k - 1$) 2 санының дәрежелерінің қосындысы ретінде{' '}
            <strong className="text-white">жалғыз ғана тәсілмен</strong> өрнектеуге болады:
          </p>
          <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 font-mono text-xs sm:text-sm text-cyan-300 text-center">
            N = b₄·16 + b₃·8 + b₂·4 + b₁·2 + b₀·1, мұндағы bᵢ ∈ &#123;0, 1&#125;
          </div>
          <ul className="space-y-2.5 text-xs sm:text-sm text-slate-300">
            <li>
              • <strong>Неге әр бағанда дәл 16 сан бар?</strong> 0-ден 31-ге дейін барлығы 32 сан бар. Олардың дәл жартысында (16 санда) сәйкес екілік разрядта «1» цифры тұрады.
            </li>
            <li>
              • <strong>Неге 5-бағанда тек тақ сандар?</strong> Өйткені 16, 8, 4, 2 — жұп сандар. Тақ сан шығуы үшін $2^0 = 1$ разряды міндетті түрде қосылуы керек.
            </li>
            <li>
              • <strong>Масштабталу заңдылығы:</strong> $k$ баған арқылы $2^k - 1$ санына дейін табуға болады: 4 бағанмен — 15-ке дейін, 5 бағанмен — 31-ге дейін, 6 бағанмен — 63-ке дейін, 10 бағанмен — 1023-ке дейін!
            </li>
          </ul>
        </div>

        {/* History & Computer Science Connection */}
        <div className="rounded-2xl glass-panel p-6 border border-slate-800 space-y-4">
          <div className="flex items-center gap-2.5 text-cyan-300 font-bold text-lg">
            <History className="w-5 h-5 text-cyan-400" />
            <h3>Тарихи даму жолы және ІТ қолданысы</h3>
          </div>

          <div className="space-y-3.5 text-xs sm:text-sm text-slate-300">
            <div className="p-3.5 rounded-xl bg-slate-900/70 border border-slate-800">
              <div className="font-bold text-white mb-0.5">1679–1703 жж. — Готфрид Вильгельм Лейбниц</div>
              <p className="text-slate-400">
                Ұлы неміс математигі «Explication de l'Arithmétique Binaire» еңбегінде барлық сандарды тек 0 мен 1 арқылы жазу жүйесін ашты.
              </p>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-900/70 border border-slate-800">
              <div className="font-bold text-white mb-0.5">1854 ж. — Джордж Буль және Логика алгебрасы</div>
              <p className="text-slate-400">
                Ағылшын математигі ақиқат (1 / Иә) пен жалған (0 / Жоқ) ұғымдарын математикалық заңдылыққа айналдырды.
              </p>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-900/70 border border-slate-800">
              <div className="font-bold text-white mb-0.5 flex items-center gap-1.5">
                <Cpu className="w-4 h-4 text-purple-400" />
                <span>ХХ–ХХІ ғғ. — Клод Шеннон және Цифрлық дәуір</span>
              </div>
              <p className="text-slate-400">
                Бүгінгі смартфондар, жасанды интеллект, интернет және QR-кодтар дәл осы «Сиқырлы кестедегі» екілік кодтау принципімен жұмыс істейді.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
