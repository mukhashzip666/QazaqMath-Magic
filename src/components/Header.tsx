import React from 'react';
import { Sparkles, Volume2, VolumeX, Wand2 } from 'lucide-react';
import { soundManager } from '../utils/soundEffects';

export type ActiveTab = 'game' | 'theory' | 'quiz' | 'passport';

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
  const navItems: { id: ActiveTab; label: string }[] = [
    { id: 'game', label: 'Сиқырлы фокус' },
    { id: 'theory', label: 'Теория мен зертхана' },
    { id: 'quiz', label: 'Білім тесті (10/10)' },
    { id: 'passport', label: 'Жоба паспорты' },
  ];

  return (
    <header className="w-full border-b border-purple-900/40 bg-[#0b0f19]/85 backdrop-blur-md sticky top-0 z-30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-8">
        {/* Zone 1: Single-line Brand Title */}
        <button
          type="button"
          onClick={() => onChangeTab('game')}
          className="font-magic text-lg sm:text-xl font-bold tracking-wider bg-gradient-to-r from-cyan-300 via-purple-300 to-amber-200 bg-clip-text text-transparent whitespace-nowrap shrink-0 cursor-pointer flex items-center gap-2"
        >
          <Sparkles className="w-5 h-5 text-cyan-400 shrink-0" />
          <span>СИҚЫРЛЫ КЕСТЕ</span>
        </button>

        {/* Zone 2: 5 Single-Line Navigation Links */}
        <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-slate-300">
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
                className={`transition-colors cursor-pointer whitespace-nowrap shrink-0 pb-1 border-b-2 ${
                  isActive
                    ? 'text-cyan-300 border-cyan-400 font-semibold'
                    : 'text-slate-300 border-transparent hover:text-white hover:border-purple-500/50'
                }`}
              >
                {item.label}
              </button>
            );
          })}
          <button
            type="button"
            onClick={onOpenRules}
            className="text-slate-300 hover:text-white transition-colors cursor-pointer whitespace-nowrap shrink-0 pb-1 border-b-2 border-transparent"
          >
            Ережесі
          </button>
        </nav>

        {/* Zone 3: Primary Action & Audio */}
        <div className="flex items-center gap-2.5 shrink-0">
          <button
            type="button"
            onClick={onToggleTrainer}
            className={`px-3.5 py-2 text-xs font-semibold rounded-xl border transition-all cursor-pointer whitespace-nowrap shrink-0 flex items-center gap-1.5 ${
              showTrainer
                ? 'bg-amber-500/20 border-amber-400 text-amber-200'
                : 'bg-purple-950/50 border-purple-700/50 text-cyan-200 hover:bg-purple-900/50 hover:text-white'
            }`}
          >
            <Wand2 className="w-3.5 h-3.5 text-cyan-400" />
            <span>Тренажер</span>
          </button>

          <button
            type="button"
            onClick={() => {
              onToggleMute();
              soundManager.playSelect(550);
            }}
            aria-label={isMuted ? 'Дыбысты қосу' : 'Дыбысты өшіру'}
            className="p-2 rounded-xl bg-slate-900/80 border border-slate-800 text-slate-300 hover:text-cyan-300 hover:border-cyan-500/50 transition-colors cursor-pointer"
            title={isMuted ? 'Дыбысты қосу' : 'Дыбысты өшіру'}
          >
            {isMuted ? (
              <VolumeX className="w-4 h-4 text-slate-500" />
            ) : (
              <Volume2 className="w-4 h-4 text-cyan-400" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile Navigation Strip */}
      <div className="md:hidden flex items-center gap-2 overflow-x-auto px-4 py-2 border-t border-slate-800/80 bg-[#090d16]">
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
              className={`px-3 py-1 rounded-lg text-xs font-medium whitespace-nowrap shrink-0 cursor-pointer ${
                isActive
                  ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 font-semibold'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              {item.label}
            </button>
          );
        })}
      </div>
    </header>
  );
};
