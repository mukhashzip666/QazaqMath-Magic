/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Header, ActiveTab } from './components/Header';
import { SecretExplanationCard } from './components/SecretExplanationCard';
import { VirtualMagicianChat, ChatMessage } from './components/VirtualMagicianChat';
import { NumberTrainer } from './components/NumberTrainer';
import { RulesModal } from './components/RulesModal';
import { TheorySection } from './components/TheorySection';
import { QuizSection } from './components/QuizSection';
import { ProjectPassportSection } from './components/ProjectPassportSection';
import {
  MAGIC_COLUMNS,
  GameRangeMode,
  calculateGuessedNumber,
  getColumnIdsForNumber,
  getMathFormula,
  getMaxNumberForMode,
} from './utils/magicTable';
import { askMagicianAI } from './utils/magicianBrain';
import { soundManager } from './utils/soundEffects';
import {
  Sparkles,
  RotateCcw,
  Check,
  Bot,
  BookOpen,
  Trophy,
  GraduationCap,
  Wand2,
  ArrowLeft,
  Layers,
} from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState<ActiveTab>('table');
  const [mode, setMode] = useState<GameRangeMode>('1-31');
  const [selectedColumnIds, setSelectedColumnIds] = useState<number[]>([]);
  const [guessedNumber, setGuessedNumber] = useState<number | null>(null);
  const [isSecretRevealed, setIsSecretRevealed] = useState<boolean>(false);
  const [isMuted, setIsMuted] = useState<boolean>(false);
  const [showTrainer, setShowTrainer] = useState<boolean>(false);
  const [showRules, setShowRules] = useState<boolean>(false);
  const [isGenerating, setIsGenerating] = useState<boolean>(false);

  // Initial Magician Chat Greeting in Kazakh
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'init-1',
      sender: 'magician',
      text: 'Сәлем, қымбатты досым! 🎩✨ Мен — математика сиқыршысымын.\n\n«Сиқырлы кестеден» кез келген бір санды ойлап, ол кездесетін бағандарды белгіле. Ал осы бетте мен саған фокустың математикалық құпиясын түсіндіріп, кез келген сұрағыңа жауап беремін!',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    },
  ]);

  const handleToggleMute = () => {
    const nextMuted = !isMuted;
    setIsMuted(nextMuted);
    soundManager.isMuted = nextMuted;
  };

  const handleChangeMode = (newMode: GameRangeMode) => {
    setMode(newMode);
    setSelectedColumnIds([]);
    setGuessedNumber(null);
    const maxNum = getMaxNumberForMode(newMode);
    const now = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    setMessages((prev) => [
      ...prev,
      {
        id: `mode-${Date.now()}`,
        sender: 'magician',
        text: `✨ Диапазон өзгертілді: енді 1 мен ${maxNum} аралығындағы сандар зерттеледі!`,
        timestamp: now,
        animateTyping: true,
      },
    ]);
  };

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
    const result = calculateGuessedNumber(selectedColumnIds, mode);
    setGuessedNumber(result);
    soundManager.playMagicReveal();

    const now = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const revealMessage: ChatMessage = {
      id: `reveal-${Date.now()}`,
      sender: 'magician',
      text: `Абракадабра! ✨ Мен сенің ойыңды оқыдым.\nСен ${result} санын ойладың!\n\nБұл фокустың қалай жұмыс істейтінін білгің келе ме?`,
      quickAction: {
        type: 'reveal_secret',
        label: 'Иә, құпиясын аш! 🔓',
      },
      timestamp: now,
      animateTyping: true,
    };
    setMessages((prev) => [...prev, revealMessage]);
  };

  const handleRevealSecret = () => {
    setIsSecretRevealed(true);
    const calculated = guessedNumber ?? calculateGuessedNumber(selectedColumnIds, mode);
    const formulaInfo = getMathFormula(selectedColumnIds, mode);
    const now = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    const explanationMessage: ChatMessage = {
      id: `secret-${Date.now()}`,
      sender: 'magician',
      text: `Құпия ашылды! 🔓✨\n\nБұл сиқырдың құпиясы 2-нің дәрежелеріне және екілік санау жүйесіне (binary system) негізделген!\n\n${
        calculated > 0
          ? `Сен ойлаған ${calculated} саны дәл осы кілттердің қосындысынан тұрады:\n👉 ${formulaInfo.formulaText}\n(екілік жүйеде: ${formulaInfo.binaryRepresentation}₂)\n\n`
          : ''
      }Компьютерлер де дәл осы принциппен (0 және 1) жұмыс істейді!`,
      timestamp: now,
      animateTyping: true,
    };

    setMessages((prev) => [...prev, explanationMessage]);
  };

  const handleReset = () => {
    setSelectedColumnIds([]);
    setGuessedNumber(null);
    soundManager.playReset();
  };

  const handleApplyTrainerNumber = (num: number) => {
    setActiveTab('table');
    const colIds = getColumnIdsForNumber(num, '1-31');
    setSelectedColumnIds(colIds);
    setGuessedNumber(num);

    const now = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const formulaInfo = getMathFormula(colIds, '1-31');

    setMessages((prev) => [
      ...prev,
      {
        id: `trainer-${Date.now()}`,
        sender: 'magician',
        text: `🎯 Тренажерден ${num} саны таңдалды!\nЕкілік коды: ${formulaInfo.binaryRepresentation}₂\nҚосынды: ${formulaInfo.formulaText}`,
        timestamp: now,
        animateTyping: true,
      },
    ]);
  };

  const handleSendMessage = async (text: string) => {
    const now = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    const userMsg: ChatMessage = {
      id: `user-${Date.now()}`,
      sender: 'user',
      text,
      timestamp: now,
    };
    setMessages((prev) => [...prev, userMsg]);
    setIsGenerating(true);

    try {
      const currentNum = guessedNumber ?? calculateGuessedNumber(selectedColumnIds, mode);
      const formulaInfo = getMathFormula(selectedColumnIds, mode);

      const { reply } = await askMagicianAI(
        text,
        currentNum > 0 ? currentNum : undefined,
        formulaInfo.selectedKeys,
        mode
      );

      setMessages((prev) => [
        ...prev,
        {
          id: `magician-${Date.now()}`,
          sender: 'magician',
          text: reply,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          animateTyping: true,
        },
      ]);
    } finally {
      setIsGenerating(false);
    }
  };

  const formula = getMathFormula(selectedColumnIds, '1-31');

  return (
    <div className="min-h-screen bg-[#FFFFFF] text-[#172B3A] flex flex-col">
      {/* Top Header with all functions & separate page navigation */}
      <Header
        activeTab={activeTab}
        onChangeTab={setActiveTab}
        isMuted={isMuted}
        onToggleMute={handleToggleMute}
        showTrainer={showTrainer}
        onToggleTrainer={() => setShowTrainer(true)}
        onOpenRules={() => setShowRules(true)}
      />

      {/* Main Content Area */}
      <div className="grow w-full max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-4 sm:py-8 flex flex-col justify-center">
        {/* PAGE 1: Main «Сиқырлы кесте» Slide */}
        {activeTab === 'table' && (
          <div className="w-full max-w-5xl mx-auto space-y-4 sm:space-y-6">
            <main className="w-full rounded-2xl bg-gradient-to-br from-[#DCEEFF] via-[#F5F8FA] to-[#DCEEFF]/70 border border-[#E5EAF0] shadow-[0_12px_40px_rgba(23,43,58,0.08)] p-4 sm:p-8 md:p-12 relative overflow-hidden">
              {/* Signature thin red accent line at the top */}
              <div className="absolute top-0 left-0 right-0 h-1 bg-[#D92732]" />

              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8 lg:gap-10 items-center">
                {/* Left Column: Title + Instruction Text + Interactive Result */}
                <div className="lg:col-span-5 flex flex-col justify-between space-y-5 sm:space-y-6">
                  <div>
                    <h1
                      className="text-2xl sm:text-4xl md:text-[42px] font-extrabold tracking-tight text-[#D92732] mb-2 sm:mb-3 leading-tight"
                      style={{ textShadow: '0 1px 0 #FFFFFF, 0 2px 10px rgba(255,255,255,0.8)' }}
                    >
                      Сиқырлы кесте
                    </h1>
                    <div className="w-16 h-[2px] bg-[#D92732] mb-4 sm:mb-6 rounded-full" />

                    <p className="text-base sm:text-xl md:text-[22px] font-bold text-[#172B3A] leading-relaxed">
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
                  <div className="space-y-3.5 sm:space-y-4 pt-1">
                    <div className="text-xs sm:text-sm text-[#657786] font-medium">
                      {selectedColumnIds.length === 0
                        ? 'Бағандарды (1–5) басып белгілеңіз:'
                        : `Таңдалған бағандар: ${[...selectedColumnIds].sort().join(', ')}`}
                    </div>

                    <div className="flex flex-col sm:flex-row flex-wrap items-stretch sm:items-center gap-2.5 sm:gap-3">
                      <button
                        type="button"
                        onClick={handleRevealNumber}
                        disabled={selectedColumnIds.length === 0}
                        className="px-5 sm:px-6 py-3 rounded-xl font-bold text-sm sm:text-base bg-[#D92732] hover:bg-[#b81f29] disabled:bg-[#E5EAF0] disabled:text-[#657786] text-white shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer disabled:cursor-not-allowed"
                      >
                        <Sparkles className="w-4 h-4 shrink-0" />
                        <span>Құпия санды айту</span>
                      </button>

                      <button
                        type="button"
                        onClick={handleReset}
                        className="px-4 py-3 rounded-xl font-semibold text-sm bg-[#FFFFFF] hover:bg-[#F5F8FA] text-[#172B3A] border border-[#E5EAF0] shadow-xs transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                      >
                        <RotateCcw className="w-4 h-4 text-[#657786] shrink-0" />
                        <span>Қайта бастау</span>
                      </button>
                    </div>

                    {/* Revealed Secret Number Card */}
                    {guessedNumber !== null && (
                      <div className="p-4 sm:p-5 rounded-2xl bg-[#FFFFFF] border-2 border-[#4A9FE8] shadow-lg transition-all space-y-3">
                        <div className="text-xs font-bold uppercase tracking-wider text-[#657786]">
                          Сіз ойлаған құпия сан:
                        </div>
                        <div className="flex items-baseline justify-between gap-4">
                          <span className="text-3xl sm:text-5xl font-extrabold text-[#D92732] font-code tabular-nums">
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

                {/* Right Column: The Exact 5-Column Table */}
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
                              className={`py-2 sm:py-3 text-center font-extrabold text-sm sm:text-lg border-b-2 transition-colors flex items-center justify-center gap-0.5 sm:gap-1 ${
                                isSelected
                                  ? 'bg-[#D92732] text-white border-[#D92732]'
                                  : 'bg-[#0B3B8C] text-white border-[#FFFFFF]'
                              }`}
                            >
                              <span>{col.id}</span>
                              {isSelected && <Check className="w-3.5 h-3.5 sm:w-4 sm:h-4 stroke-[3]" />}
                            </div>

                            {/* Numbers Stacked Vertically (including bottom key without special border/highlight) */}
                            <div className="py-1.5 sm:py-2 px-0.5 sm:px-1 flex flex-col items-center justify-center space-y-0.5 sm:space-y-1">
                              {col.numbers.map((num) => {
                                const isGuessedMatch = guessedNumber === num;
                                return (
                                  <div
                                    key={num}
                                    className={`w-full text-center py-0.5 text-[11px] sm:text-sm font-bold tabular-nums transition-colors ${
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
                              <div
                                className={`w-full text-center py-0.5 text-[11px] sm:text-sm font-bold tabular-nums transition-colors ${
                                  isSelected ? 'text-[#172B3A] font-extrabold' : 'text-[#172B3A]'
                                }`}
                              >
                                {col.key}
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              </div>
            </main>

            {/* Quick Navigation Buttons to Separate Pages */}
            <div className="rounded-2xl bg-[#F5F8FA] border border-[#E5EAF0] p-3.5 sm:p-4 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
              <div className="text-xs sm:text-sm font-bold text-[#172B3A] flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-[#D92732] shrink-0" />
                <span>Қосымша беттер мен барлық функциялар:</span>
              </div>

              <div className="grid grid-cols-2 sm:flex sm:flex-wrap items-center gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setActiveTab('magician');
                    soundManager.playSelect(520);
                  }}
                  className="px-3.5 py-2.5 rounded-xl bg-[#D92732] hover:bg-[#b81f29] text-white text-xs font-bold flex items-center justify-center gap-1.5 shadow-xs transition-all cursor-pointer"
                >
                  <Bot className="w-4 h-4 shrink-0" />
                  <span>ЖИ Сиқыршы & Құпия</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setActiveTab('theory');
                    soundManager.playSelect(520);
                  }}
                  className="px-3.5 py-2.5 rounded-xl bg-[#FFFFFF] hover:bg-[#DCEEFF]/60 text-[#172B3A] border border-[#E5EAF0] text-xs font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer"
                >
                  <BookOpen className="w-4 h-4 text-[#4A9FE8] shrink-0" />
                  <span>Теория зертханасы</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setActiveTab('quiz');
                    soundManager.playSelect(520);
                  }}
                  className="px-3.5 py-2.5 rounded-xl bg-[#FFFFFF] hover:bg-[#DCEEFF]/60 text-[#172B3A] border border-[#E5EAF0] text-xs font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer"
                >
                  <Trophy className="w-4 h-4 text-[#D92732] shrink-0" />
                  <span>Білім тесті (10/10)</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setActiveTab('passport');
                    soundManager.playSelect(520);
                  }}
                  className="px-3.5 py-2.5 rounded-xl bg-[#FFFFFF] hover:bg-[#DCEEFF]/60 text-[#172B3A] border border-[#E5EAF0] text-xs font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer"
                >
                  <GraduationCap className="w-4 h-4 text-[#4A9FE8] shrink-0" />
                  <span>Жоба паспорты</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* PAGE 2: Virtual Magician & Secret Explanation + Range Modes */}
        {activeTab === 'magician' && (
          <div className="space-y-6">
            {/* Top Bar with Back Button & Range Mode Selector */}
            <div className="rounded-2xl bg-[#F5F8FA] p-4 sm:p-5 border border-[#E5EAF0] flex flex-col md:flex-row md:items-center justify-between gap-4 relative overflow-hidden">
              <div className="absolute top-0 left-0 right-0 h-[2px] bg-[#D92732]" />
              <div className="flex flex-wrap items-center gap-3">
                <button
                  type="button"
                  onClick={() => setActiveTab('table')}
                  className="px-3.5 py-2 rounded-xl bg-[#FFFFFF] hover:bg-[#DCEEFF]/60 text-[#172B3A] border border-[#E5EAF0] text-xs font-bold flex items-center gap-1.5 cursor-pointer transition-colors"
                >
                  <ArrowLeft className="w-4 h-4 text-[#D92732]" />
                  <span>Кестеге оралу</span>
                </button>
                <div>
                  <h2 className="text-lg sm:text-xl font-extrabold text-[#172B3A]">
                    Виртуалды Сиқыршы және Фокус Құпиясы
                  </h2>
                  <p className="text-xs text-[#657786]">
                    ЖИ-көмекшімен сөйлесіп, екілік жүйенің қалай жұмыс істейтінін зерттеңіз
                  </p>
                </div>
              </div>

              {/* Range Mode Switcher (1-10, 1-15, 1-31, 1-63) */}
              <div className="flex flex-wrap items-center gap-1.5 bg-[#FFFFFF] p-1.5 rounded-xl border border-[#E5EAF0]">
                <span className="text-xs text-[#657786] font-semibold px-2 flex items-center gap-1">
                  <Layers className="w-3.5 h-3.5 text-[#4A9FE8]" />
                  Диапазон:
                </span>
                {(['1-10', '1-15', '1-31', '1-63'] as GameRangeMode[]).map((m) => (
                  <button
                    key={m}
                    type="button"
                    onClick={() => handleChangeMode(m)}
                    className={`px-2.5 py-1.5 rounded-lg text-xs font-code font-bold transition-all cursor-pointer ${
                      mode === m
                        ? 'bg-[#D92732] text-white shadow-xs'
                        : 'text-[#657786] hover:text-[#172B3A] hover:bg-[#F5F8FA]'
                    }`}
                  >
                    {m}
                  </button>
                ))}
                <button
                  type="button"
                  onClick={() => setShowTrainer(true)}
                  className="px-2.5 py-1.5 rounded-lg text-xs font-bold bg-[#DCEEFF] text-[#172B3A] hover:bg-[#4A9FE8] hover:text-white transition-colors flex items-center gap-1 cursor-pointer ml-1"
                >
                  <Wand2 className="w-3.5 h-3.5" />
                  <span>Тренажер</span>
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
              <div className="lg:col-span-7 space-y-6">
                <SecretExplanationCard
                  selectedColumnIds={selectedColumnIds}
                  guessedNumber={guessedNumber}
                  mode={mode}
                  onToggleColumn={handleToggleColumn}
                />
              </div>

              <div className="lg:col-span-5">
                <VirtualMagicianChat
                  messages={messages}
                  onSendMessage={handleSendMessage}
                  onRevealSecret={handleRevealSecret}
                  isGenerating={isGenerating}
                  isSecretRevealed={isSecretRevealed}
                />
              </div>
            </div>
          </div>
        )}

        {/* PAGE 3: Theory & Interactive Lamp Lab */}
        {activeTab === 'theory' && <TheorySection />}

        {/* PAGE 4: 10-Question Quiz */}
        {activeTab === 'quiz' && <QuizSection />}

        {/* PAGE 5: Project Passport */}
        {activeTab === 'passport' && <ProjectPassportSection />}
      </div>

      {/* Modals */}
      <NumberTrainer
        isOpen={showTrainer}
        onClose={() => setShowTrainer(false)}
        onApplyNumber={handleApplyTrainerNumber}
      />

      <RulesModal isOpen={showRules} onClose={() => setShowRules(false)} />
    </div>
  );
}
