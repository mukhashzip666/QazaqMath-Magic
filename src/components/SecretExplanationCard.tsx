import React from 'react';
import { Lightbulb, Binary, Cpu, Calculator } from 'lucide-react';
import { GameRangeMode, getColumnsForMode, getMathFormula } from '../utils/magicTable';

interface SecretExplanationCardProps {
  selectedColumnIds: number[];
  guessedNumber: number | null;
  mode?: GameRangeMode;
  onToggleColumn?: (colId: number) => void;
}

export const SecretExplanationCard: React.FC<SecretExplanationCardProps> = ({
  selectedColumnIds,
  guessedNumber,
  mode = '1-31',
  onToggleColumn,
}) => {
  const columns = getColumnsForMode(mode);
  const formulaInfo = getMathFormula(selectedColumnIds, mode);
  const displayNum = guessedNumber !== null ? guessedNumber : formulaInfo.total;

  const gridColsClass =
    columns.length === 4
      ? 'grid-cols-2 sm:grid-cols-4'
      : columns.length === 6
      ? 'grid-cols-2 sm:grid-cols-3 md:grid-cols-6'
      : 'grid-cols-2 sm:grid-cols-5';

  return (
    <div className="rounded-2xl bg-[#FFFFFF] p-5 sm:p-6 border border-[#E5EAF0] shadow-[0_8px_24px_rgba(23,43,58,0.05)] relative overflow-hidden">
      {/* Signature thin red line */}
      <div className="absolute top-0 left-0 right-0 h-[2px] bg-[#D92732]" />

      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 pb-4 border-b border-[#E5EAF0] mb-5">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-xl bg-[#DCEEFF] text-[#4A9FE8]">
            <Lightbulb className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base sm:text-lg font-extrabold text-[#172B3A]">
              Фокустың математикалық құпиясы
            </h3>
            <p className="text-xs text-[#657786]">
              Екілік санау жүйесі (Binary code) және 2-нің дәрежелері
            </p>
          </div>
        </div>

        {displayNum > 0 && (
          <div className="px-3.5 py-1.5 rounded-xl bg-[#DCEEFF] border border-[#4A9FE8]/40 text-[#172B3A] text-sm font-code flex items-center gap-2 self-start md:self-auto">
            <span>Таңдалған сан:</span>
            <strong className="text-base font-extrabold text-[#D92732] tabular-nums">{displayNum}</strong>
          </div>
        )}
      </div>

      {/* Visual Bits Breakdown */}
      <div className="mb-6">
        <div className="text-xs font-bold uppercase tracking-wider text-[#657786] mb-2.5 flex items-center gap-1.5">
          <Binary className="w-4 h-4 text-[#4A9FE8]" />
          <span>Екілік разрядтар мен салмақтар кестесі:</span>
        </div>

        <div className={`grid ${gridColsClass} gap-2 sm:gap-3 text-center`}>
          {columns.map((col) => {
            const isBitActive = selectedColumnIds.includes(col.id);

            return (
              <div
                key={col.id}
                onClick={() => onToggleColumn && onToggleColumn(col.id)}
                role={onToggleColumn ? 'button' : undefined}
                tabIndex={onToggleColumn ? 0 : undefined}
                className={`p-3 rounded-xl border transition-all ${
                  onToggleColumn ? 'cursor-pointer select-none hover:border-[#4A9FE8]' : ''
                } ${
                  isBitActive
                    ? 'bg-[#DCEEFF]/60 border-[#4A9FE8] text-[#172B3A] shadow-xs'
                    : 'bg-[#F5F8FA] border-[#E5EAF0] text-[#657786]'
                }`}
              >
                <div className="text-[11px] font-semibold">
                  {col.title}
                </div>
                <div className="text-base sm:text-xl font-extrabold font-code my-0.5 text-[#172B3A]">
                  {col.key}
                </div>
                <div className="text-[10px] text-[#657786] font-code">
                  2^{col.powerOfTwo}
                </div>
                <div
                  className={`mt-2 py-0.5 px-1.5 rounded text-xs font-bold font-code ${
                    isBitActive
                      ? 'bg-[#D92732] text-white'
                      : 'bg-[#E5EAF0] text-[#657786]'
                  }`}
                >
                  {isBitActive ? '1 (бар)' : '0 (жоқ)'}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Formula Box */}
      {displayNum > 0 ? (
        <div className="p-4 rounded-xl bg-[#F5F8FA] border border-[#E5EAF0] mb-5">
          <div className="flex items-center gap-2 text-xs text-[#657786] mb-1 font-medium">
            <Calculator className="w-3.5 h-3.5 text-[#D92732]" />
            <span>Математикалық қосынды:</span>
          </div>
          <div className="text-lg sm:text-2xl font-extrabold font-code text-[#172B3A] tracking-wide">
            {formulaInfo.formulaText}
          </div>
          <div className="text-xs text-[#657786] mt-2 font-code flex flex-wrap items-center gap-x-3 gap-y-1">
            <span>Дәрежелер түрінде: {formulaInfo.powersExplanation}</span>
            <span>·</span>
            <span>Екілік коды: <span className="text-[#D92732] font-bold">{formulaInfo.binaryRepresentation}₂</span></span>
          </div>
        </div>
      ) : (
        <div className="p-4 rounded-xl bg-[#F5F8FA] border border-[#E5EAF0] mb-5 text-sm text-[#657786]">
          Кестеден саныңыз бар бағандарды таңдаңыз, сонда дәл осы жерде қосынды формуласы пайда болады!
        </div>
      )}

      {/* Core Educational Text in Kazakh */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs sm:text-sm text-[#172B3A] leading-relaxed bg-[#F5F8FA] p-4 rounded-xl border border-[#E5EAF0]">
        <div className="space-y-1.5">
          <div className="font-bold text-[#172B3A] flex items-center gap-1.5">
            <Binary className="w-4 h-4 text-[#4A9FE8]" />
            <span>Неге бұл әрқашан мінсіз жұмыс істейді?</span>
          </div>
          <p className="text-[#657786]">
            Кез келген бүтін санды 2-нің дәрежелерінің (<strong className="text-[#172B3A] font-code">{columns.map(c => c.key).join(', ')}</strong>) қосындысы түрінде 
            <strong className="text-[#172B3A]"> бір ғана қайталанбас тәсілмен</strong> жазуға болады.
          </p>
        </div>

        <div className="space-y-1.5">
          <div className="font-bold text-[#172B3A] flex items-center gap-1.5">
            <Cpu className="w-4 h-4 text-[#D92732]" />
            <span>Компьютерлер де осылай жұмыс істейді:</span>
          </div>
          <p className="text-[#657786]">
            Смартфондар мен компьютерлер барлық деректі 0 мен 1 (биттер) түрінде сақтайды. 
            Баған таңдалса — <span className="text-[#D92732] font-code font-bold">1</span>, таңдалмаса — <span className="text-[#172B3A] font-code font-bold">0</span>.
          </p>
        </div>
      </div>
    </div>
  );
};
