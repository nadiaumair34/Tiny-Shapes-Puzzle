import React, { useState, useEffect } from 'react';
import { ShapeType } from '../../types/game';
import { SHAPES_DATA, ALL_SHAPE_KEYS } from '../../data/shapes';
import { ShapeGraphic } from '../ShapeGraphic';
import { audioManager } from '../../utils/audio';
import { Volume2, Star, Sparkles, RotateCcw } from 'lucide-react';

interface FindShapeModeProps {
  onComplete: (shapes: ShapeType[]) => void;
  showFaces: boolean;
}

export const FindShapeMode: React.FC<FindShapeModeProps> = ({ onComplete, showFaces }) => {
  const [targetShape, setTargetShape] = useState<ShapeType>('star');
  const [options, setOptions] = useState<ShapeType[]>([]);
  const [streak, setStreak] = useState<number>(0);
  const [history, setHistory] = useState<ShapeType[]>([]);
  const [wrongShape, setWrongShape] = useState<ShapeType | null>(null);
  const [correctShape, setCorrectShape] = useState<ShapeType | null>(null);

  const STREAK_GOAL = 5;

  const nextQuestion = (currentHistory: ShapeType[]) => {
    setWrongShape(null);
    setCorrectShape(null);

    // Pick a new target shape
    const available = ALL_SHAPE_KEYS.filter((s) => !currentHistory.slice(-2).includes(s));
    const target = available[Math.floor(Math.random() * available.length)] || 'star';
    setTargetShape(target);

    // Pick 3 distinct distractors
    const others = ALL_SHAPE_KEYS.filter((s) => s !== target);
    const shuffled = [...others].sort(() => 0.5 - Math.random());
    const roundOptions = [target, shuffled[0], shuffled[1], shuffled[2]];
    setOptions(roundOptions.sort(() => 0.5 - Math.random()));

    // Speak prompt
    setTimeout(() => {
      audioManager.speak(`Can you find the ${SHAPES_DATA[target].name}?`);
    }, 200);
  };

  useEffect(() => {
    nextQuestion([]);
  }, []);

  const handleTapOption = (shape: ShapeType) => {
    if (correctShape) return; // Prevent double taps

    if (shape === targetShape) {
      // Correct!
      audioManager.playPop();
      audioManager.playPieceSuccess();
      audioManager.speak(`You found it! That is the ${SHAPES_DATA[shape].name}!`);
      setCorrectShape(shape);

      const newStreak = streak + 1;
      const newHistory = [...history, shape];
      setStreak(newStreak);
      setHistory(newHistory);

      setTimeout(() => {
        if (newStreak >= STREAK_GOAL) {
          audioManager.speak('Super shape explorer! You found all five shapes!');
          onComplete(newHistory);
        } else {
          nextQuestion(newHistory);
        }
      }, 1000);
    } else {
      // Gentle hint
      audioManager.playGentleOops();
      audioManager.speak(`That's the ${SHAPES_DATA[shape].name}! Where is the ${SHAPES_DATA[targetShape].name}?`);
      setWrongShape(shape);
      setTimeout(() => setWrongShape(null), 700);
    }
  };

  const handleReplayAudio = () => {
    audioManager.playPop();
    audioManager.speak(`Where is the ${SHAPES_DATA[targetShape].name}?`);
  };

  const handleReset = () => {
    audioManager.playPop();
    setStreak(0);
    setHistory([]);
    nextQuestion([]);
  };

  const targetData = SHAPES_DATA[targetShape];

  return (
    <div className="relative flex flex-col items-center justify-between min-h-[calc(100vh-5rem)] p-3 md:p-6">
      {/* Top Bar with Streak Stars */}
      <div className="w-full max-w-4xl flex items-center justify-between bg-white/90 backdrop-blur-md rounded-2xl p-4 border border-amber-200/80 shadow-xs mb-4">
        {/* Streak Stars */}
        <div className="flex items-center gap-2">
          <span className="text-sm font-bold text-amber-950 mr-1">Star Tracker:</span>
          {Array.from({ length: STREAK_GOAL }).map((_, i) => (
            <div
              key={i}
              className={`w-8 h-8 rounded-full flex items-center justify-center transition-all ${
                i < streak
                  ? 'bg-amber-400 text-amber-950 scale-110 shadow-md ring-2 ring-amber-300'
                  : 'bg-slate-100 text-slate-300'
              }`}
            >
              <Star className="w-5 h-5 fill-current" />
            </div>
          ))}
        </div>

        {/* Audio Replay & Reset */}
        <div className="flex items-center gap-2">
          <button
            onClick={handleReplayAudio}
            className="flex items-center gap-2 px-4 py-2 bg-amber-500 hover:bg-amber-600 text-white font-bold rounded-xl text-sm shadow-sm transition-all active:scale-95 cursor-pointer"
          >
            <Volume2 className="w-5 h-5" />
            <span>Hear Prompt</span>
          </button>
          <button
            onClick={handleReset}
            className="p-2 text-slate-500 hover:text-amber-800 hover:bg-amber-100 rounded-xl transition-colors cursor-pointer"
            title="Reset"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Spoken Challenge Banner */}
      <div className="text-center my-3 max-w-2xl">
        <button
          onClick={handleReplayAudio}
          className="group inline-flex items-center gap-3 px-6 py-4 bg-white/95 rounded-3xl shadow-lg border-3 border-amber-300 hover:border-amber-400 transition-all cursor-pointer hover:scale-102"
        >
          <div className="p-3 bg-amber-100 rounded-2xl text-amber-700 group-hover:scale-110 transition-transform">
            <Volume2 className="w-8 h-8 animate-pulse" />
          </div>
          <div className="text-left">
            <span className="text-xs uppercase font-extrabold tracking-wider text-amber-700">
              Listen & Find:
            </span>
            <h2 className="text-2xl sm:text-4xl font-black text-amber-950 font-heading">
              Can you find the{' '}
              <span
                className="underline decoration-4"
                style={{ textDecorationColor: targetData.primaryColor, color: targetData.textColor }}
              >
                {targetData.name}
              </span>
              ?
            </h2>
          </div>
        </button>
      </div>

      {/* 4 Large Shape Options */}
      <div className="w-full max-w-3xl grid grid-cols-2 gap-4 sm:gap-8 my-auto">
        {options.map((shape) => {
          const isWrong = wrongShape === shape;
          const isCorrect = correctShape === shape;

          return (
            <button
              key={shape}
              onClick={() => handleTapOption(shape)}
              className={`relative flex flex-col items-center justify-center p-6 sm:p-8 bg-white/95 rounded-3xl border-4 shadow-xl transition-all cursor-pointer focus:outline-none focus-visible:ring-4 focus-visible:ring-amber-400 active:scale-95 ${
                isCorrect
                  ? 'border-emerald-500 bg-emerald-50/80 scale-105 shadow-2xl ring-4 ring-emerald-300'
                  : isWrong
                  ? 'border-red-400 bg-red-50/60 animate-gentle-wobble'
                  : 'border-amber-200 hover:border-amber-400 hover:scale-103'
              }`}
            >
              <ShapeGraphic
                shape={shape}
                variant="piece"
                size={135}
                showFace={showFaces}
                showLabel={true}
              />

              {/* Sparkle badge on correct pick */}
              {isCorrect && (
                <div className="absolute top-3 right-3 bg-emerald-500 text-white p-2 rounded-full shadow-lg animate-bounce">
                  <Sparkles className="w-6 h-6" />
                </div>
              )}
            </button>
          );
        })}
      </div>

      {/* Footer Encouragement */}
      <div className="text-center mt-4">
        <p className="text-xs sm:text-sm font-semibold text-slate-500">
          Tap the big speaker anytime to hear the shape name again!
        </p>
      </div>
    </div>
  );
};
