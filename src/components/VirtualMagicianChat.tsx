import React, { useState, useEffect, useRef } from 'react';
import { Send, Bot, Sparkles, Unlock, HelpCircle, Loader2 } from 'lucide-react';
import { soundManager } from '../utils/soundEffects';

export interface ChatMessage {
  id: string;
  sender: 'magician' | 'user';
  text: string;
  quickAction?: {
    type: 'reveal_secret';
    label: string;
  };
  timestamp: string;
  animateTyping?: boolean;
}

interface VirtualMagicianChatProps {
  messages: ChatMessage[];
  onSendMessage: (text: string) => Promise<void>;
  onRevealSecret: () => void;
  isGenerating: boolean;
  isSecretRevealed: boolean;
}

const TypingText: React.FC<{ text: string; animate?: boolean }> = ({ text, animate }) => {
  const [displayedLength, setDisplayedLength] = useState<number>(animate ? 0 : text.length);

  useEffect(() => {
    if (!animate) {
      setDisplayedLength(text.length);
      return;
    }
    setDisplayedLength(0);
    const step = Math.max(2, Math.ceil(text.length / 45));
    const timer = setInterval(() => {
      setDisplayedLength((prev) => {
        if (prev + step >= text.length) {
          clearInterval(timer);
          return text.length;
        }
        return prev + step;
      });
    }, 18);

    return () => clearInterval(timer);
  }, [text, animate]);

  const currentText = text.slice(0, displayedLength);

  return (
    <div className="whitespace-pre-wrap space-y-1">
      {currentText.split('\n').map((line, idx) => (
        <p
          key={idx}
          className={
            line.startsWith('✨') || line.startsWith('🔮') || line.startsWith('🌟') || line.startsWith('Абракадабра')
              ? 'font-semibold text-amber-200'
              : ''
          }
        >
          {line}
        </p>
      ))}
    </div>
  );
};

