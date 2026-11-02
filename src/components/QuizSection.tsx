import React, { useState } from 'react';
import { Trophy, CheckCircle2, XCircle, ArrowRight, RotateCcw, Award } from 'lucide-react';
import { QUIZ_QUESTIONS } from '../utils/magicTable';
import { soundManager } from '../utils/soundEffects';

export const QuizSection: React.FC = () => {
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [score, setScore] = useState<number>(0);
  const [answers, setAnswers] = useState<boolean[]>([]);
  const [isFinished, setIsFinished] = useState<boolean>(false);

  const currentQ = QUIZ_QUESTIONS[currentIndex];

  const handleSelectOption = (optIndex: number) => {
    if (selectedOption !== null) return;
    setSelectedOption(optIndex);
    const isCorrect = optIndex === currentQ.correctIndex;
    if (isCorrect) {
      setScore((prev) => prev + 1);
      soundManager.playMagicReveal();
    } else {
      soundManager.playReset();
    }
    setAnswers((prev) => [...prev, isCorrect]);
  };

  const handleNext = () => {
    if (currentIndex + 1 < QUIZ_QUESTIONS.length) {
      setCurrentIndex((prev) => prev + 1);
      setSelectedOption(null);
      soundManager.playSelect(520);
    } else {
      setIsFinished(true);
      soundManager.playSecretUnlock();
    }
  };

  const handleRestart = () => {
    setCurrentIndex(0);
    setSelectedOption(null);
    setScore(0);
    setAnswers([]);
    setIsFinished(false);
    soundManager.playReset();
  };

  const getRankTitle = (s: number) => {
    if (s === 10) return '🏆 Математика Грандмастері (10/10 — Жоғары балл!)';
    if (s >= 8) return '✨ Екілік Жүйе Шебері (Өте жақсы!)';
    if (s >= 5) return '🔮 Жас Сиқыршы (Жақсы нәтиже)';
    return '📘 Ізденуші Шәкірт (Тағы бір рет қайталап көріңіз)';
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header Banner */}
      <div className="rounded-2xl bg-[#F5F8FA] p-6 border border-[#E5EAF0] flex flex-col sm:flex-row sm:items-center justify-between gap-4 relative overflow-hidden">
        <div className="absolute top-0 left-0 right-0 h-[2px] bg-[#D92732]" />
        <div>
          <div className="flex items-center gap-2 text-[#D92732] text-xs font-bold uppercase tracking-wider mb-1">
            <Trophy className="w-4 h-4" />
            <span>Білімді тексеру · 10 сұрақ</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-[#172B3A]">
            «1-ден 10-ға дейін» Интерактивті Викторина
          </h2>
          <p className="text-xs sm:text-sm text-[#657786] mt-1">
            Екілік санау жүйесі мен «Сиқырлы кестенің» құпиясын қаншалықты меңгергеніңізді 10 балдық шкаламен тексеріңіз!
          </p>
        </div>

        <div className="px-5 py-3 rounded-xl bg-[#FFFFFF] border border-[#E5EAF0] text-center shrink-0 shadow-xs">
          <span className="text-[11px] text-[#657786] font-medium block">Ұпайыңыз</span>
          <span className="text-2xl font-extrabold font-code text-[#D92732] tabular-nums">
            {score} / {QUIZ_QUESTIONS.length}
          </span>
        </div>
      </div>

      {!isFinished ? (
        <div className="rounded-2xl bg-[#FFFFFF] p-6 sm:p-8 border border-[#E5EAF0] shadow-[0_8px_30px_rgba(23,43,58,0.05)]">
          {/* Progress Bar (1 to 10) */}
          <div className="mb-6">
            <div className="flex items-center justify-between text-xs text-[#657786] mb-2 font-code">
              <span>Сұрақ {currentIndex + 1} / {QUIZ_QUESTIONS.length}</span>
              <span>Прогресс: {Math.round(((currentIndex + 1) / QUIZ_QUESTIONS.length) * 100)}%</span>
            </div>
            <div className="grid grid-cols-10 gap-1.5">
              {QUIZ_QUESTIONS.map((q, idx) => {
                const answered = idx < answers.length;
                const isRight = answers[idx];
                const isCurrent = idx === currentIndex;
                return (
                  <div
                    key={q.id}
                    className={`h-2 rounded-full transition-all ${
                      answered
                        ? isRight
                          ? 'bg-[#4A9FE8]'
                          : 'bg-[#D92732]'
                        : isCurrent
                        ? 'bg-[#172B3A]'
                        : 'bg-[#E5EAF0]'
                    }`}
                  />
                );
              })}
            </div>
          </div>

          {/* Question Text */}
          <div className="mb-6">
            <span className="text-xs font-code font-bold text-[#4A9FE8] block mb-1">
              #{currentQ.id}-сұрақ
            </span>
            <h3 className="text-lg sm:text-xl font-extrabold text-[#172B3A] leading-snug">
              {currentQ.question}
            </h3>
          </div>

          {/* Options */}
          <div className="space-y-3 mb-6">
            {currentQ.options.map((opt, idx) => {
              const isSelected = selectedOption === idx;
              const isCorrect = idx === currentQ.correctIndex;
              const showFeedback = selectedOption !== null;

              let btnStyle =
                'bg-[#F5F8FA] border-[#E5EAF0] text-[#172B3A] hover:border-[#4A9FE8] hover:bg-[#DCEEFF]/40';
              if (showFeedback) {
                if (isCorrect) {
                  btnStyle = 'bg-[#DCEEFF] border-[#4A9FE8] text-[#172B3A] font-bold';
                } else if (isSelected && !isCorrect) {
                  btnStyle = 'bg-[#D92732]/10 border-[#D92732] text-[#D92732] font-semibold';
                } else {
                  btnStyle = 'bg-[#F5F8FA]/60 border-[#E5EAF0] text-[#657786]';
                }
              }

              return (
                <button
                  key={idx}
                  type="button"
                  disabled={showFeedback}
                  onClick={() => handleSelectOption(idx)}
                  className={`w-full p-4 rounded-xl border text-left text-sm sm:text-base flex items-center justify-between gap-3 transition-all cursor-pointer disabled:cursor-default ${btnStyle}`}
                >
                  <div className="flex items-center gap-3">
                    <span className="w-7 h-7 rounded-lg bg-[#FFFFFF] border border-[#E5EAF0] flex items-center justify-center text-xs font-code font-bold text-[#172B3A] shrink-0">
                      {String.fromCharCode(65 + idx)}
                    </span>
                    <span>{opt}</span>
                  </div>

                  {showFeedback && isCorrect && (
                    <CheckCircle2 className="w-5 h-5 text-[#4A9FE8] shrink-0" />
                  )}
                  {showFeedback && isSelected && !isCorrect && (
                    <XCircle className="w-5 h-5 text-[#D92732] shrink-0" />
                  )}
                </button>
              );
            })}
          </div>

          {/* Explanation Box & Next Button */}
          {selectedOption !== null && (
            <div className="p-4 rounded-xl bg-[#F5F8FA] border border-[#E5EAF0] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="text-xs sm:text-sm text-[#172B3A] leading-relaxed">
                <strong className={`block mb-0.5 ${selectedOption === currentQ.correctIndex ? 'text-[#4A9FE8]' : 'text-[#D92732]'}`}>
                  {selectedOption === currentQ.correctIndex ? '✓ Дұрыс жауап!' : '✗ Қателестіңіз. Дұрыс түсіндірмесі:'}
                </strong>
                <span className="text-[#657786]">{currentQ.explanation}</span>
              </div>

              <button
                type="button"
                onClick={handleNext}
                className="px-5 py-2.5 rounded-xl bg-[#D92732] hover:bg-[#b81f29] text-white font-bold text-xs sm:text-sm flex items-center justify-center gap-2 shrink-0 cursor-pointer transition-colors"
              >
                <span>
                  {currentIndex + 1 < QUIZ_QUESTIONS.length ? 'Келесі сұрақ' : 'Нәтижені көру'}
                </span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
      ) : (
        /* Final Results Screen */
        <div className="rounded-2xl bg-[#FFFFFF] p-8 border border-[#E5EAF0] text-center shadow-lg space-y-6 relative overflow-hidden">
          <div className="absolute top-0 left-0 right-0 h-1 bg-[#D92732]" />
          <div className="w-20 h-20 rounded-2xl bg-[#DCEEFF] border border-[#4A9FE8]/40 mx-auto flex items-center justify-center">
            <Award className="w-10 h-10 text-[#D92732]" />
          </div>

          <div>
            <span className="text-xs uppercase tracking-widest text-[#657786] font-bold">
              Викторина аяқталды
            </span>
            <h3 className="text-3xl sm:text-4xl font-extrabold text-[#172B3A] mt-1">
              Сіздің бағаңыз: <span className="text-[#D92732]">{score} / 10</span> балл!
            </h3>
            <p className="text-base sm:text-lg font-bold text-[#4A9FE8] mt-2">
              {getRankTitle(score)}
            </p>
          </div>

          <div className="grid grid-cols-5 sm:grid-cols-10 gap-2 max-w-lg mx-auto">
            {answers.map((ok, i) => (
              <div
                key={i}
                className={`p-2 rounded-xl border font-code text-xs font-bold ${
                  ok
                    ? 'bg-[#DCEEFF] border-[#4A9FE8] text-[#172B3A]'
                    : 'bg-[#D92732]/10 border-[#D92732] text-[#D92732]'
                }`}
              >
                #{i + 1} {ok ? '✓' : '✗'}
              </div>
            ))}
          </div>

          <div className="pt-2">
            <button
              type="button"
              onClick={handleRestart}
              className="px-6 py-3 rounded-xl bg-[#D92732] hover:bg-[#b81f29] text-white font-bold text-sm inline-flex items-center gap-2 cursor-pointer shadow-md"
            >
              <RotateCcw className="w-4 h-4" />
              <span>Тестті қайта тапсыру</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
