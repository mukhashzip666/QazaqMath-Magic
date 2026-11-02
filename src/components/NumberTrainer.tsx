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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-[#172B3A]/40 backdrop-blur-xs">
      <div className="w-full max-w-xl max-h-[90vh] overflow-y-auto rounded-2xl bg-[#FFFFFF] border border-[#E5EAF0] p-4 sm:p-6 shadow-2xl relative">
        <div className="absolute top-0 left-0 right-0 h-1 bg-[#D92732]" />
        {/* Close Button */}
        <button
          onClick={onClose}
          aria-label="Жабу"
          className="absolute top-4 right-4 p-2 rounded-lg bg-[#F5F8FA] text-[#657786] hover:text-[#172B3A] transition-colors cursor-pointer"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Title */}
        <div className="flex items-center gap-2.5 mb-4">
          <div className="p-2 rounded-xl bg-[#DCEEFF] text-[#4A9FE8]">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-lg font-extrabold text-[#172B3A]">
              «Сандар тренажері»
            </h3>
            <p className="text-xs text-[#657786]">
              1 мен 31 аралығындағы кез келген санды таңдап, оның екілік құпиясын көріңіз
            </p>
          </div>
        </div>

        {/* Number Selector / Slider */}
        <div className="p-4 rounded-xl bg-[#F5F8FA] border border-[#E5EAF0] mb-5">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs text-[#657786] font-semibold">Зерттелетін сан:</span>
            <span className="text-2xl font-extrabold font-code text-[#D92732] tabular-nums">
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
            className="w-full h-2 bg-[#E5EAF0] rounded-lg appearance-none cursor-pointer accent-[#4A9FE8]"
          />
          <div className="flex justify-between text-[10px] text-[#657786] font-code mt-1">
            <span>1</span>
            <span>8</span>
            <span>16</span>
            <span>24</span>
            <span>31</span>
          </div>
        </div>

        {/* Quick Numbers grid */}
        <div className="mb-5">
          <div className="text-xs text-[#657786] mb-2 font-semibold">
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
                className={`py-1 rounded-lg text-xs font-code font-bold transition-all cursor-pointer ${
                  selectedNum === n
                    ? 'bg-[#D92732] text-white scale-105 shadow-xs'
                    : 'bg-[#F5F8FA] text-[#172B3A] border border-[#E5EAF0] hover:bg-[#DCEEFF]'
                }`}
              >
                {n}
              </button>
            ))}
          </div>
        </div>

        {/* Binary Breakdown Result */}
        <div className="p-4 rounded-xl bg-[#F5F8FA] border border-[#E5EAF0] mb-6 space-y-2.5">
          <div className="flex items-center justify-between text-xs font-code">
            <span className="text-[#657786] flex items-center gap-1 font-medium">
              <Binary className="w-3.5 h-3.5 text-[#4A9FE8]" />
              Екілік код (5-бит):
            </span>
            <span className="text-[#4A9FE8] font-extrabold tracking-widest text-sm">
              {formulaInfo.binaryRepresentation}₂
            </span>
          </div>

          <div className="text-sm font-code text-[#172B3A]">
            <strong>Қосынды:</strong> {formulaInfo.formulaText}
          </div>

          <div className="text-xs text-[#657786]">
            Осы сан келесі бағандарда кездеседі:
            <div className="flex flex-wrap gap-1.5 mt-1.5">
              {MAGIC_COLUMNS.map((col) => {
                const isPresent = activeCols.includes(col.id);
                return (
                  <span
                    key={col.id}
                    className={`px-2 py-0.5 rounded text-[11px] font-code ${
                      isPresent
                        ? 'bg-[#DCEEFF] text-[#172B3A] border border-[#4A9FE8] font-bold'
                        : 'bg-[#FFFFFF] text-[#657786] border border-[#E5EAF0]'
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
            className="px-4 py-2 rounded-xl text-xs sm:text-sm text-[#657786] hover:text-[#172B3A] transition-colors cursor-pointer font-semibold"
          >
            Жабу
          </button>
          <button
            onClick={() => {
              onApplyNumber(selectedNum);
              onClose();
              soundManager.playMagicReveal();
            }}
            className="px-5 py-2.5 rounded-xl bg-[#D92732] hover:bg-[#b81f29] text-white font-bold text-xs sm:text-sm flex items-center gap-2 transition-colors cursor-pointer shadow-sm"
          >
            <span>Кестеде белгілеу</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
