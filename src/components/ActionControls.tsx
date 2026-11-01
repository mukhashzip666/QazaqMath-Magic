import React from 'react';
import { Sparkles, RotateCcw, Unlock, Lock } from 'lucide-react';
import { soundManager } from '../utils/soundEffects';

interface ActionControlsProps {
  onRevealNumber: () => void;
  onReset: () => void;
  isSecretRevealed: boolean;
  onToggleSecret: () => void;
  hasSelection: boolean;
}

export const ActionControls: React.FC<ActionControlsProps> = ({
  onRevealNumber,
  onReset,
  isSecretRevealed,
  onToggleSecret,
  hasSelection,
}) => {
  return (
    <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-4 my-6">
      {/* Primary 1: «Санды білу ✨» */}
      <button
        type="button"
        onClick={() => {
          onRevealNumber();
          soundManager.playMagicReveal();
        }}
        className="px-6 sm:px-8 py-3.5 rounded-xl font-bold text-sm sm:text-base text-slate-950 bg-gradient-to-r from-amber-300 via-cyan-300 to-cyan-400 hover:from-amber-200 hover:to-cyan-300 shadow-xl shadow-cyan-500/25 transition-all transform hover:-translate-y-0.5 active:translate-y-0 flex items-center gap-2 cursor-pointer magic-glow-cyan"
      >
        <Sparkles className="w-5 h-5 text-slate-950 fill-current animate-spin" style={{ animationDuration: '6s' }} />
        <span>Санды білу ✨</span>
      </button>

      {/* Primary 2: «Қайта бастау 🔄» */}
      <button
        type="button"
        onClick={() => {
          onReset();
          soundManager.playReset();
        }}
        className="px-5 sm:px-6 py-3.5 rounded-xl font-medium text-sm sm:text-base text-slate-300 hover:text-white bg-slate-900/90 hover:bg-slate-800 border border-slate-700/80 transition-all flex items-center gap-2 cursor-pointer"
      >
        <RotateCcw className="w-4 h-4 text-slate-400" />
        <span>Қайта бастау 🔄</span>
      </button>

      {/* Secret Reveal Toggle: «Құпияны ашу 🔓» */}
      <button
        type="button"
        onClick={() => {
          onToggleSecret();
          if (!isSecretRevealed) {
            soundManager.playSecretUnlock();
          }
        }}
        className={`px-5 py-3.5 rounded-xl font-medium text-xs sm:text-sm border transition-all flex items-center gap-2 cursor-pointer ${
          isSecretRevealed
            ? 'bg-amber-500/20 border-amber-400/60 text-amber-200 shadow-lg shadow-amber-500/20'
            : 'bg-purple-950/40 hover:bg-purple-900/40 border-purple-800/60 text-purple-200'
        }`}
      >
        {isSecretRevealed ? (
          <>
            <Lock className="w-4 h-4 text-amber-400" />
            <span>Құпияны жасыру</span>
          </>
        ) : (
          <>
            <Unlock className="w-4 h-4 text-purple-400" />
            <span>Құпияны ашу 🔓</span>
          </>
        )}
      </button>
    </div>
  );
};
