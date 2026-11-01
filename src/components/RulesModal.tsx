import React from 'react';
import { X, Sparkles, CheckCircle2, Lightbulb } from 'lucide-react';

interface RulesModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const RulesModal: React.FC<RulesModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="w-full max-w-lg rounded-2xl glass-panel-elevated border border-purple-500/40 p-6 shadow-2xl relative">
        <button
          onClick={onClose}
          aria-label="Жабу"
          className="absolute top-4 right-4 p-2 rounded-lg bg-slate-800 text-slate-400 hover:text-white transition-colors cursor-pointer"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="flex items-center gap-2 mb-4">
          <div className="p-2 rounded-xl bg-purple-500/20 text-purple-300">
            <Sparkles className="w-5 h-5 text-purple-400" />
          </div>
          <h3 className="text-lg font-bold text-slate-100 font-magic">
            «Сиқырлы кесте» ережесі
          </h3>
        </div>

        <div className="space-y-4 text-xs sm:text-sm text-slate-300 leading-relaxed mb-6">
          <div className="flex items-start gap-3 p-3 rounded-xl bg-slate-900/60 border border-slate-800">
            <CheckCircle2 className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
            <div>
              <strong className="text-white block mb-0.5">1-қадам: Сан таңдаңыз</strong>
              1 мен 31 аралығындағы кез келген бір бүтін санды ойлап, жадыңызда мықтап сақтаңыз.
            </div>
          </div>

          <div className="flex items-start gap-3 p-3 rounded-xl bg-slate-900/60 border border-slate-800">
            <CheckCircle2 className="w-5 h-5 text-cyan-400 shrink-0 mt-0.5" />
            <div>
              <strong className="text-white block mb-0.5">2-қадам: Бағандарды тексеріңіз</strong>
              Экрандағы 5 бағанды қарап шығыңыз. Сіз ойлаған сан бар бағандардың астындағы «Менің саным осында» батырмасын басып белгілеңіз.
            </div>
          </div>

          <div className="flex items-start gap-3 p-3 rounded-xl bg-slate-900/60 border border-slate-800">
            <CheckCircle2 className="w-5 h-5 text-purple-400 shrink-0 mt-0.5" />
            <div>
              <strong className="text-white block mb-0.5">3-қадам: Санды білу</strong>
              «Санды білу ✨» батырмасын басыңыз! Виртуалды Сиқыршы сіздің ойлаған саныңызды бірден жариялап, қаласаңыз оның математикалық сырын ашып береді!
            </div>
          </div>

          <div className="p-3 rounded-xl bg-purple-950/40 border border-purple-800/40 text-xs text-purple-200 flex items-center gap-2">
            <Lightbulb className="w-4 h-4 text-amber-400 shrink-0" />
            <span>
              Кеңес: Бұл фокусты достарыңызға немесе сыныптастарыңызға қағазға жазып көрсетіп, оларды таңғалдыра аласыз!
            </span>
          </div>
        </div>

        <div className="text-right">
          <button
            onClick={onClose}
            className="px-5 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-semibold text-xs sm:text-sm transition-colors cursor-pointer"
          >
            Түсінікті, бастайық!
          </button>
        </div>
      </div>
    </div>
  );
};
