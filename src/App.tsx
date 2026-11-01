/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Header, ActiveTab } from './components/Header';
import { InstructionBanner } from './components/InstructionBanner';
import { MagicTable } from './components/MagicTable';
import { ActionControls } from './components/ActionControls';
import { SecretExplanationCard } from './components/SecretExplanationCard';
import { VirtualMagicianChat, ChatMessage } from './components/VirtualMagicianChat';
import { NumberTrainer } from './components/NumberTrainer';
import { RulesModal } from './components/RulesModal';
import { StarfieldBackground } from './components/StarfieldBackground';
import { MagicRevealBanner } from './components/MagicRevealBanner';
import { TheorySection } from './components/TheorySection';
import { QuizSection } from './components/QuizSection';
import { ProjectPassportSection } from './components/ProjectPassportSection';
import {
  GameRangeMode,
  calculateGuessedNumber,
  getColumnIdsForNumber,
  getMathFormula,
  getMaxNumberForMode,
} from './utils/magicTable';
import { askMagicianAI } from './utils/magicianBrain';
import { soundManager } from './utils/soundEffects';

export default function App() {
  const [activeTab, setActiveTab] = useState<ActiveTab>('game');
  const [mode, setMode] = useState<GameRangeMode>('1-31');
  const [selectedColumnIds, setSelectedColumnIds] = useState<number[]>([]);
  const [guessedNumber, setGuessedNumber] = useState<number | null>(null);
  const [isSecretRevealed, setIsSecretRevealed] = useState<boolean>(false);
  const [isMuted, setIsMuted] = useState<boolean>(false);
  const [showTrainer, setShowTrainer] = useState<boolean>(false);
  const [showRules, setShowRules] = useState<boolean>(false);
  const [highlightedNumber, setHighlightedNumber] = useState<number | null>(null);
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [celebrationCount, setCelebrationCount] = useState<number>(0);

  // Initial Magician Chat Greeting in Kazakh
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'init-1',
      sender: 'magician',
      text: 'Сәлем, қымбатты досым! 🎩✨ Мен — математика сиқыршысымын.\n\nКестенің ішінен кез келген бір санды ойлап, ол кездесетін бағандарды төмендегі «Менің саным осында» түймесімен белгіле. Сосын «Санды білу ✨» батырмасын бас!',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    },
  ]);

  // Toggle audio mute
  const handleToggleMute = () => {
    const nextMuted = !isMuted;
    setIsMuted(nextMuted);
    soundManager.isMuted = nextMuted;
  };

  // Change range mode (1-10, 1-15, 1-31, 1-63)
  const handleChangeMode = (newMode: GameRangeMode) => {
    setMode(newMode);
    setSelectedColumnIds([]);
    setGuessedNumber(null);
    setHighlightedNumber(null);
    const maxNum = getMaxNumberForMode(newMode);
    const now = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    setMessages((prev) => [
      ...prev,
      {
        id: `mode-${Date.now()}`,
        sender: 'magician',
        text: `✨ Диапазон өзгертілді: енді 1 мен ${maxNum} аралығындағы санды ойлап, ол бар бағандарды белгіле!`,
        timestamp: now,
        animateTyping: true,
      },
    ]);
  };

  // Toggle column selection
  const handleToggleColumn = (columnId: number) => {
    setSelectedColumnIds((prev) => {
      const exists = prev.includes(columnId);
      const updated = exists ? prev.filter((id) => id !== columnId) : [...prev, columnId];
      return updated;
    });
    setHighlightedNumber(null);
  };

  // Step 1: «Санды білу ✨»
  const handleRevealNumber = () => {
    const maxNum = getMaxNumberForMode(mode);
    if (selectedColumnIds.length === 0) {
      const now = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      setMessages((prev) => [
        ...prev,
        {
          id: `warn-${Date.now()}`,
          sender: 'magician',
          text: `Сен әлі ешбір бағанды таңдамадың ғой! 🔮\n1 мен ${maxNum} аралығындағы кез келген бір санды есіңе сақтап, ол кездесетін бағандарды төмендегі «Менің саным осында» түймесімен белгіле!`,
          timestamp: now,
          animateTyping: true,
        },
      ]);
      return;
    }

    const calculated = calculateGuessedNumber(selectedColumnIds, mode);
    setGuessedNumber(calculated);
    setCelebrationCount((prev) => prev + 1);

    const now = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    const revealMessage: ChatMessage = {
      id: `reveal-${Date.now()}`,
      sender: 'magician',
      text: `Абракадабра! ✨ Мен сенің ойыңды оқыдым.\nСен ${calculated} санын ойладың!\n\nБұл фокустың қалай жұмыс істейтінін білгің келе ме?`,
      quickAction: {
        type: 'reveal_secret',
        label: 'Иә, құпиясын аш! 🔓',
      },
      timestamp: now,
      animateTyping: true,
    };

    setMessages((prev) => [...prev, revealMessage]);
  };

  // Step 3: «Иә, құпиясын аш! 🔓»
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
      }Компьютерлер де дәл осы принциппен (0 және 1) жұмыс істейді. Әр бағанды белгілеу — 1 бит ақпаратты қосумен тең!\n\nҚосымша сұрақтарың болса, төменде менен сұрап көр!`,
      timestamp: now,
      animateTyping: true,
    };

    setMessages((prev) => [...prev, explanationMessage]);
  };

  // Reset: «Қайта бастау 🔄»
  const handleReset = () => {
    setSelectedColumnIds([]);
    setGuessedNumber(null);
    setHighlightedNumber(null);
    const maxNum = getMaxNumberForMode(mode);
    const now = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    setMessages((prev) => [
      ...prev,
      {
        id: `reset-${Date.now()}`,
        sender: 'magician',
        text: `Жаңа ойын басталды! 🔄 1 мен ${maxNum} аралығында жаңа бір санды ойлап, ол бар бағандарды белгіле!`,
        timestamp: now,
        animateTyping: true,
      },
    ]);
  };

  // Apply number from Trainer
  const handleApplyTrainerNumber = (num: number) => {
    setActiveTab('game');
    if (num > getMaxNumberForMode(mode)) {
      setMode('1-31');
    }
    const targetMode = num > getMaxNumberForMode(mode) ? '1-31' : mode;
    const colIds = getColumnIdsForNumber(num, targetMode);
    setSelectedColumnIds(colIds);
    setGuessedNumber(num);
    setHighlightedNumber(num);
    setCelebrationCount((prev) => prev + 1);

    const now = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const formulaInfo = getMathFormula(colIds, targetMode);

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

  // Send question to Magician (Gemini API with smart local fallback)
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

  return (
    <div className="min-h-screen bg-[#070b14] text-slate-100 flex flex-col relative">
      {/* Animated Mystical Starfield & Celebration Particles */}
      <StarfieldBackground celebrationTrigger={celebrationCount} />

      {/* Header */}
      <Header
        activeTab={activeTab}
        onChangeTab={setActiveTab}
        isMuted={isMuted}
        onToggleMute={handleToggleMute}
        showTrainer={showTrainer}
        onToggleTrainer={() => setShowTrainer(true)}
        onOpenRules={() => setShowRules(true)}
      />

      {/* Main Container */}
      <main className="grow max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 w-full relative z-10">
        {activeTab === 'game' && (
          <>
            {/* Instruction Banner + Mode Switcher (1-10, 1-15, 1-31, 1-63) */}
            <InstructionBanner mode={mode} onChangeMode={handleChangeMode} />

            {/* 2-Zone Workspace Split: Left (Stage & Controls) + Right (Virtual Magician Chat) */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
              {/* Left Zone: Crystal Reveal Banner + Magic Table + Controls + Secret Card */}
              <section className="lg:col-span-8 flex flex-col">
                <MagicRevealBanner
                  guessedNumber={guessedNumber}
                  selectedColumnIds={selectedColumnIds}
                  mode={mode}
                  isSecretRevealed={isSecretRevealed}
                  onRevealSecret={handleRevealSecret}
                  onReset={handleReset}
                />

                <MagicTable
                  selectedColumnIds={selectedColumnIds}
                  onToggleColumn={handleToggleColumn}
                  isSecretRevealed={isSecretRevealed}
                  highlightedNumber={highlightedNumber}
                  mode={mode}
                />

                <ActionControls
                  onRevealNumber={handleRevealNumber}
                  onReset={handleReset}
                  isSecretRevealed={isSecretRevealed}
                  onToggleSecret={() => setIsSecretRevealed(!isSecretRevealed)}
                  hasSelection={selectedColumnIds.length > 0}
                />

                {isSecretRevealed && (
                  <SecretExplanationCard
                    selectedColumnIds={selectedColumnIds}
                    guessedNumber={guessedNumber}
                    mode={mode}
                  />
                )}
              </section>

              {/* Right Zone: Virtual Magician Chat Assistant */}
              <aside className="lg:col-span-4 sticky top-20">
                <VirtualMagicianChat
                  messages={messages}
                  onSendMessage={handleSendMessage}
                  onRevealSecret={handleRevealSecret}
                  isGenerating={isGenerating}
                  isSecretRevealed={isSecretRevealed}
                />
              </aside>
            </div>
          </>
        )}

        {activeTab === 'theory' && <TheorySection />}

        {activeTab === 'quiz' && <QuizSection />}

        {activeTab === 'passport' && <ProjectPassportSection />}
      </main>

      {/* Modals */}
      <NumberTrainer
        isOpen={showTrainer}
        onClose={() => setShowTrainer(false)}
        onApplyNumber={handleApplyTrainerNumber}
      />

      <RulesModal isOpen={showRules} onClose={() => setShowRules(false)} />

      {/* Footer */}
      <footer className="mt-auto border-t border-slate-900 bg-[#060911]/90 py-5 text-center text-xs text-slate-500 relative z-10">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <span>«Сиқырлы кесте» — Интерактивті математикалық ғылыми жоба (10/10)</span>
          <span className="text-slate-600 font-mono">Екілік санау жүйесі · 2⁰ + 2¹ + 2² + 2³ + 2⁴</span>
        </div>
      </footer>
    </div>
  );
}