export const VirtualMagicianChat: React.FC<VirtualMagicianChatProps> = ({
  messages,
  onSendMessage,
  onRevealSecret,
  isGenerating,
  isSecretRevealed,
}) => {
  const [inputText, setInputText] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isGenerating]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim() || isGenerating) return;
    const text = inputText.trim();
    setInputText('');
    soundManager.playSelect(600);
    await onSendMessage(text);
  };

  const presetQuestions = [
    'Екілік санау жүйесі деген не?',
    'Неге 16, 8, 4, 2, 1 кілттері?',
    '64-ке дейін қалай кеңейтеді?',
    'Компьютермен байланысы қандай?',
  ];

  return (
    <div className="flex flex-col h-[600px] rounded-2xl glass-panel-elevated border border-purple-500/30 overflow-hidden shadow-2xl">
      {/* Magician Header Bar */}
      <div className="p-4 bg-gradient-to-r from-purple-950/80 via-[#111827]/90 to-cyan-950/80 border-b border-purple-900/50 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="relative">
            <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-purple-600 to-cyan-400 p-[1.5px] magic-glow-purple">
              <div className="w-full h-full bg-[#0b0f19] rounded-full flex items-center justify-center">
                <Bot className="w-5 h-5 text-cyan-300" />
              </div>
            </div>
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-bold text-sm sm:text-base text-slate-100">
                Виртуалды Сиқыршы
              </span>
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            </div>
            <p className="text-[11px] text-cyan-300/80 font-medium">
              ЖИ көмекшісі · Математикалық сиқыршы
            </p>
          </div>
        </div>

        <div className="text-right">
          <span className="text-[11px] font-mono text-purple-300">
            ЖИ Онлайн
          </span>
        </div>
      </div>

      {/* Messages Stream */}
      <div className="grow overflow-y-auto p-4 space-y-3.5 bg-[#070b14]/50">
        {messages.map((msg, index) => {
          const isMagician = msg.sender === 'magician';
          const isLatestMagician = isMagician && index === messages.length - 1 && msg.animateTyping;

          return (
            <div
              key={msg.id}
              className={`flex flex-col ${isMagician ? 'items-start' : 'items-end'}`}
            >
              <div
                className={`max-w-[88%] sm:max-w-[84%] rounded-2xl p-3 sm:p-3.5 text-xs sm:text-sm leading-relaxed transition-all ${
                  isMagician
                    ? 'bg-gradient-to-br from-[#161d33] to-[#0f172a] text-slate-100 border border-purple-500/30 rounded-tl-sm shadow-md'
                    : 'bg-gradient-to-r from-cyan-600 to-blue-600 text-white font-medium rounded-tr-sm shadow-md'
                }`}
              >
                <TypingText text={msg.text} animate={isLatestMagician} />

                {/* Quick Action Button (Step 2: «Иә, құпиясын аш! 🔓») */}
                {msg.quickAction && msg.quickAction.type === 'reveal_secret' && !isSecretRevealed && (
                  <div className="mt-3 pt-2.5 border-t border-purple-500/20">
                    <button
                      type="button"
                      onClick={() => {
                        onRevealSecret();
                        soundManager.playSecretUnlock();
                      }}
                      className="w-full py-2 px-3 rounded-xl bg-gradient-to-r from-amber-400 via-amber-300 to-yellow-500 text-slate-950 font-bold text-xs sm:text-sm flex items-center justify-center gap-1.5 shadow-lg shadow-amber-500/25 hover:from-amber-300 hover:to-yellow-400 cursor-pointer transition-transform active:scale-98"
                    >
                      <Unlock className="w-4 h-4 text-slate-950" />
                      <span>{msg.quickAction.label}</span>
                    </button>
                  </div>
                )}
              </div>

              <span className="text-[10px] text-slate-500 mt-1 px-1 font-mono">
                {msg.timestamp}
              </span>
            </div>
          );
        })}

        {isGenerating && (
          <div className="flex items-center gap-2 p-3 rounded-2xl bg-[#161d33] border border-purple-500/20 max-w-[75%]">
            <Loader2 className="w-4 h-4 text-cyan-400 animate-spin" />
            <span className="text-xs text-slate-400 italic">
              Сиқыршы ойланып, жауап жазуда...
            </span>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Suggested Quick Question Chips */}
      <div className="p-2.5 bg-[#0b0f19] border-t border-slate-800/80">
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-[11px]">
          <span className="text-slate-500 flex items-center gap-1 shrink-0 px-1">
            <HelpCircle className="w-3 h-3 text-purple-400" />
            Сұрау:
          </span>
          {presetQuestions.map((q, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => {
                onSendMessage(q);
                soundManager.playSelect(580);
              }}
              disabled={isGenerating}
              className="px-2.5 py-1 rounded-lg bg-slate-900 hover:bg-purple-900/40 text-slate-300 hover:text-cyan-200 border border-slate-800 transition-colors shrink-0 cursor-pointer disabled:opacity-50"
            >
              {q}
            </button>
          ))}
        </div>
      </div>

      {/* Input Field */}
      <form
        onSubmit={handleSubmit}
        className="p-3 bg-[#090d16] border-t border-slate-800/80 flex items-center gap-2"
      >
        <input
          type="text"
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          placeholder="Сиқыршыға сұрақ қойыңыз (мысалы: екілік жүйе деген не?)..."
          disabled={isGenerating}
          className="grow px-3.5 py-2.5 rounded-xl bg-slate-900/90 border border-slate-700/80 text-xs sm:text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 transition-colors disabled:opacity-50"
        />
        <button
          type="submit"
          disabled={!inputText.trim() || isGenerating}
          aria-label="Хабарлама жіберу"
          className="p-2.5 rounded-xl bg-gradient-to-r from-purple-600 to-cyan-500 text-white hover:opacity-90 transition-all cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed shrink-0"
        >
          <Send className="w-4 h-4" />
        </button>
      </form>
    </div>
  );
};
