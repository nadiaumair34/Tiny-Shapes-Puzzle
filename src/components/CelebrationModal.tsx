import React, { useEffect } from 'react';
import confetti from 'canvas-confetti';
import { ShapeType } from '../types/game';
import { SHAPES_DATA } from '../data/shapes';
import { audioManager } from '../utils/audio';
import mascotBearImg from '../assets/images/friendly_mascot_bear_1792491526533.jpg';
import { RotateCcw, ArrowRight, Sparkles } from 'lucide-react';

interface CelebrationModalProps {
  isOpen: boolean;
  onPlayAgain: () => void;
  onNextLevel?: () => void;
  title?: string;
  subtitle?: string;
  completedShapes?: ShapeType[];
}

export const CelebrationModal: React.FC<CelebrationModalProps> = ({
  isOpen,
  onPlayAgain,
  onNextLevel,
  title = 'Hooray! You Did It!',
  subtitle = 'You matched all the colorful shapes!',
  completedShapes = [],
}) => {
  useEffect(() => {
    if (!isOpen) return;

    // Trigger audio fanfare
    audioManager.playCelebrationFanfare();
    audioManager.speak(title + '! ' + subtitle);

    // Multi-burst colorful toddler confetti
    try {
      const count = 200;
      const defaults = {
        origin: { y: 0.7 },
        colors: ['#F59E0B', '#EF4444', '#10B981', '#0EA5E9', '#8B5CF6', '#EC4899', '#F97316'],
      };

      const fire = (particleRatio: number, opts: confetti.Options) => {
        confetti({
          ...defaults,
          ...opts,
          particleCount: Math.floor(count * particleRatio),
        });
      };

      fire(0.25, { spread: 26, startVelocity: 55 });
      fire(0.2, { spread: 60 });
      fire(0.35, { spread: 100, decay: 0.91, scalar: 1.2 });
      fire(0.1, { spread: 120, startVelocity: 25, decay: 0.92 });
      fire(0.1, { spread: 120, startVelocity: 45 });
    } catch {
      // Confetti fallback
    }
  }, [isOpen, title, subtitle]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg bg-amber-50 rounded-3xl p-6 md:p-8 shadow-2xl border-4 border-amber-300 text-center overflow-hidden">
        {/* Soft playful background circles */}
        <div className="absolute -top-12 -left-12 w-32 h-32 bg-yellow-200/50 rounded-full blur-xl pointer-events-none" />
        <div className="absolute -bottom-12 -right-12 w-40 h-40 bg-pink-200/50 rounded-full blur-xl pointer-events-none" />

        {/* Mascot Bear Image */}
        <div className="relative mx-auto w-36 h-36 md:w-44 md:h-44 rounded-full overflow-hidden border-4 border-white shadow-lg bg-amber-100 mb-4 animate-soft-bounce">
          <img
            src={mascotBearImg}
            alt="Smiling bear holding a star"
            className="w-full h-full object-cover"
            referrerPolicy="no-referrer"
          />
        </div>

        {/* Cheerful Title */}
        <div className="inline-flex items-center gap-2 mb-2">
          <Sparkles className="w-7 h-7 text-amber-500 animate-spin" style={{ animationDuration: '4s' }} />
          <h2 className="text-3xl md:text-4xl font-black text-amber-900 font-heading tracking-tight">
            {title}
          </h2>
          <Sparkles className="w-7 h-7 text-amber-500 animate-spin" style={{ animationDuration: '4s' }} />
        </div>

        <p className="text-slate-700 text-lg md:text-xl font-medium mb-5">
          {subtitle}
        </p>

        {/* Display shapes explored */}
        {completedShapes.length > 0 && (
          <div className="mb-6 p-3 bg-white/80 rounded-2xl border border-amber-200/80 shadow-inner">
            <span className="block text-xs uppercase tracking-wider font-bold text-amber-800/70 mb-2">
              Shapes you mastered:
            </span>
            <div className="flex flex-wrap items-center justify-center gap-2">
              {completedShapes.map((s) => {
                const info = SHAPES_DATA[s];
                return (
                  <button
                    key={s}
                    onClick={() => {
                      audioManager.playPop();
                      audioManager.speak(info.name + '. ' + info.funFact);
                    }}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold shadow-sm transition-transform hover:scale-105 active:scale-95"
                    style={{
                      backgroundColor: `${info.primaryColor}25`,
                      color: info.textColor,
                      border: `1.5px solid ${info.primaryColor}`,
                    }}
                  >
                    <span>{info.name}</span>
                    <span className="text-[10px] opacity-75">🔊</span>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* Big Touch-Friendly Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          <button
            onClick={() => {
              audioManager.playPop();
              onPlayAgain();
            }}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 bg-white hover:bg-slate-50 text-slate-800 font-bold text-lg rounded-2xl border-2 border-slate-200 shadow-md transition-all active:scale-95"
          >
            <RotateCcw className="w-5 h-5 text-amber-600" />
            <span>Play Again</span>
          </button>

          {onNextLevel && (
            <button
              onClick={() => {
                audioManager.playPop();
                onNextLevel();
              }}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-7 py-3.5 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white font-extrabold text-lg rounded-2xl shadow-lg shadow-orange-500/30 transition-all active:scale-95 animate-pulse"
            >
              <span>Next Puzzle!</span>
              <ArrowRight className="w-5 h-5" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
