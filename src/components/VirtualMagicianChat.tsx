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
              ? 'font-bold text-[#D92732]'
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
    '19 саны қалай шығады?',
    '64-ке дейін қалай кеңейтеді?',
    'Жобаны 10 баллға қалай қорғаймын?',
  ];

  return (
    <div className="flex flex-col h-[480px] sm:h-[560px] rounded-2xl bg-[#FFFFFF] border border-[#E5EAF0] overflow-hidden shadow-[0_8px_30px_rgba(23,43,58,0.06)] relative">
      {/* Signature thin red line at top */}
      <div className="w-full h-[2px] bg-[#D92732]" />

      {/* Magician Header Bar */}
      <div className="p-4 bg-[#F5F8FA] border-b border-[#E5EAF0] flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-[#DCEEFF] border border-[#4A9FE8]/40 flex items-center justify-center text-[#172B3A]">
            <Bot className="w-5 h-5 text-[#4A9FE8]" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-bold text-sm sm:text-base text-[#172B3A]">
                Виртуалды Сиқыршы
              </span>
              <Sparkles className="w-3.5 h-3.5 text-[#D92732]" />
            </div>
            <p className="text-[11px] text-[#657786] font-medium">
              ЖИ көмекшісі · Математикалық талдаушы
            </p>
          </div>
        </div>

        <div className="text-right">
          <span className="text-[11px] font-code font-semibold text-[#4A9FE8]">
            ЖИ Онлайн
          </span>
        </div>
      </div>

      {/* Messages Stream */}
      <div className="grow overflow-y-auto p-4 space-y-3.5 bg-[#FFFFFF]">
        {messages.map((msg, index) => {
          const isMagician = msg.sender === 'magician';
          const isLatestMagician = isMagician && index === messages.length - 1 && msg.animateTyping;

          return (
            <div
              key={msg.id}
              className={`flex flex-col ${isMagician ? 'items-start' : 'items-end'}`}
            >
              <div
                className={`max-w-[88%] sm:max-w-[84%] rounded-2xl p-3.5 text-xs sm:text-sm leading-relaxed transition-all ${
                  isMagician
                    ? 'bg-[#F5F8FA] text-[#172B3A] border border-[#E5EAF0] rounded-tl-xs'
                    : 'bg-[#4A9FE8] text-white font-medium rounded-tr-xs shadow-xs'
                }`}
              >
                <TypingText text={msg.text} animate={isLatestMagician} />

                {/* Quick Action Button (Step 2: «Иә, құпиясын аш! 🔓») */}
                {msg.quickAction && msg.quickAction.type === 'reveal_secret' && !isSecretRevealed && (
                  <div className="mt-3 pt-2.5 border-t border-[#E5EAF0]">
                    <button
                      type="button"
                      onClick={() => {
                        onRevealSecret();
                        soundManager.playSecretUnlock();
                      }}
                      className="w-full py-2 px-3 rounded-xl bg-[#D92732] hover:bg-[#b81f29] text-white font-bold text-xs sm:text-sm flex items-center justify-center gap-1.5 shadow-xs cursor-pointer transition-colors"
                    >
                      <Unlock className="w-4 h-4" />
                      <span>{msg.quickAction.label}</span>
                    </button>
                  </div>
                )}
              </div>

              <span className="text-[10px] text-[#657786] mt-1 px-1 font-code">
                {msg.timestamp}
              </span>
            </div>
          );
        })}

        {isGenerating && (
          <div className="flex items-center gap-2 p-3 rounded-2xl bg-[#F5F8FA] border border-[#E5EAF0] max-w-[75%]">
            <Loader2 className="w-4 h-4 text-[#4A9FE8] animate-spin" />
            <span className="text-xs text-[#657786] italic">
              Сиқыршы ойланып, жауап жазуда...
            </span>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Suggested Quick Question Chips */}
      <div className="p-2.5 bg-[#F5F8FA] border-t border-[#E5EAF0]">
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-[11px]">
          <span className="text-[#657786] flex items-center gap-1 shrink-0 px-1 font-medium">
            <HelpCircle className="w-3.5 h-3.5 text-[#4A9FE8]" />
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
              className="px-2.5 py-1 rounded-lg bg-[#FFFFFF] hover:bg-[#DCEEFF] text-[#172B3A] border border-[#E5EAF0] hover:border-[#4A9FE8] transition-colors shrink-0 cursor-pointer disabled:opacity-50 font-medium"
            >
              {q}
            </button>
          ))}
        </div>
      </div>

      {/* Input Field */}
      <form
        onSubmit={handleSubmit}
        className="p-3 bg-[#FFFFFF] border-t border-[#E5EAF0] flex items-center gap-2"
      >
        <input
          type="text"
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          placeholder="Сиқыршыға сұрақ қойыңыз (мысалы: 25 саны қалай шығады?)..."
          disabled={isGenerating}
          className="grow px-3.5 py-2.5 rounded-xl bg-[#F5F8FA] border border-[#E5EAF0] text-xs sm:text-sm text-[#172B3A] placeholder-[#657786] focus:outline-none focus:border-[#4A9FE8] focus:bg-[#FFFFFF] transition-colors disabled:opacity-50"
        />
        <button
          type="submit"
          disabled={!inputText.trim() || isGenerating}
          aria-label="Хабарлама жіберу"
          className="p-2.5 rounded-xl bg-[#D92732] hover:bg-[#b81f29] text-white transition-all cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed shrink-0"
        >
          <Send className="w-4 h-4" />
        </button>
      </form>
    </div>
  );
};
