import React from 'react';
import { GameMode } from '../types/game';
import { Volume2, VolumeX, Sparkles, HelpCircle } from 'lucide-react';
import { audioManager } from '../utils/audio';

interface TopBarProps {
  currentMode: GameMode;
  onSelectMode: (mode: GameMode) => void;
  soundEnabled: boolean;
  onToggleSound: () => void;
  voiceEnabled: boolean;
  onToggleVoice: () => void;
  onOpenParentGuide: () => void;
}

export const TopBar: React.FC<TopBarProps> = ({
  currentMode,
  onSelectMode,
  soundEnabled,
  onToggleSound,
  voiceEnabled,
  onToggleVoice,
  onOpenParentGuide,
}) => {
  const navItems: { id: GameMode; label: string }[] = [
    { id: 'wooden_puzzle', label: 'Puzzle Board' },
    { id: 'shape_sorter', label: 'Shape Sorter' },
    { id: 'find_shape', label: 'Find & Tap' },
    { id: 'tangram', label: 'Picture Builder' },
    { id: 'musical_box', label: 'Music Sandbox' },
  ];

  return (
    <header className="sticky top-0 z-40 bg-white/85 backdrop-blur-md border-b border-amber-200/60 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 flex items-center justify-between gap-8 h-16">
        {/* Zone 1: Single text element wordmark */}
        <button
          onClick={() => {
            audioManager.playPop();
            onSelectMode('wooden_puzzle');
          }}
          className="text-left cursor-pointer group"
        >
          <span className="text-2xl font-black text-amber-900 tracking-tight font-heading whitespace-nowrap shrink-0 group-hover:text-amber-700 transition-colors">
            TinyShapes
          </span>
        </button>

        {/* Zone 2: 4-5 single-line clean navigation links */}
        <nav className="hidden lg:flex items-center gap-1 xl:gap-2">
          {navItems.map((item) => {
            const isActive = currentMode === item.id;
            return (
              <button
                key={item.id}
                onClick={() => {
                  audioManager.playPop();
                  onSelectMode(item.id);
                }}
                className={`px-3.5 py-2 text-sm font-bold rounded-xl whitespace-nowrap shrink-0 transition-all cursor-pointer ${
                  isActive
                    ? 'bg-amber-100 text-amber-950 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/70'
                }`}
              >
                {item.label}
              </button>
            );
          })}
        </nav>

        {/* Zone 3: 1 primary action / utility controls */}
        <div className="flex items-center gap-2 shrink-0">
          {/* Sound FX Toggle */}
          <button
            onClick={onToggleSound}
            title={soundEnabled ? 'Mute Sounds' : 'Turn On Sounds'}
            aria-label="Toggle Sound"
            className={`p-2 rounded-xl transition-colors cursor-pointer border ${
              soundEnabled
                ? 'bg-amber-50 text-amber-800 border-amber-200 hover:bg-amber-100'
                : 'bg-slate-100 text-slate-400 border-slate-200 hover:bg-slate-200'
            }`}
          >
            {soundEnabled ? <Volume2 className="w-5 h-5" /> : <VolumeX className="w-5 h-5" />}
          </button>

          {/* Voice Speech Toggle */}
          <button
            onClick={onToggleVoice}
            title={voiceEnabled ? 'Mute Voice' : 'Turn On Shape Voice'}
            aria-label="Toggle Voice"
            className={`px-2.5 py-1.5 text-xs font-bold rounded-xl transition-colors cursor-pointer border flex items-center gap-1 ${
              voiceEnabled
                ? 'bg-emerald-50 text-emerald-800 border-emerald-200 hover:bg-emerald-100'
                : 'bg-slate-100 text-slate-400 border-slate-200 hover:bg-slate-200'
            }`}
          >
            <Sparkles className="w-4 h-4" />
            <span className="hidden sm:inline">Voice {voiceEnabled ? 'ON' : 'OFF'}</span>
          </button>

          {/* Parent & Educator Guide Button */}
          <button
            onClick={() => {
              audioManager.playPop();
              onOpenParentGuide();
            }}
            className="p-2 text-slate-600 hover:text-amber-800 hover:bg-amber-50 rounded-xl transition-colors border border-transparent hover:border-amber-200 cursor-pointer"
            title="Parent & Learning Guide"
            aria-label="Parent Guide"
          >
            <HelpCircle className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Mobile/Tablet Sub-Navigation strip for easy thumb switching */}
      <div className="lg:hidden flex overflow-x-auto no-scrollbar px-4 py-2 bg-amber-50/50 border-t border-amber-100 gap-1.5">
        {navItems.map((item) => {
          const isActive = currentMode === item.id;
          return (
            <button
              key={item.id}
              onClick={() => {
                audioManager.playPop();
                onSelectMode(item.id);
              }}
              className={`px-3 py-1.5 text-xs font-bold rounded-lg whitespace-nowrap shrink-0 transition-colors ${
                isActive
                  ? 'bg-amber-500 text-white shadow-xs'
                  : 'bg-white text-slate-700 hover:bg-slate-100 border border-amber-200/50'
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
