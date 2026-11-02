import React from 'react';
import { Sparkles, Volume2, VolumeX, Wand2, HelpCircle, Table2, Bot, BookOpen, Trophy, GraduationCap } from 'lucide-react';
import { soundManager } from '../utils/soundEffects';

export type ActiveTab = 'table' | 'magician' | 'theory' | 'quiz' | 'passport';

interface HeaderProps {
  activeTab: ActiveTab;
  onChangeTab: (tab: ActiveTab) => void;
  isMuted: boolean;
  onToggleMute: () => void;
  showTrainer: boolean;
  onToggleTrainer: () => void;
  onOpenRules: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  onChangeTab,
  isMuted,
  onToggleMute,
  showTrainer,
  onToggleTrainer,
  onOpenRules,
}) => {
  const navItems: { id: ActiveTab; label: string; icon: React.ReactNode }[] = [
    { id: 'table', label: 'Сиқырлы кесте', icon: <Table2 className="w-4 h-4" /> },
    { id: 'magician', label: 'Виртуалды Сиқыршы', icon: <Bot className="w-4 h-4" /> },
    { id: 'theory', label: 'Теория мен зертхана', icon: <BookOpen className="w-4 h-4" /> },
    { id: 'quiz', label: 'Білім тесті (10/10)', icon: <Trophy className="w-4 h-4" /> },
    { id: 'passport', label: 'Жоба паспорты', icon: <GraduationCap className="w-4 h-4" /> },
  ];

  return (
    <header className="w-full bg-[#FFFFFF]/95 backdrop-blur-md border-b border-[#E5EAF0] sticky top-0 z-30 shadow-[0_2px_12px_rgba(23,43,58,0.03)]">
      {/* Signature thin red top accent line */}
      <div className="w-full h-[2px] bg-[#D92732]" />

      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 h-14 sm:h-16 flex items-center justify-between gap-2 sm:gap-4">
        {/* Zone 1: Brand Title */}
        <button
          type="button"
          onClick={() => onChangeTab('table')}
          className="text-base sm:text-xl font-extrabold tracking-tight text-[#172B3A] whitespace-nowrap shrink-0 cursor-pointer flex items-center gap-2 group"
        >
          <span className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg bg-[#DCEEFF] border border-[#4A9FE8]/30 flex items-center justify-center text-[#D92732] group-hover:bg-[#D92732] group-hover:text-white transition-colors">
            <Sparkles className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
          </span>
          <span>
            Сиқырлы <span className="text-[#D92732]">кесте</span>
          </span>
        </button>

        {/* Zone 2: Desktop Navigation Menu */}
        <nav className="hidden lg:flex items-center gap-1 bg-[#F5F8FA] p-1 rounded-xl border border-[#E5EAF0]">
          {navItems.map((item) => {
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => {
                  onChangeTab(item.id);
                  soundManager.playSelect(520);
                }}
                className={`px-3.5 py-2 rounded-lg text-xs sm:text-sm font-semibold transition-all cursor-pointer whitespace-nowrap shrink-0 flex items-center gap-1.5 relative ${
                  isActive
                    ? 'bg-[#FFFFFF] text-[#172B3A] shadow-xs border border-[#E5EAF0]'
                    : 'text-[#657786] hover:text-[#172B3A] hover:bg-[#FFFFFF]/60'
                }`}
              >
                <span className={isActive ? 'text-[#D92732]' : 'text-[#4A9FE8]'}>{item.icon}</span>
                <span>{item.label}</span>
                {isActive && (
                  <span className="absolute bottom-0 left-3 right-3 h-[2px] bg-[#D92732] rounded-full" />
                )}
              </button>
            );
          })}
        </nav>

        {/* Zone 3: Quick Actions (Trainer, Rules, Sound) */}
        <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
          <button
            type="button"
            onClick={onToggleTrainer}
            className={`px-2.5 sm:px-3.5 py-1.5 sm:py-2 text-xs font-bold rounded-xl border transition-all cursor-pointer whitespace-nowrap shrink-0 flex items-center gap-1.5 ${
              showTrainer
                ? 'bg-[#D92732] border-[#D92732] text-white'
                : 'bg-[#DCEEFF] border-[#4A9FE8]/40 text-[#172B3A] hover:bg-[#4A9FE8] hover:text-white'
            }`}
          >
            <Wand2 className="w-3.5 h-3.5" />
            <span>Тренажер</span>
          </button>

          <button
            type="button"
            onClick={onOpenRules}
            className="p-1.5 sm:p-2 rounded-xl bg-[#F5F8FA] border border-[#E5EAF0] text-[#657786] hover:text-[#172B3A] hover:border-[#4A9FE8] transition-colors cursor-pointer"
            title="Ойын ережесі"
            aria-label="Ойын ережесі"
          >
            <HelpCircle className="w-4 h-4" />
          </button>

          <button
            type="button"
            onClick={() => {
              onToggleMute();
              soundManager.playSelect(550);
            }}
            aria-label={isMuted ? 'Дыбысты қосу' : 'Дыбысты өшіру'}
            className="p-1.5 sm:p-2 rounded-xl bg-[#F5F8FA] border border-[#E5EAF0] text-[#657786] hover:text-[#172B3A] hover:border-[#4A9FE8] transition-colors cursor-pointer"
            title={isMuted ? 'Дыбысты қосу' : 'Дыбысты өшіру'}
          >
            {isMuted ? (
              <VolumeX className="w-4 h-4 text-[#D92732]" />
            ) : (
              <Volume2 className="w-4 h-4 text-[#4A9FE8]" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile & Tablet Navigation Bar */}
      <div className="lg:hidden flex items-center gap-1.5 overflow-x-auto px-3 sm:px-4 py-2 border-t border-[#E5EAF0] bg-[#F5F8FA] no-scrollbar">
        {navItems.map((item) => {
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              type="button"
              onClick={() => {
                onChangeTab(item.id);
                soundManager.playSelect(520);
              }}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap shrink-0 cursor-pointer flex items-center gap-1.5 ${
                isActive
                  ? 'bg-[#FFFFFF] text-[#172B3A] border border-[#4A9FE8] shadow-xs'
                  : 'text-[#657786] hover:text-[#172B3A]'
              }`}
            >
              <span className={isActive ? 'text-[#D92732]' : 'text-[#4A9FE8]'}>{item.icon}</span>
              <span>{item.label}</span>
            </button>
          );
        })}
      </div>
    </header>
  );
};
