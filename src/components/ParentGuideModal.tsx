import React from 'react';
import { X, Heart, Smile, Sparkles, BookOpen } from 'lucide-react';
import { audioManager } from '../utils/audio';

interface ParentGuideModalProps {
  isOpen: boolean;
  onClose: () => void;
  showFaces: boolean;
  onToggleFaces: () => void;
  backgroundIntensity: 'vivid' | 'soft';
  onToggleBackgroundIntensity: () => void;
}

export const ParentGuideModal: React.FC<ParentGuideModalProps> = ({
  isOpen,
  onClose,
  showFaces,
  onToggleFaces,
  backgroundIntensity,
  onToggleBackgroundIntensity,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in">
      <div className="relative w-full max-w-2xl bg-white rounded-3xl p-6 sm:p-8 shadow-2xl border-4 border-amber-200 max-h-[90vh] overflow-y-auto">
        {/* Close Button */}
        <button
          onClick={() => {
            audioManager.playPop();
            onClose();
          }}
          className="absolute top-5 right-5 p-2 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
          aria-label="Close Guide"
        >
          <X className="w-6 h-6" />
        </button>

        {/* Header */}
        <div className="flex items-center gap-3 mb-6">
          <div className="p-3 bg-amber-100 text-amber-800 rounded-2xl">
            <BookOpen className="w-7 h-7" />
          </div>
          <div>
            <h2 className="text-2xl font-black text-amber-950 font-heading tracking-tight">
              Parent & Educator Guide
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 font-medium">
              Supporting toddler shape recognition & spatial reasoning
            </p>
          </div>
        </div>

        {/* Content Sections */}
        <div className="space-y-5 text-sm text-slate-700">
          <div className="p-4 bg-amber-50/70 rounded-2xl border border-amber-200/70">
            <h3 className="font-extrabold text-amber-950 text-base mb-1.5 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-amber-600" />
              How Toddlers Learn Shapes
            </h3>
            <p className="leading-relaxed">
              Between 18 months and 3 years, children naturally begin categorizing objects by geometry rather than color alone.
              Circles and squares are typically recognized first because of their continuous curves and straight symmetries, followed by triangles and stars.
            </p>
          </div>

          <div>
            <h3 className="font-extrabold text-slate-900 text-base mb-2">
              5 Dedicated Play Modes
            </h3>
            <div className="grid sm:grid-cols-2 gap-3 text-xs leading-relaxed">
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                <span className="font-bold text-slate-900 block mb-0.5">1. Wooden Puzzle Board</span>
                Classic cutout matching with generous snap-to-fit physics and single-tap assist for younger toddlers.
              </div>
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                <span className="font-bold text-slate-900 block mb-0.5">2. Shape Sorter Toy</span>
                Chute drop mechanics that simulate a classic physical wooden sorter cube.
              </div>
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                <span className="font-bold text-slate-900 block mb-0.5">3. Find & Tap Quiz</span>
                Auditory listening recognition where children connect spoken words to visual forms.
              </div>
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                <span className="font-bold text-slate-900 block mb-0.5">4. Picture Tangrams</span>
                Combines shapes to create recognizable real-world items (rockets, houses, trains).
              </div>
            </div>
          </div>

          {/* Accessibility & Visual Settings */}
          <div className="pt-2 border-t border-slate-200">
            <h3 className="font-extrabold text-slate-900 text-base mb-3">
              Play Customization
            </h3>
            <div className="flex items-center justify-between p-3 bg-slate-50 rounded-2xl border border-slate-200">
              <div className="flex items-center gap-2.5">
                <Smile className="w-5 h-5 text-amber-600" />
                <div>
                  <span className="font-bold text-slate-900 block text-xs sm:text-sm">Friendly Faces on Shapes</span>
                  <span className="text-[11px] text-slate-500">Adds cute smiling eyes to shapes for extra warmth</span>
                </div>
              </div>
              <button
                onClick={() => {
                  audioManager.playPop();
                  onToggleFaces();
                }}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-colors cursor-pointer border ${
                  showFaces
                    ? 'bg-amber-500 text-white border-amber-600'
                    : 'bg-white text-slate-700 border-slate-300'
                }`}
              >
                {showFaces ? 'Enabled' : 'Classic Geometry'}
              </button>
            </div>

            {/* Kids Wallpaper Style Control */}
            <div className="flex items-center justify-between p-3 bg-slate-50 rounded-2xl border border-slate-200 mt-2.5">
              <div className="flex items-center gap-2.5">
                <Sparkles className="w-5 h-5 text-amber-600" />
                <div>
                  <span className="font-bold text-slate-900 block text-xs sm:text-sm">Kids Wallpaper Theme</span>
                  <span className="text-[11px] text-slate-500">Choose between vivid storybook scenery and soft contrast</span>
                </div>
              </div>
              <button
                onClick={() => {
                  audioManager.playPop();
                  onToggleBackgroundIntensity();
                }}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-colors cursor-pointer border ${
                  backgroundIntensity === 'vivid'
                    ? 'bg-amber-500 text-white border-amber-600'
                    : 'bg-white text-slate-700 border-slate-300'
                }`}
              >
                {backgroundIntensity === 'vivid' ? 'Vivid Storybook' : 'Soft Pastel'}
              </button>
            </div>
          </div>
        </div>

        {/* Footer Note */}
        <div className="mt-6 flex items-center justify-between pt-4 border-t border-slate-100">
          <div className="flex items-center gap-1.5 text-xs text-slate-400">
            <Heart className="w-4 h-4 text-red-400 fill-current" />
            <span>Designed for little hands and curious minds</span>
          </div>
          <button
            onClick={() => {
              audioManager.playPop();
              onClose();
            }}
            className="px-5 py-2.5 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-xl transition-colors cursor-pointer"
          >
            Back to Game
          </button>
        </div>
      </div>
    </div>
  );
};
