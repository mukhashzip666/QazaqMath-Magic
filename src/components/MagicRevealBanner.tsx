import React from 'react';
import { Sparkles, Unlock, Binary, RotateCcw } from 'lucide-react';
import { GameRangeMode, getMathFormula } from '../utils/magicTable';
import { soundManager } from '../utils/soundEffects';

interface MagicRevealBannerProps {
  guessedNumber: number | null;
  selectedColumnIds: number[];
  mode: GameRangeMode;
  isSecretRevealed: boolean;
  onRevealSecret: () => void;
  onReset: () => void;
}

export const MagicRevealBanner: React.FC<MagicRevealBannerProps> = ({
  guessedNumber,
  selectedColumnIds,
  mode,
  isSecretRevealed,
  onRevealSecret,
  onReset,
}) => {
  if (guessedNumber === null || guessedNumber <= 0) return null;

  const formulaInfo = getMathFormula(selectedColumnIds, mode);

  return (
    <div className="relative overflow-hidden rounded-2xl glass-panel-elevated border border-cyan-400/50 p-5 sm:p-6 mb-6 magic-glow-cyan transition-all duration-500">
      {/* Ambient glowing radial orbs */}
      <div className="absolute -top-20 -left-20 w-60 h-60 bg-cyan-500/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-20 -right-20 w-60 h-60 bg-amber-500/20 rounded-full blur-3xl pointer-events-none" />

      <div className="relative z-10 flex flex-col sm:flex-row items-center justify-between gap-5">
        <div className="flex items-center gap-4 sm:gap-5">
          {/* Glowing Crystal Number Orb */}
          <div className="relative shrink-0 w-20 h-20 sm:w-24 sm:h-24 rounded-2xl bg-gradient-to-br from-purple-700 via-indigo-900 to-cyan-600 p-[2px] magic-glow-gold">
            <div className="w-full h-full rounded-[14px] bg-[#080c18] flex flex-col items-center justify-center">
              <span className="text-[10px] uppercase tracking-widest text-cyan-300 font-semibold">
                Құпия сан
              </span>
              <span className="font-magic text-3xl sm:text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-amber-200 via-yellow-300 to-cyan-300 tabular-nums">
                {guessedNumber}
              </span>
            </div>
          </div>

          <div>
            <div className="flex items-center gap-2 mb-1">
              <Sparkles className="w-4 h-4 text-amber-400" />
              <span className="text-xs font-bold uppercase tracking-wider text-amber-300">
                Абракадабра! Сиқыршы ойыңызды тапты
              </span>
            </div>
            <h3 className="text-lg sm:text-2xl font-bold text-white mb-1">
              Сіз <span className="text-cyan-300 font-mono">{guessedNumber}</span> санын ойладыңыз!
            </h3>
            <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs font-mono text-slate-300">
              <span className="flex items-center gap-1 text-purple-300">
                <Binary className="w-3.5 h-3.5 text-cyan-400" />
                Екілік коды: <strong className="text-amber-300">{formulaInfo.binaryRepresentation}₂</strong>
              </span>
              {isSecretRevealed && (
                <>
                  <span>·</span>
                  <span className="text-cyan-200">
                    Формула: <strong>{formulaInfo.formulaText}</strong>
                  </span>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Action CTA */}
        <div className="flex flex-wrap items-center gap-2.5 shrink-0 w-full sm:w-auto justify-end">
          {!isSecretRevealed && (
            <button
              type="button"
              onClick={() => {
                onRevealSecret();
                soundManager.playSecretUnlock();
              }}
              className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-amber-400 via-amber-300 to-yellow-500 text-slate-950 font-bold text-xs sm:text-sm flex items-center gap-1.5 shadow-lg shadow-amber-500/25 hover:from-amber-300 hover:to-yellow-400 cursor-pointer transition-transform active:scale-95"
            >
              <Unlock className="w-4 h-4 text-slate-950" />
              <span>Иә, құпиясын аш! 🔓</span>
            </button>
          )}
          <button
            type="button"
            onClick={() => {
              onReset();
              soundManager.playReset();
            }}
            className="px-3.5 py-2.5 rounded-xl bg-slate-900/90 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-700 text-xs sm:text-sm flex items-center gap-1.5 cursor-pointer transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Жаңа сан</span>
          </button>
        </div>
      </div>
    </div>
  );
};
