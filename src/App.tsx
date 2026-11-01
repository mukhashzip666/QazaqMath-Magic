/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { MAGIC_COLUMNS, calculateGuessedNumber, getMathFormula } from './utils/magicTable';
import { soundManager } from './utils/soundEffects';
import { Sparkles, RotateCcw, Eye, EyeOff, Check } from 'lucide-react';

export default function App() {
  const [selectedColumnIds, setSelectedColumnIds] = useState<number[]>([]);
  const [guessedNumber, setGuessedNumber] = useState<number | null>(null);
  const [showBottomKeys, setShowBottomKeys] = useState<boolean>(true);

  const handleToggleColumn = (columnId: number) => {
    setSelectedColumnIds((prev) => {
      const exists = prev.includes(columnId);
      const updated = exists ? prev.filter((id) => id !== columnId) : [...prev, columnId];
      return updated;
    });
    setGuessedNumber(null);
    soundManager.playSelect(480);
  };

  const handleRevealNumber = () => {
    if (selectedColumnIds.length === 0) return;
    const result = calculateGuessedNumber(selectedColumnIds);
    setGuessedNumber(result);
    soundManager.playMagicReveal();
  };

  const handleReset = () => {
    setSelectedColumnIds([]);
    setGuessedNumber(null);
    soundManager.playReset();
  };

  const formula = getMathFormula(selectedColumnIds);

  return (
    <div className="min-h-screen bg-[#FFFFFF] text-[#172B3A] flex items-center justify-center p-4 sm:p-8">
      {/* Main Slide Container matching the photo composition */}
      <main className="w-full max-w-5xl rounded-2xl bg-gradient-to-br from-[#DCEEFF] via-[#F5F8FA] to-[#DCEEFF]/70 border border-[#E5EAF0] shadow-[0_12px_40px_rgba(23,43,58,0.08)] p-6 sm:p-10 md:p-12 relative overflow-hidden">
        {/* Signature thin red accent line at the top */}
        <div className="absolute top-0 left-0 right-0 h-1 bg-[#D92732]" />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-center">
          {/* Left Column: Title + Instruction Text + Interactive Result */}
          <div className="lg:col-span-5 flex flex-col justify-between space-y-6">
            <div>
              {/* Title: «Сиқырлы кесте» in signature Red (#D92732) */}
              <h1
                className="text-3xl sm:text-4xl md:text-[42px] font-extrabold tracking-tight text-[#D92732] mb-3 leading-tight"
                style={{ textShadow: '0 1px 0 #FFFFFF, 0 2px 10px rgba(255,255,255,0.8)' }}
              >
                Сиқырлы кесте
              </h1>
              {/* Thin red line accent */}
              <div className="w-16 h-[2px] bg-[#D92732] mb-6 rounded-full" />

              {/* Exact text from the photo */}
              <p className="text-lg sm:text-xl md:text-[22px] font-bold text-[#172B3A] leading-relaxed">
                Кестенің ішінен бір
                <br className="hidden sm:inline" /> санды таңдап,
                <br className="hidden sm:inline" /> есіңізге сақтаңыз.
                <br className="hidden sm:inline" /> Кестенің қай
                <br className="hidden sm:inline" /> бағанда осы сан бар
                <br className="hidden sm:inline" /> екенін айтыңыз, мен
                <br className="hidden sm:inline" /> сізге құпия санды
                <br className="hidden sm:inline" /> айтам.
              </p>
            </div>

            {/* Interactive Controls & Secret Number Output */}
            <div className="space-y-4 pt-2">
              <div className="text-xs sm:text-sm text-[#657786] font-medium">
                {selectedColumnIds.length === 0
                  ? 'Оң жақтағы бағандарды (1–5) басып белгілеңіз:'
                  : `Таңдалған бағандар: ${[...selectedColumnIds].sort().join(', ')}`}
              </div>

              <div className="flex flex-wrap items-center gap-3">
                <button
                  type="button"
                  onClick={handleRevealNumber}
                  disabled={selectedColumnIds.length === 0}
                  className="px-6 py-3 rounded-xl font-bold text-sm sm:text-base bg-[#D92732] hover:bg-[#b81f29] disabled:bg-[#E5EAF0] disabled:text-[#657786] text-white shadow-md hover:shadow-lg transition-all flex items-center gap-2 cursor-pointer disabled:cursor-not-allowed"
                >
                  <Sparkles className="w-4 h-4" />
                  <span>Құпия санды айту</span>
                </button>

                <button
                  type="button"
                  onClick={handleReset}
                  className="px-4 py-3 rounded-xl font-semibold text-sm bg-[#FFFFFF] hover:bg-[#F5F8FA] text-[#172B3A] border border-[#E5EAF0] shadow-xs transition-all flex items-center gap-1.5 cursor-pointer"
                >
                  <RotateCcw className="w-4 h-4 text-[#657786]" />
                  <span>Қайта бастау</span>
                </button>

                <button
                  type="button"
                  onClick={() => setShowBottomKeys(!showBottomKeys)}
                  className="p-3 rounded-xl bg-[#FFFFFF] hover:bg-[#F5F8FA] text-[#657786] hover:text-[#172B3A] border border-[#E5EAF0] transition-colors cursor-pointer"
                  title={showBottomKeys ? 'Төменгі кілт сандарды жасыру' : 'Төменгі кілт сандарды көрсету'}
                >
                  {showBottomKeys ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                </button>
              </div>

              {/* Revealed Secret Number Card */}
              {guessedNumber !== null && (
                <div className="p-5 rounded-2xl bg-[#FFFFFF] border-2 border-[#4A9FE8] shadow-lg transition-all">
                  <div className="text-xs font-bold uppercase tracking-wider text-[#657786] mb-1">
                    Сіз ойлаған құпия сан:
                  </div>
                  <div className="flex items-baseline justify-between gap-4">
                    <span className="text-4xl sm:text-5xl font-extrabold text-[#D92732] font-code tabular-nums">
                      {guessedNumber}
                    </span>
                    <span className="text-xs sm:text-sm font-code text-[#657786]">
                      {formula.formulaText}
                    </span>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Right Column: The Exact 5-Column Table from the Photo */}
          <div className="lg:col-span-7">
            <div className="bg-[#FFFFFF] rounded-xl border-2 border-[#E5EAF0] shadow-md overflow-hidden">
              <div className="grid grid-cols-5 divide-x divide-[#CBD5E1]">
                {MAGIC_COLUMNS.map((col) => {
                  const isSelected = selectedColumnIds.includes(col.id);

                  return (
                    <div
                      key={col.id}
                      onClick={() => handleToggleColumn(col.id)}
                      role="button"
                      tabIndex={0}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' || e.key === ' ') {
                          e.preventDefault();
                          handleToggleColumn(col.id);
                        }
                      }}
                      aria-pressed={isSelected}
                      aria-label={`${col.id}-баған`}
                      className={`flex flex-col cursor-pointer select-none transition-colors ${
                        isSelected
                          ? 'bg-[#DCEEFF]/70 ring-2 ring-inset ring-[#4A9FE8]'
                          : 'bg-[#F5F8FA] hover:bg-[#DCEEFF]/30'
                      }`}
                    >
                      {/* Top Header Cell: 1, 2, 3, 4, 5 */}
                      <div
                        className={`py-2.5 sm:py-3 text-center font-extrabold text-base sm:text-lg border-b-2 transition-colors flex items-center justify-center gap-1 ${
                          isSelected
                            ? 'bg-[#D92732] text-white border-[#D92732]'
                            : 'bg-[#0B3B8C] text-white border-[#FFFFFF]'
                        }`}
                      >
                        <span>{col.id}</span>
                        {isSelected && <Check className="w-4 h-4 stroke-[3]" />}
                      </div>

                      {/* 16 Numbers Stacked Vertically (1 per row, matching photo) */}
                      <div className="py-2 px-1 flex flex-col items-center justify-center space-y-0.5 sm:space-y-1">
                        {col.numbers.map((num) => {
                          const isGuessedMatch = guessedNumber === num;
                          return (
                            <div
                              key={num}
                              className={`w-full text-center py-0.5 text-xs sm:text-sm font-bold tabular-nums transition-colors ${
                                isGuessedMatch
                                  ? 'bg-[#D92732] text-white rounded font-extrabold'
                                  : isSelected
                                  ? 'text-[#172B3A] font-extrabold'
                                  : 'text-[#172B3A]'
                              }`}
                            >
                              {num}
                            </div>
                          );
                        })}
                      </div>

                      {/* Bottom Row: 16, 8, 4, 2, 1 (separated by horizontal border) */}
                      <div
                        className={`py-2.5 sm:py-3 text-center border-t border-[#CBD5E1] text-xs sm:text-sm font-semibold tabular-nums transition-colors ${
                          isSelected
                            ? 'bg-[#DCEEFF] text-[#D92732] font-extrabold'
                            : 'bg-[#F5F8FA] text-[#657786]'
                        }`}
                      >
                        {showBottomKeys ? col.key : '•'}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
