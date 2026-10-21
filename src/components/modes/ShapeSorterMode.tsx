import React, { useState, useEffect } from 'react';
import { ShapeType } from '../../types/game';
import { SHAPES_DATA, ALL_SHAPE_KEYS } from '../../data/shapes';
import { ShapeGraphic } from '../ShapeGraphic';
import { audioManager } from '../../utils/audio';
import { Volume2, Sparkles, RotateCcw } from 'lucide-react';

interface ShapeSorterModeProps {
  onComplete: (shapes: ShapeType[]) => void;
  showFaces: boolean;
}

export const ShapeSorterMode: React.FC<ShapeSorterModeProps> = ({ onComplete, showFaces }) => {
  const [targetShape, setTargetShape] = useState<ShapeType>('circle');
  const [candidates, setCandidates] = useState<ShapeType[]>([]);
  const [collectedCount, setCollectedCount] = useState<number>(0);
  const [collectedShapes, setCollectedShapes] = useState<ShapeType[]>([]);
  const [isDropping, setIsDropping] = useState<ShapeType | null>(null);
  const [isShakingBox, setIsShakingBox] = useState<boolean>(false);
  const [wrongWobble, setWrongWobble] = useState<ShapeType | null>(null);

  const GOAL_COUNT = 5;

  // Generate round
  const setupRound = (currentCollected: ShapeType[]) => {
    // Pick target shape
    const available = ALL_SHAPE_KEYS.filter((s) => !currentCollected.includes(s) || currentCollected.length >= 8);
    const chosen = available[Math.floor(Math.random() * available.length)] || 'circle';
    setTargetShape(chosen);

    // Pick 2-3 distractors
    const others = ALL_SHAPE_KEYS.filter((s) => s !== chosen);
    const shuffledOthers = [...others].sort(() => 0.5 - Math.random());
    const roundCandidates = [chosen, shuffledOthers[0], shuffledOthers[1]];
    // Shuffle candidates
    setCandidates(roundCandidates.sort(() => 0.5 - Math.random()));

    // Voice announcement
    setTimeout(() => {
      audioManager.speak(`Can you find the ${SHAPES_DATA[chosen].name} and drop it in?`);
    }, 200);
  };

  useEffect(() => {
    setupRound([]);
  }, []);

  const handleShapeSelect = (shape: ShapeType) => {
    if (isDropping) return;

    if (shape === targetShape) {
      // Correct!
      audioManager.playPop();
      audioManager.speak(`Yes! ${SHAPES_DATA[shape].name}!`);
      setIsDropping(shape);

      // Trigger box shake when piece falls inside
      setTimeout(() => {
        audioManager.playSnap();
        audioManager.playPieceSuccess();
        setIsShakingBox(true);
      }, 350);

      setTimeout(() => {
        setIsDropping(null);
        setIsShakingBox(false);

        const newCollected = [...collectedShapes, shape];
        const newCount = collectedCount + 1;
        setCollectedCount(newCount);
        setCollectedShapes(newCollected);

        if (newCount >= GOAL_COUNT) {
          audioManager.speak('Great job! The shape sorter is completely full!');
          setTimeout(() => {
            onComplete(newCollected);
          }, 600);
        } else {
          setupRound(newCollected);
        }
      }, 700);
    } else {
      // Wrong piece chosen
      audioManager.playGentleOops();
      audioManager.speak(`That is the ${SHAPES_DATA[shape].name}. Look for the ${SHAPES_DATA[targetShape].name}!`);
      setWrongWobble(shape);
      setTimeout(() => setWrongWobble(null), 600);
    }
  };

  const handleReplayPrompt = () => {
    audioManager.playPop();
    audioManager.speak(`Drop the ${SHAPES_DATA[targetShape].name} into the shape sorter!`);
  };

  const handleReset = () => {
    audioManager.playPop();
    setCollectedCount(0);
    setCollectedShapes([]);
    setupRound([]);
  };

  return (
    <div className="relative flex flex-col items-center justify-between min-h-[calc(100vh-5rem)] p-3 md:p-6">
      {/* Top Progress & Voice Bar */}
      <div className="w-full max-w-4xl flex items-center justify-between bg-white/90 backdrop-blur-md rounded-2xl p-4 border border-amber-200/80 shadow-xs mb-4">
        {/* Progress Dots */}
        <div className="flex items-center gap-2">
          <span className="text-sm font-bold text-amber-950 mr-2">Box Progress:</span>
          {Array.from({ length: GOAL_COUNT }).map((_, i) => (
            <div
              key={i}
              className={`w-7 h-7 rounded-full flex items-center justify-center font-bold text-xs transition-transform ${
                i < collectedCount
                  ? 'bg-emerald-500 text-white scale-110 shadow-sm'
                  : 'bg-amber-100 text-amber-800/40 border border-amber-200'
              }`}
            >
              {i < collectedCount ? '✓' : i + 1}
            </div>
          ))}
        </div>

        {/* Audio prompt button & reset */}
        <div className="flex items-center gap-2">
          <button
            onClick={handleReplayPrompt}
            className="flex items-center gap-1.5 px-3.5 py-1.5 bg-amber-500 hover:bg-amber-600 text-white font-bold rounded-xl text-sm shadow-xs transition-all active:scale-95 cursor-pointer"
          >
            <Volume2 className="w-4 h-4" />
            <span>Hear Again</span>
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

      {/* Center 3D-styled Shape Sorter Box */}
      <div className="relative flex flex-col items-center justify-center flex-1 my-2">
        {/* Animated Dropping Piece */}
        {isDropping && (
          <div className="absolute z-30 transition-all duration-500 ease-in pointer-events-none -top-10 animate-bounce">
            <ShapeGraphic
              shape={isDropping}
              variant="piece"
              size={110}
              showFace={showFaces}
            />
          </div>
        )}

        {/* The Wooden Shape Sorter Toy Box */}
        <div
          className={`relative w-72 sm:w-96 bg-gradient-to-b from-amber-200 via-amber-300 to-amber-400 rounded-3xl p-6 shadow-2xl border-6 border-amber-500 text-center transition-transform ${
            isShakingBox ? 'scale-105 animate-gentle-wobble' : ''
          }`}
        >
          {/* Box Roof with Slot */}
          <div className="mb-4">
            <span className="text-xs uppercase tracking-widest font-black text-amber-900/80 block mb-1">
              TARGET CUTOUT SLOT
            </span>
            <div className="inline-block p-4 bg-amber-900/30 rounded-3xl shadow-inner border-4 border-amber-800/50">
              <ShapeGraphic
                shape={targetShape}
                variant="cutout"
                size={120}
                showFace={false}
              />
            </div>
          </div>

          {/* Voice Prompt Text Banner */}
          <div className="bg-white/90 rounded-2xl py-2 px-4 shadow-sm border border-amber-300 mb-3">
            <p className="text-lg sm:text-xl font-black text-amber-950 font-heading">
              Drop the <span className="underline decoration-amber-400 decoration-4">{SHAPES_DATA[targetShape].name}</span> inside!
            </p>
          </div>

          {/* Sorter Box Window (Peeking Inside) */}
          <div className="bg-amber-950/40 rounded-2xl p-3 shadow-inner border border-amber-800/30 min-h-[60px] flex items-center justify-center gap-2 overflow-hidden">
            {collectedShapes.length === 0 ? (
              <span className="text-xs font-semibold text-amber-200/60">
                Box is empty - drop shapes in!
              </span>
            ) : (
              collectedShapes.map((s, idx) => (
                <div key={idx} className="scale-75 -mx-1 animate-in zoom-in-50">
                  <ShapeGraphic shape={s} variant="piece" size={45} showFace={false} />
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Candidate Shapes Conveyor/Tray */}
      <div className="w-full max-w-3xl mt-4">
        <div className="bg-white/95 rounded-3xl p-4 sm:p-6 shadow-xl border-2 border-amber-200 text-center">
          <span className="text-xs sm:text-sm font-black text-amber-950 uppercase tracking-wider block mb-4">
            Tap the matching shape to drop it in:
          </span>

          <div className="flex items-center justify-center gap-4 sm:gap-10">
            {candidates.map((shape) => {
              const isWobbling = wrongWobble === shape;
              return (
                <button
                  key={shape}
                  onClick={() => handleShapeSelect(shape)}
                  disabled={Boolean(isDropping)}
                  className={`p-3 rounded-3xl transition-transform hover:scale-110 active:scale-95 cursor-pointer focus:outline-none focus-visible:ring-4 focus-visible:ring-amber-400 ${
                    isWobbling ? 'animate-gentle-wobble' : ''
                  }`}
                >
                  <ShapeGraphic
                    shape={shape}
                    variant="piece"
                    size={110}
                    showFace={showFaces}
                    showLabel={true}
                  />
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
