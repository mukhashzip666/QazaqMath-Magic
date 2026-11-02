import React from 'react';
import { X, Sparkles, CheckCircle2, Lightbulb } from 'lucide-react';

interface RulesModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const RulesModal: React.FC<RulesModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-[#172B3A]/40 backdrop-blur-xs">
      <div className="w-full max-w-lg max-h-[90vh] overflow-y-auto rounded-2xl bg-[#FFFFFF] border border-[#E5EAF0] p-4 sm:p-6 shadow-2xl relative">
        <div className="absolute top-0 left-0 right-0 h-1 bg-[#D92732]" />
        <button
          onClick={onClose}
          aria-label="Жабу"
          className="absolute top-4 right-4 p-2 rounded-lg bg-[#F5F8FA] text-[#657786] hover:text-[#172B3A] transition-colors cursor-pointer"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="flex items-center gap-2.5 mb-4">
          <div className="p-2 rounded-xl bg-[#DCEEFF] text-[#D92732]">
            <Sparkles className="w-5 h-5" />
          </div>
          <h3 className="text-lg font-extrabold text-[#172B3A]">
            «Сиқырлы кесте» ережесі
          </h3>
        </div>

        <div className="space-y-3.5 text-xs sm:text-sm text-[#657786] leading-relaxed mb-6">
          <div className="flex items-start gap-3 p-3.5 rounded-xl bg-[#F5F8FA] border border-[#E5EAF0]">
            <CheckCircle2 className="w-5 h-5 text-[#D92732] shrink-0 mt-0.5" />
            <div>
              <strong className="text-[#172B3A] block mb-0.5">1-қадам: Сан таңдаңыз</strong>
              1 мен 31 аралығындағы кез келген бір бүтін санды ойлап, жадыңызда мықтап сақтаңыз.
            </div>
          </div>

          <div className="flex items-start gap-3 p-3.5 rounded-xl bg-[#F5F8FA] border border-[#E5EAF0]">
            <CheckCircle2 className="w-5 h-5 text-[#4A9FE8] shrink-0 mt-0.5" />
            <div>
              <strong className="text-[#172B3A] block mb-0.5">2-қадам: Бағандарды белгілеңіз</strong>
              Экрандағы 5 бағанды қарап шығып, ойлаған саныңыз кездесетін бағандарды (1–5) басып белгілеңіз.
            </div>
          </div>

          <div className="flex items-start gap-3 p-3.5 rounded-xl bg-[#F5F8FA] border border-[#E5EAF0]">
            <CheckCircle2 className="w-5 h-5 text-[#D92732] shrink-0 mt-0.5" />
            <div>
              <strong className="text-[#172B3A] block mb-0.5">3-қадам: Құпия санды білу</strong>
              «Құпия санды айту» батырмасын басыңыз — жүйе сіздің ойлаған саныңызды бірден тауып береді!
            </div>
          </div>

          <div className="p-3.5 rounded-xl bg-[#DCEEFF]/60 border border-[#4A9FE8]/40 text-xs text-[#172B3A] flex items-center gap-2.5">
            <Lightbulb className="w-4 h-4 text-[#D92732] shrink-0" />
            <span>
              Қосымша бөлімдерді (Виртуалды Сиқыршы, Теория зертханасы, 10 сұрақтық тест және Жоба паспорты) жоғарғы мәзір арқылы аша аласыз!
            </span>
          </div>
        </div>

        <div className="text-right">
          <button
            onClick={onClose}
            className="px-5 py-2.5 rounded-xl bg-[#D92732] hover:bg-[#b81f29] text-white font-bold text-xs sm:text-sm transition-colors cursor-pointer"
          >
            Түсінікті, бастайық!
          </button>
        </div>
      </div>
    </div>
  );
};
