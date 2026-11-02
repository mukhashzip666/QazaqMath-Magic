import React, { useState } from 'react';
import { Binary, Cpu, BookOpen, Lightbulb, Sparkles, History, ArrowRight } from 'lucide-react';
import { soundManager } from '../utils/soundEffects';

export const TheorySection: React.FC = () => {
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
      <div className="rounded-2xl bg-[#F5F8FA] p-6 sm:p-8 border border-[#E5EAF0] relative overflow-hidden">
        <div className="absolute top-0 left-0 right-0 h-[2px] bg-[#D92732]" />
        <div className="flex items-center gap-2 text-[#D92732] text-xs font-bold uppercase tracking-wider mb-2">
          <BookOpen className="w-4 h-4" />
          <span>Ғылыми-математикалық негіздеме</span>
        </div>
        <h2 className="text-2xl sm:text-3xl font-extrabold text-[#172B3A] mb-3">
          «Сиқырлы кестенің» математикалық теориясы мен тарихы
        </h2>
        <p className="text-[#657786] text-sm sm:text-base leading-relaxed max-w-3xl">
          Бұл фокус сиқыр емес — бұл информатика мен дискретті математиканың іргетасы саналатын{' '}
          <strong className="text-[#172B3A]">екілік санау жүйесінің (binary numeral system)</strong>{' '}
          көрнекі демонстрациясы. Төмендегі интерактивті зертханада әр битті қосып-өшіріп, сандардың қалай түзілетінін зерттеңіз!
        </p>
      </div>

      {/* Interactive Binary Switch Laboratory */}
      <div className="rounded-2xl bg-[#FFFFFF] p-6 sm:p-8 border border-[#E5EAF0] shadow-[0_8px_30px_rgba(23,43,58,0.05)]">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 pb-4 border-b border-[#E5EAF0]">
          <div>
            <div className="flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-[#D92732]" />
              <h3 className="text-lg sm:text-xl font-extrabold text-[#172B3A]">
                Интерактивті 5-биттік шамдар зертханасы
              </h3>
            </div>
            <p className="text-xs sm:text-sm text-[#657786] mt-1">
              Шамдарды басып қосыңыз (1) немесе өшіріңіз (0) — ондық санның қалай өзгеретінін бақылаңыз
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {[7, 13, 21, 31].map((preset) => (
              <button
                key={preset}
                type="button"
                onClick={() => {
                  setBits(weights.map((w) => (preset & w) === w));
                  soundManager.playMagicReveal();
                }}
                className="px-3 py-1.5 rounded-lg bg-[#F5F8FA] hover:bg-[#DCEEFF] border border-[#E5EAF0] hover:border-[#4A9FE8] text-xs font-code font-bold text-[#172B3A] cursor-pointer transition-colors"
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
                    ? 'bg-[#DCEEFF]/60 border-2 border-[#4A9FE8] shadow-md scale-[1.01]'
                    : 'bg-[#F5F8FA] border-[#E5EAF0] hover:border-[#4A9FE8]/50 text-[#657786]'
                }`}
              >
                <span className="text-xs font-semibold text-[#657786]">
                  {idx + 1}-баған кілті
                </span>

                <div
                  className={`my-3 w-12 h-12 rounded-full flex items-center justify-center transition-all ${
                    isOn
                      ? 'bg-[#4A9FE8] text-white shadow-md'
                      : 'bg-[#E5EAF0] text-[#657786]'
                  }`}
                >
                  <Lightbulb className="w-6 h-6" />
                </div>

                <div className="text-2xl font-extrabold font-code text-[#172B3A]">
                  {weight}
                </div>
                <div className="text-xs font-code text-[#657786] mb-2">
                  2^{powers[idx]} = {weight}
                </div>

                <div
                  className={`w-full py-1.5 rounded-lg font-code text-xs font-bold ${
                    isOn
                      ? 'bg-[#D92732] text-white'
                      : 'bg-[#E5EAF0] text-[#657786]'
                  }`}
                >
                  Бит: {isOn ? '1 (ҚОСУЛЫ)' : '0 (ӨШІРУЛІ)'}
                </div>
              </button>
            );
          })}
        </div>

        {/* Live Calculation Readout */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 sm:p-5 rounded-2xl bg-[#F5F8FA] border border-[#E5EAF0]">
          <div className="p-3.5 rounded-xl bg-[#FFFFFF] border border-[#E5EAF0]">
            <span className="text-xs text-[#657786] block mb-1 font-medium">Екілік код (Binary):</span>
            <span className="text-2xl font-extrabold font-code text-[#4A9FE8] tracking-widest">
              {binaryString}₂
            </span>
          </div>

          <div className="p-3.5 rounded-xl bg-[#FFFFFF] border border-[#E5EAF0]">
            <span className="text-xs text-[#657786] block mb-1 font-medium">Қосылатын кілттер:</span>
            <span className="text-lg font-extrabold font-code text-[#172B3A]">
              {activeWeights.length > 0 ? activeWeights.join(' + ') : '0 (ешбір баған жоқ)'}
            </span>
          </div>

          <div className="p-3.5 rounded-xl bg-[#DCEEFF] border border-[#4A9FE8]/40 flex items-center justify-between">
            <div>
              <span className="text-xs text-[#172B3A] font-semibold block mb-0.5">Нәтиже (Ондық сан):</span>
              <span className="text-3xl font-extrabold font-code text-[#D92732] tabular-nums">
                = {totalDecimal}
              </span>
            </div>
            <ArrowRight className="w-6 h-6 text-[#4A9FE8]" />
          </div>
        </div>
      </div>

      {/* Mathematical Theorem & Historical Timeline */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Theorem Card */}
        <div className="rounded-2xl bg-[#FFFFFF] p-6 border border-[#E5EAF0] shadow-xs space-y-4 relative overflow-hidden">
          <div className="w-12 h-[2px] bg-[#D92732]" />
          <div className="flex items-center gap-2.5 text-[#172B3A] font-extrabold text-lg">
            <Binary className="w-5 h-5 text-[#4A9FE8]" />
            <h3>Математикалық теорема және дәлелдеме</h3>
          </div>
          <p className="text-sm text-[#657786] leading-relaxed">
            Кез келген $N$ натурал санын ($1 \le N \le 2^k - 1$) 2 санының дәрежелерінің қосындысы ретінде{' '}
            <strong className="text-[#172B3A]">жалғыз ғана тәсілмен</strong> өрнектеуге болады:
          </p>
          <div className="p-4 rounded-xl bg-[#F5F8FA] border border-[#E5EAF0] font-code text-xs sm:text-sm text-[#172B3A] font-bold text-center">
            N = b₄·16 + b₃·8 + b₂·4 + b₁·2 + b₀·1, мұндағы bᵢ ∈ &#123;0, 1&#125;
          </div>
          <ul className="space-y-2.5 text-xs sm:text-sm text-[#657786]">
            <li>
              • <strong className="text-[#172B3A]">Неге әр бағанда дәл 16 сан бар?</strong> 0-ден 31-ге дейін барлығы 32 сан бар. Олардың дәл жартысында (16 санда) сәйкес екілік разрядта «1» цифры тұрады.
            </li>
            <li>
              • <strong className="text-[#172B3A]">Неге 5-бағанда тек тақ сандар?</strong> Өйткені 16, 8, 4, 2 — жұп сандар. Тақ сан шығуы үшін $2^0 = 1$ разряды міндетті түрде қосылуы керек.
            </li>
            <li>
              • <strong className="text-[#172B3A]">Масштабталу заңдылығы:</strong> $k$ баған арқылы $2^k - 1$ санына дейін табуға болады: 4 бағанмен — 15-ке дейін, 5 бағанмен — 31-ге дейін, 6 бағанмен — 63-ке дейін!
            </li>
          </ul>
        </div>

        {/* History & Computer Science Connection */}
        <div className="rounded-2xl bg-[#FFFFFF] p-6 border border-[#E5EAF0] shadow-xs space-y-4 relative overflow-hidden">
          <div className="w-12 h-[2px] bg-[#D92732]" />
          <div className="flex items-center gap-2.5 text-[#172B3A] font-extrabold text-lg">
            <History className="w-5 h-5 text-[#D92732]" />
            <h3>Тарихи даму жолы және ІТ қолданысы</h3>
          </div>

          <div className="space-y-3.5 text-xs sm:text-sm">
            <div className="p-3.5 rounded-xl bg-[#F5F8FA] border border-[#E5EAF0]">
              <div className="font-bold text-[#172B3A] mb-0.5">1679–1703 жж. — Готфрид Вильгельм Лейбниц</div>
              <p className="text-[#657786]">
                Ұлы неміс математигі «Explication de l'Arithmétique Binaire» еңбегінде барлық сандарды тек 0 мен 1 арқылы жазу жүйесін ашты.
              </p>
            </div>

            <div className="p-3.5 rounded-xl bg-[#F5F8FA] border border-[#E5EAF0]">
              <div className="font-bold text-[#172B3A] mb-0.5">1854 ж. — Джордж Буль және Логика алгебрасы</div>
              <p className="text-[#657786]">
                Ағылшын математигі ақиқат (1 / Иә) пен жалған (0 / Жоқ) ұғымдарын математикалық заңдылыққа айналдырды.
              </p>
            </div>

            <div className="p-3.5 rounded-xl bg-[#F5F8FA] border border-[#E5EAF0]">
              <div className="font-bold text-[#172B3A] mb-0.5 flex items-center gap-1.5">
                <Cpu className="w-4 h-4 text-[#4A9FE8]" />
                <span>ХХ–ХХІ ғғ. — Клод Шеннон және Цифрлық дәуір</span>
              </div>
              <p className="text-[#657786]">
                Бүгінгі смартфондар, жасанды интеллект, интернет және QR-кодтар дәл осы «Сиқырлы кестедегі» екілік кодтау принципімен жұмыс істейді.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
