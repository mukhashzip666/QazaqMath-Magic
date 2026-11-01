import React, { useState } from 'react';
import { Sparkles, X, Binary, ArrowRight } from 'lucide-react';
import { getColumnIdsForNumber, getMathFormula, MAGIC_COLUMNS } from '../utils/magicTable';
import { soundManager } from '../utils/soundEffects';

interface NumberTrainerProps {
  isOpen: boolean;
  onClose: () => void;
  onApplyNumber: (num: number) => void;
}

export const NumberTrainer: React.FC<NumberTrainerProps> = ({
  isOpen,
  onClose,
  onApplyNumber,
}) => {
  const [selectedNum, setSelectedNum] = useState<number>(13);

  if (!isOpen) return null;

  const activeCols = getColumnIdsForNumber(selectedNum);
  const formulaInfo = getMathFormula(activeCols);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="w-full max-w-xl rounded-2xl glass-panel-elevated border border-cyan-500/40 p-6 shadow-2xl relative">
        {/* Close Button */}
        <button
          onClick={onClose}
          aria-label="Жабу"
          className="absolute top-4 right-4 p-2 rounded-lg bg-slate-800 text-slate-400 hover:text-white transition-colors cursor-pointer"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Title */}
        <div className="flex items-center gap-2 mb-4">
          <div className="p-2 rounded-xl bg-cyan-500/20 text-cyan-300">
            <Sparkles className="w-5 h-5 text-cyan-400" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-slate-100">
              «Сандар тренажері»
            </h3>
            <p className="text-xs text-slate-400">
              1 мен 31 аралығындағы кез келген санды таңдап, оның екілік құпиясын көріңіз
            </p>
          </div>
        </div>

        {/* Number Selector / Slider */}
        <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 mb-5">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs text-slate-400 font-medium">Зерттелетін сан:</span>
            <span className="text-2xl font-bold font-mono text-cyan-300 tabular-nums">
              {selectedNum}
            </span>
          </div>
          <input
            type="range"
            min="1"
            max="31"
            value={selectedNum}
            onChange={(e) => {
              const val = Number(e.target.value);
              setSelectedNum(val);
              soundManager.playSelect(400 + val * 10);
            }}
            className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-cyan-400"
          />
          <div className="flex justify-between text-[10px] text-slate-500 font-mono mt-1">
            <span>1</span>
            <span>8</span>
            <span>16</span>
            <span>24</span>
            <span>31</span>
          </div>
        </div>

        {/* Quick Numbers grid */}
        <div className="mb-5">
          <div className="text-xs text-slate-400 mb-2 font-medium">
            Жылдам таңдау:
          </div>
          <div className="grid grid-cols-8 sm:grid-cols-11 gap-1.5 text-center">
            {Array.from({ length: 31 }, (_, i) => i + 1).map((n) => (
              <button
                key={n}
                onClick={() => {
                  setSelectedNum(n);
                  soundManager.playSelect(450 + n * 8);
                }}
                className={`py-1 rounded text-xs font-mono font-semibold transition-all cursor-pointer ${
                  selectedNum === n
                    ? 'bg-cyan-400 text-slate-950 font-bold scale-110 shadow-md'
                    : 'bg-slate-800/80 text-slate-300 hover:bg-slate-700'
                }`}
              >
                {n}
              </button>
            ))}
          </div>
        </div>

        {/* Binary Breakdown Result */}
        <div className="p-4 rounded-xl bg-slate-950/70 border border-purple-500/30 mb-6 space-y-3">
          <div className="flex items-center justify-between text-xs font-mono">
            <span className="text-slate-400 flex items-center gap-1">
              <Binary className="w-3.5 h-3.5 text-cyan-400" />
              Екілік код (5-бит):
            </span>
            <span className="text-amber-300 font-bold tracking-widest text-sm">
              {formulaInfo.binaryRepresentation}₂
            </span>
          </div>

          <div className="text-sm font-mono text-cyan-200">
            <strong>Қосынды:</strong> {formulaInfo.formulaText}
          </div>

          <div className="text-xs text-slate-400">
            Осы сан келесі бағандарда кездеседі:
            <div className="flex flex-wrap gap-1.5 mt-1.5">
              {MAGIC_COLUMNS.map((col) => {
                const isPresent = activeCols.includes(col.id);
                return (
                  <span
                    key={col.id}
                    className={`px-2 py-0.5 rounded text-[11px] font-mono ${
                      isPresent
                        ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 font-semibold'
                        : 'bg-slate-900 text-slate-600 border border-slate-800'
                    }`}
                  >
                    {col.title} ({col.key})
                  </span>
                );
              })}
            </div>
          </div>
        </div>

        {/* Apply CTA */}
        <div className="flex items-center justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl text-xs sm:text-sm text-slate-400 hover:text-white transition-colors cursor-pointer"
          >
            Жабу
          </button>
          <button
            onClick={() => {
              onApplyNumber(selectedNum);
              onClose();
              soundManager.playMagicReveal();
            }}
            className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-cyan-400 to-blue-500 text-slate-950 font-bold text-xs sm:text-sm flex items-center gap-2 hover:opacity-90 transition-opacity cursor-pointer shadow-lg shadow-cyan-500/25"
          >
            <span>Кестеде белгілеу</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
