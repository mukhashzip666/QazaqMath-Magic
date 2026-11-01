import React, { useState } from 'react';
import { Trophy, CheckCircle2, XCircle, ArrowRight, RotateCcw, Award, Sparkles } from 'lucide-react';
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
      <div className="rounded-2xl glass-panel-elevated p-6 border border-amber-500/30 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-amber-300 text-xs font-bold uppercase tracking-wider mb-1">
            <Trophy className="w-4 h-4 text-amber-400" />
            <span>Білімді тексеру · 10 сұрақ</span>
          </div>
          <h2 className="font-magic text-2xl sm:text-3xl font-bold text-white">
            «1-ден 10-ға дейін» Интерактивті Викторина
          </h2>
          <p className="text-xs sm:text-sm text-slate-300 mt-1">
            Екілік санау жүйесі мен «Сиқырлы кестенің» құпиясын қаншалықты меңгергеніңізді 10 балдық шкаламен тексеріңіз!
          </p>
        </div>

        <div className="px-4 py-3 rounded-xl bg-slate-900/90 border border-amber-500/40 text-center shrink-0">
          <span className="text-[11px] text-slate-400 block">Ұпайыңыз</span>
          <span className="text-2xl font-extrabold font-mono text-amber-300 tabular-nums">
            {score} / {QUIZ_QUESTIONS.length}
          </span>
        </div>
      </div>

      {!isFinished ? (
        <div className="rounded-2xl glass-panel p-6 sm:p-8 border border-purple-500/30 shadow-2xl">
          {/* Progress Bar (1 to 10) */}
          <div className="mb-6">
            <div className="flex items-center justify-between text-xs text-slate-400 mb-2 font-mono">
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
                          ? 'bg-emerald-400'
                          : 'bg-rose-500'
                        : isCurrent
                        ? 'bg-cyan-400'
                        : 'bg-slate-800'
                    }`}
                  />
                );
              })}
            </div>
          </div>

          {/* Question Text */}
          <div className="mb-6">
            <span className="text-xs font-mono text-cyan-400 block mb-1">
              #{currentQ.id}-сұрақ
            </span>
            <h3 className="text-lg sm:text-xl font-bold text-white leading-snug">
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
                'bg-slate-900/80 border-slate-800 text-slate-200 hover:border-cyan-500/50 hover:bg-slate-800/80';
              if (showFeedback) {
                if (isCorrect) {
                  btnStyle = 'bg-emerald-950/60 border-emerald-400 text-emerald-100 font-semibold';
                } else if (isSelected && !isCorrect) {
                  btnStyle = 'bg-rose-950/60 border-rose-500 text-rose-200';
                } else {
                  btnStyle = 'bg-slate-900/40 border-slate-800/60 text-slate-500';
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
                    <span className="w-7 h-7 rounded-lg bg-slate-950/80 border border-slate-700 flex items-center justify-center text-xs font-mono font-bold text-cyan-300 shrink-0">
                      {String.fromCharCode(65 + idx)}
                    </span>
                    <span>{opt}</span>
                  </div>

                  {showFeedback && isCorrect && (
                    <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
                  )}
                  {showFeedback && isSelected && !isCorrect && (
                    <XCircle className="w-5 h-5 text-rose-400 shrink-0" />
                  )}
                </button>
              );
            })}
          </div>

          {/* Explanation Box & Next Button */}
          {selectedOption !== null && (
            <div className="p-4 rounded-xl bg-slate-950/90 border border-cyan-500/30 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="text-xs sm:text-sm text-slate-200 leading-relaxed">
                <strong className="text-amber-300 block mb-0.5">
                  {selectedOption === currentQ.correctIndex ? '✓ Дұрыс жауап!' : '✗ Қателестіңіз. Дұрыс түсіндірмесі:'}
                </strong>
                {currentQ.explanation}
              </div>

              <button
                type="button"
                onClick={handleNext}
                className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-cyan-400 to-blue-500 text-slate-950 font-bold text-xs sm:text-sm flex items-center justify-center gap-2 shrink-0 cursor-pointer hover:opacity-95"
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
        <div className="rounded-2xl glass-panel-elevated p-8 border border-amber-400/50 text-center magic-glow-gold space-y-6">
          <div className="w-20 h-20 rounded-2xl bg-gradient-to-tr from-amber-400 to-cyan-400 p-[2px] mx-auto">
            <div className="w-full h-full bg-[#0b0f19] rounded-[14px] flex items-center justify-center">
              <Award className="w-10 h-10 text-amber-300" />
            </div>
          </div>

          <div>
            <span className="text-xs uppercase tracking-widest text-cyan-300 font-bold">
              Викторина аяқталды
            </span>
            <h3 className="font-magic text-3xl sm:text-4xl font-extrabold text-white mt-1">
              Сіздің бағаңыз: <span className="text-amber-300">{score} / 10</span> балл!
            </h3>
            <p className="text-base sm:text-lg font-semibold text-cyan-200 mt-2">
              {getRankTitle(score)}
            </p>
          </div>

          <div className="grid grid-cols-5 sm:grid-cols-10 gap-2 max-w-lg mx-auto">
            {answers.map((ok, i) => (
              <div
                key={i}
                className={`p-2 rounded-xl border font-mono text-xs font-bold ${
                  ok
                    ? 'bg-emerald-500/20 border-emerald-400 text-emerald-300'
                    : 'bg-rose-500/20 border-rose-500 text-rose-300'
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
              className="px-6 py-3 rounded-xl bg-gradient-to-r from-amber-300 via-cyan-300 to-cyan-400 text-slate-950 font-bold text-sm inline-flex items-center gap-2 cursor-pointer shadow-lg shadow-cyan-500/25"
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
