import React from 'react';
import { Eye, CheckCircle2, Wand2, Layers } from 'lucide-react';
import { GameRangeMode, getMaxNumberForMode } from '../utils/magicTable';
import { soundManager } from '../utils/soundEffects';

interface InstructionBannerProps {
  mode: GameRangeMode;
  onChangeMode: (mode: GameRangeMode) => void;
}

export const InstructionBanner: React.FC<InstructionBannerProps> = ({
  mode,
  onChangeMode,
}) => {
  const maxNum = getMaxNumberForMode(mode);

  const modes: { id: GameRangeMode; label: string; badge: string }[] = [
    { id: '1-10', label: '1 – 10', badge: '4 баған · Жеңіл' },
    { id: '1-15', label: '1 – 15', badge: '4 бит' },
    { id: '1-31', label: '1 – 31', badge: '5 баған · Классика' },
    { id: '1-63', label: '1 – 63', badge: '6 баған · Шебер' },
  ];

  return (
    <div className="relative overflow-hidden rounded-2xl glass-panel p-5 sm:p-6 mb-6 border border-purple-500/20 shadow-2xl">
      {/* Background ambient decorative shapes */}
      <div className="absolute -top-16 -right-16 w-56 h-56 bg-purple-600/15 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-16 -left-16 w-56 h-56 bg-cyan-600/15 rounded-full blur-3xl pointer-events-none" />

      <div className="relative z-10 space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex flex-wrap items-center gap-2.5 mb-2">
              <span className="font-magic text-2xl sm:text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-amber-200 via-cyan-200 to-purple-300">
                «Сиқырлы кесте»
              </span>
              <span className="text-xs text-cyan-300 font-medium">
                · Магиялық математикалық фокус · 1–{maxNum} диапазоны
              </span>
            </div>
            <p className="text-slate-200 text-sm sm:text-base leading-relaxed max-w-3xl font-normal">
              Кестенің ішінен <strong className="text-amber-300 font-semibold">1 мен {maxNum}</strong> аралығындағы бір санды таңдап, есіңізге сақтаңыз. 
              Ойлаған саныңыз қай бағандарда кездесетінін белгілеңіз, мен сізге құпия санды тауып беремін!
            </p>
          </div>

          {/* 3 Quick Visual Steps */}
          <div className="grid grid-cols-3 gap-2 sm:gap-3 shrink-0 pt-2 md:pt-0 border-t md:border-t-0 border-slate-800/80">
            <div className="flex flex-col items-center text-center p-2.5 rounded-xl bg-slate-900/60 border border-slate-800">
              <Eye className="w-4 h-4 text-amber-400 mb-1" />
              <span className="text-[11px] text-slate-300 font-medium leading-tight">1. Сан ойла</span>
            </div>
            <div className="flex flex-col items-center text-center p-2.5 rounded-xl bg-slate-900/60 border border-slate-800">
              <CheckCircle2 className="w-4 h-4 text-cyan-400 mb-1" />
              <span className="text-[11px] text-slate-300 font-medium leading-tight">2. Бағанды белгіле</span>
            </div>
            <div className="flex flex-col items-center text-center p-2.5 rounded-xl bg-slate-900/60 border border-slate-800">
              <Wand2 className="w-4 h-4 text-purple-400 mb-1" />
              <span className="text-[11px] text-slate-300 font-medium leading-tight">3. Санды біл</span>
            </div>
          </div>
        </div>

        {/* Interactive Mode Switcher: 1-10, 1-15, 1-31, 1-63 */}
        <div className="pt-3 border-t border-slate-800/70 flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
          <div className="flex items-center gap-2 text-xs text-slate-400">
            <Layers className="w-4 h-4 text-cyan-400 shrink-0" />
            <span>Күрделілік деңгейі мен сандар диапазоны:</span>
          </div>

          <div className="flex flex-wrap items-center gap-1.5 bg-slate-950/70 p-1 rounded-xl border border-slate-800">
            {modes.map((m) => {
              const isActive = mode === m.id;
              return (
                <button
                  key={m.id}
                  type="button"
                  onClick={() => {
                    onChangeMode(m.id);
                    soundManager.playSelect(500);
                  }}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all cursor-pointer flex items-center gap-1.5 whitespace-nowrap ${
                    isActive
                      ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-slate-950 font-bold shadow-md shadow-cyan-500/20'
                      : 'text-slate-300 hover:text-white hover:bg-slate-800/70'
                  }`}
                >
                  <span className="font-mono">{m.label}</span>
                  <span className={`text-[10px] ${isActive ? 'text-slate-900' : 'text-slate-500'}`}>
                    ({m.badge})
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
