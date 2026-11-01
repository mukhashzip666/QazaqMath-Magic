import React from 'react';
import { GameRangeMode, getColumnsForMode, MagicColumn } from '../utils/magicTable';
import { Check, Lock, KeyRound } from 'lucide-react';
import { soundManager } from '../utils/soundEffects';

interface MagicTableProps {
  selectedColumnIds: number[];
  onToggleColumn: (columnId: number) => void;
  isSecretRevealed: boolean;
  highlightedNumber?: number | null;
  mode?: GameRangeMode;
}

export const MagicTable: React.FC<MagicTableProps> = ({
  selectedColumnIds,
  onToggleColumn,
  isSecretRevealed,
  highlightedNumber = null,
  mode = '1-31',
}) => {
  const columns = getColumnsForMode(mode);

  const gridColsClass =
    columns.length === 4
      ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-4'
      : columns.length === 6
      ? 'grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6'
      : 'grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5';

  return (
    <div className="w-full">
      <div className={`grid ${gridColsClass} gap-3 sm:gap-3.5`}>
        {columns.map((column: MagicColumn) => {
          const isSelected = selectedColumnIds.includes(column.id);
          const innerCols = column.numbers.length > 16 ? 'grid-cols-4' : 'grid-cols-2';

          return (
            <div
              key={column.id}
              className={`relative flex flex-col rounded-2xl transition-all duration-300 overflow-hidden border ${
                isSelected
                  ? 'bg-gradient-to-b from-[#141b36] to-[#0c1022] border-cyan-400 magic-glow-cyan scale-[1.01] z-10'
                  : 'bg-[#0f172a]/75 border-slate-800/80 hover:border-purple-500/40 hover:bg-[#131b33]/70'
              }`}
            >
              {/* Column Top Header */}
              <div
                className={`px-3 py-2.5 flex items-center justify-between border-b transition-colors ${
                  isSelected
                    ? 'border-cyan-500/40 bg-cyan-950/30 text-cyan-200'
                    : 'border-slate-800/80 bg-slate-900/40 text-slate-300'
                }`}
              >
                <div className="flex items-center gap-2">
                  <span className="font-magic font-bold text-sm sm:text-base">
                    {column.title}
                  </span>
                </div>
                {isSelected && (
                  <span className="text-[11px] font-semibold text-cyan-400">
                    ✓ Таңдалды
                  </span>
                )}
              </div>

              {/* Numbers Grid */}
              <div className="p-2.5 sm:p-3 grow flex flex-col justify-center">
                <div className={`grid ${innerCols} gap-1.5 text-center`}>
                  {column.numbers.map((num, idx) => {
                    const isCellHighlighted = highlightedNumber === num;
                    const isKeyNumber = idx === 0 && isSecretRevealed;

                    return (
                      <div
                        key={num}
                        className={`py-1 px-1 rounded-lg text-xs sm:text-sm font-semibold tabular-nums font-mono transition-all duration-200 ${
                          isCellHighlighted
                            ? 'bg-amber-400 text-slate-950 font-bold scale-110 shadow-lg shadow-amber-500/50 z-20 ring-2 ring-amber-300'
                            : isKeyNumber
                            ? 'bg-amber-500/25 text-amber-200 border border-amber-400/60 font-bold'
                            : isSelected
                            ? 'bg-cyan-500/15 text-cyan-100 hover:bg-cyan-500/25'
                            : 'bg-slate-900/60 text-slate-300 hover:bg-slate-800/80 hover:text-white'
                        }`}
                        title={isKeyNumber ? `Осы бағанның кілт саны: ${num}` : undefined}
                      >
                        {num}
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Interactive Button: «Менің саным осында» */}
              <div className="p-2.5 border-t border-slate-800/70 bg-slate-950/40">
                <button
                  type="button"
                  onClick={() => {
                    onToggleColumn(column.id);
                    soundManager.playSelect(isSelected ? 380 : 540);
                  }}
                  className={`w-full py-2.5 px-2.5 rounded-xl font-medium text-xs sm:text-sm flex items-center justify-center gap-1.5 transition-all cursor-pointer whitespace-nowrap ${
                    isSelected
                      ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-slate-950 font-bold shadow-lg shadow-cyan-500/30'
                      : 'bg-slate-900 hover:bg-purple-900/40 text-slate-300 hover:text-white border border-slate-700/60 hover:border-purple-500/40'
                  }`}
                  aria-pressed={isSelected}
                  aria-label={`${column.title}: Менің саным осында`}
                >
                  <div
                    className={`w-4 h-4 rounded flex items-center justify-center shrink-0 transition-colors ${
                      isSelected
                        ? 'bg-slate-950 text-cyan-300'
                        : 'border border-slate-600'
                    }`}
                  >
                    {isSelected && <Check className="w-3 h-3 stroke-[3]" />}
                  </div>
                  <span>Менің саным осында</span>
                </button>
              </div>

              {/* Bottom Hidden Key Indicator */}
              <div
                className={`py-2 px-3 text-center border-t transition-all duration-500 ${
                  isSecretRevealed
                    ? isSelected
                      ? 'bg-amber-500/20 border-amber-500/40 text-amber-300 magic-glow-gold'
                      : 'bg-purple-950/40 border-purple-800/40 text-purple-300'
                    : 'bg-slate-950/80 border-slate-900 text-slate-600'
                }`}
              >
                {isSecretRevealed ? (
                  <div className="flex items-center justify-center gap-1.5">
                    <KeyRound className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                    <span className="text-xs font-semibold font-mono">
                      Кілт: <strong className="text-sm font-bold text-amber-300">{column.key}</strong>
                    </span>
                    <span className="text-[10px] text-slate-400 font-mono">
                      (2^{column.powerOfTwo})
                    </span>
                  </div>
                ) : (
                  <div className="flex items-center justify-center gap-1.5 text-slate-500 text-xs">
                    <Lock className="w-3 h-3 opacity-60 shrink-0" />
                    <span className="text-[11px] tracking-wide">Құпия кілт</span>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
