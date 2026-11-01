import React from 'react';
import { Lightbulb, Binary, Cpu, Calculator } from 'lucide-react';
import { GameRangeMode, getColumnsForMode, getMathFormula } from '../utils/magicTable';

interface SecretExplanationCardProps {
  selectedColumnIds: number[];
  guessedNumber: number | null;
  mode?: GameRangeMode;
}

export const SecretExplanationCard: React.FC<SecretExplanationCardProps> = ({
  selectedColumnIds,
  guessedNumber,
  mode = '1-31',
}) => {
  const columns = getColumnsForMode(mode);
  const formulaInfo = getMathFormula(selectedColumnIds, mode);
  const displayNum = guessedNumber !== null ? guessedNumber : formulaInfo.total;

  const gridColsClass =
    columns.length === 4
      ? 'grid-cols-2 sm:grid-cols-4'
      : columns.length === 6
      ? 'grid-cols-3 sm:grid-cols-6'
      : 'grid-cols-5';

  return (
    <div className="rounded-2xl glass-panel-elevated p-5 sm:p-6 mb-8 border border-amber-500/30 magic-glow-gold transition-all duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 pb-4 border-b border-slate-700/60 mb-5">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-xl bg-amber-500/20 text-amber-300 border border-amber-500/40">
            <Lightbulb className="w-5 h-5 text-amber-400" />
          </div>
          <div>
            <h3 className="text-base sm:text-lg font-bold text-amber-200">
              Фокустың математикалық құпиясы
            </h3>
            <p className="text-xs text-slate-400">
              Екілік санау жүйесі (Binary code) және 2-нің дәрежелері
            </p>
          </div>
        </div>

        {displayNum > 0 && (
          <div className="px-3.5 py-1.5 rounded-xl bg-cyan-950/80 border border-cyan-500/40 text-cyan-200 text-sm font-mono flex items-center gap-2 self-start md:self-auto">
            <span>Таңдалған сан:</span>
            <strong className="text-base font-bold text-cyan-300 tabular-nums">{displayNum}</strong>
          </div>
        )}
      </div>

      {/* Visual Bits Breakdown */}
      <div className="mb-6">
        <div className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2 flex items-center gap-1.5">
          <Binary className="w-4 h-4 text-cyan-400" />
          <span>Екілік разрядтар мен салмақтар кестесі:</span>
        </div>

        <div className={`grid ${gridColsClass} gap-2 sm:gap-3 text-center`}>
          {columns.map((col) => {
            const isBitActive = selectedColumnIds.includes(col.id);

            return (
              <div
                key={col.id}
                className={`p-2.5 sm:p-3 rounded-xl border transition-all ${
                  isBitActive
                    ? 'bg-cyan-500/20 border-cyan-400 text-white shadow-md shadow-cyan-500/20'
                    : 'bg-slate-900/60 border-slate-800 text-slate-400'
                }`}
              >
                <div className="text-[11px] text-slate-400 font-medium">
                  {col.title}
                </div>
                <div className="text-base sm:text-xl font-bold font-mono my-0.5 text-amber-300">
                  {col.key}
                </div>
                <div className="text-[10px] text-slate-400 font-mono">
                  2^{col.powerOfTwo}
                </div>
                <div
                  className={`mt-2 py-0.5 px-1.5 rounded text-xs font-bold font-mono ${
                    isBitActive
                      ? 'bg-cyan-400 text-slate-950'
                      : 'bg-slate-800 text-slate-500'
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
        <div className="p-4 rounded-xl bg-slate-900/90 border border-cyan-500/30 mb-5">
          <div className="flex items-center gap-2 text-xs text-slate-400 mb-1">
            <Calculator className="w-3.5 h-3.5 text-amber-400" />
            <span>Математикалық қосынды:</span>
          </div>
          <div className="text-lg sm:text-2xl font-bold font-mono text-cyan-300 tracking-wide">
            {formulaInfo.formulaText}
          </div>
          <div className="text-xs text-slate-400 mt-2 font-mono flex flex-wrap items-center gap-x-3 gap-y-1">
            <span>Дәрежелер түрінде: {formulaInfo.powersExplanation}</span>
            <span>·</span>
            <span>Екілік коды: <span className="text-amber-300 font-bold">{formulaInfo.binaryRepresentation}₂</span></span>
          </div>
        </div>
      ) : (
        <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 mb-5 text-sm text-slate-400">
          Кестеден саныңыз бар бағандарды таңдаңыз, сонда дәл осы жерде қосынды формуласы пайда болады!
        </div>
      )}

      {/* Core Educational Text in Kazakh */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs sm:text-sm text-slate-300 leading-relaxed bg-slate-950/40 p-4 rounded-xl border border-slate-800/80">
        <div className="space-y-2">
          <div className="font-semibold text-cyan-300 flex items-center gap-1.5">
            <Binary className="w-4 h-4 text-cyan-400" />
            <span>Неге бұл әрқашан мінсіз жұмыс істейді?</span>
          </div>
          <p>
            Кез келген бүтін санды 2-нің дәрежелерінің (<strong className="text-amber-300 font-mono">{columns.map(c => c.key).join(', ')}</strong>) қосындысы түрінде 
            <strong> бір ғана қайталанбас тәсілмен</strong> жазуға болады. Бұл — сандар теориясының негізгі қасиеті.
          </p>
        </div>

        <div className="space-y-2">
          <div className="font-semibold text-purple-300 flex items-center gap-1.5">
            <Cpu className="w-4 h-4 text-purple-400" />
            <span>Компьютерлер де осылай жұмыс істейді:</span>
          </div>
          <p>
            Смартфондар мен заманауи компьютерлер бүкіл мәтінді, суреттер мен ойындарды дәл осы 0 мен 1 (биттер) түрінде сақтайды. 
            Баған таңдалса — бұл <span className="text-cyan-300 font-mono font-bold">1</span> (сигнал бар), таңдалмаса — <span className="text-slate-400 font-mono font-bold">0</span> (сигнал жоқ).
          </p>
        </div>
      </div>
    </div>
  );
};
