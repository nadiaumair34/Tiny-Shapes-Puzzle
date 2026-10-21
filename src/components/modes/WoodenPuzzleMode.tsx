import React, { useState, useRef, useEffect } from 'react';
import { ShapeType, DifficultyLevel } from '../../types/game';
import { SHAPES_DATA, DIFFICULTY_PRESETS } from '../../data/shapes';
import { ShapeGraphic } from '../ShapeGraphic';
import { audioManager } from '../../utils/audio';
import { Sparkles, Wand2, RotateCcw } from 'lucide-react';
import playroomWoodBg from '../../assets/images/playroom_wood_bg_1792491525974.jpg';

interface WoodenPuzzleModeProps {
  onComplete: (shapes: ShapeType[]) => void;
  showFaces: boolean;
}

export const WoodenPuzzleMode: React.FC<WoodenPuzzleModeProps> = ({ onComplete, showFaces }) => {
  const [difficulty, setDifficulty] = useState<DifficultyLevel>('easy');
  const [placedShapes, setPlacedShapes] = useState<Set<ShapeType>>(new Set());
  const [selectedPiece, setSelectedPiece] = useState<ShapeType | null>(null);
  const [toddlerAssist, setToddlerAssist] = useState<boolean>(true);
  const [wobblingSlot, setWobblingSlot] = useState<ShapeType | null>(null);

  // Active shape set based on difficulty
  const activeShapes = DIFFICULTY_PRESETS[difficulty].shapes;

  // Dragging state
  const [draggingShape, setDraggingShape] = useState<ShapeType | null>(null);
  const [dragPos, setDragPos] = useState<{ x: number; y: number } | null>(null);

  // Slots references to measure coordinates for snap-to-fit
  const slotRefs = useRef<Record<string, HTMLDivElement | null>>({});

  // Reset board on difficulty change
  useEffect(() => {
    setPlacedShapes(new Set());
    setSelectedPiece(null);
  }, [difficulty]);

  // Check victory condition
  useEffect(() => {
    if (placedShapes.size > 0 && placedShapes.size === activeShapes.length) {
      const timer = setTimeout(() => {
        onComplete(Array.from(placedShapes));
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [placedShapes, activeShapes, onComplete]);

  // Handle successful placement
  const handlePlaceShape = (shape: ShapeType) => {
    audioManager.playSnap();
    audioManager.playPieceSuccess();
    const info = SHAPES_DATA[shape];
    audioManager.speak(`${info.name}! Great job!`);

    setPlacedShapes((prev) => new Set([...prev, shape]));
    setSelectedPiece(null);
  };

  // Tap piece in tray
  const handleTapTrayPiece = (shape: ShapeType) => {
    if (placedShapes.has(shape)) return;

    audioManager.playPop();
    const info = SHAPES_DATA[shape];

    if (toddlerAssist) {
      // Direct assist: placing directly on tap for youngest toddlers
      audioManager.speak(`${info.name}!`);
      handlePlaceShape(shape);
      return;
    }

    // Select mode
    audioManager.speak(info.name);
    setSelectedPiece(shape);
  };

  // Tap slot on wooden board
  const handleTapSlot = (targetShape: ShapeType) => {
    if (placedShapes.has(targetShape)) {
      // Re-speak shape
      audioManager.playPop();
      audioManager.speak(SHAPES_DATA[targetShape].name);
      return;
    }

    if (!selectedPiece) {
      // Toddler tapped empty slot without selecting piece
      audioManager.playPop();
      audioManager.speak(`Find the ${SHAPES_DATA[targetShape].name}!`);
      return;
    }

    if (selectedPiece === targetShape) {
      handlePlaceShape(targetShape);
    } else {
      audioManager.playGentleOops();
      audioManager.speak(`That's the ${SHAPES_DATA[targetShape].name}. Where is the ${SHAPES_DATA[selectedPiece].name}?`);
      setWobblingSlot(targetShape);
      setTimeout(() => setWobblingSlot(null), 600);
    }
  };

  // Drag handlers with forgiving snap radius
  const handlePointerDownPiece = (e: React.PointerEvent, shape: ShapeType) => {
    if (placedShapes.has(shape)) return;
    (e.target as HTMLElement).setPointerCapture?.(e.pointerId);

    setDraggingShape(shape);
    setDragPos({ x: e.clientX, y: e.clientY });
    audioManager.playPop();
    audioManager.speak(SHAPES_DATA[shape].name);
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!draggingShape) return;
    setDragPos({ x: e.clientX, y: e.clientY });
  };

  const handlePointerUp = (e: React.PointerEvent) => {
    if (!draggingShape) return;

    const shape = draggingShape;
    const clientX = e.clientX;
    const clientY = e.clientY;

    setDraggingShape(null);
    setDragPos(null);

    // Check distance to matching slot
    const slotEl = slotRefs.current[shape];
    if (slotEl) {
      const rect = slotEl.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;
      const distance = Math.hypot(clientX - centerX, clientY - centerY);

      // Very generous toddler snap radius: 110 pixels!
      if (distance < 110) {
        handlePlaceShape(shape);
        return;
      }
    }

    // Did they drop it near ANY other slot? Give gentle cue
    for (const other of activeShapes) {
      if (other !== shape && !placedShapes.has(other)) {
        const el = slotRefs.current[other];
        if (el) {
          const rect = el.getBoundingClientRect();
          const cx = rect.left + rect.width / 2;
          const cy = rect.top + rect.height / 2;
          if (Math.hypot(clientX - cx, clientY - cy) < 90) {
            audioManager.playGentleOops();
            audioManager.speak(`Almost! That's the ${SHAPES_DATA[other].name}. Look for the ${SHAPES_DATA[shape].name}!`);
            setWobblingSlot(other);
            setTimeout(() => setWobblingSlot(null), 600);
            return;
          }
        }
      }
    }
  };

  const handleReset = () => {
    audioManager.playPop();
    setPlacedShapes(new Set());
    setSelectedPiece(null);
  };

  return (
    <div
      className="relative flex flex-col items-center justify-between min-h-[calc(100vh-5rem)] p-3 md:p-6"
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
    >
      {/* Top Controls Bar */}
      <div className="w-full max-w-5xl flex flex-wrap items-center justify-between gap-3 mb-4 bg-white/80 backdrop-blur-md rounded-2xl p-3 border border-amber-200/80 shadow-xs">
        {/* Difficulty Selector */}
        <div className="flex items-center gap-1.5 p-1 bg-amber-100/60 rounded-xl">
          {(['easy', 'medium', 'hard'] as DifficultyLevel[]).map((lvl) => (
            <button
              key={lvl}
              onClick={() => {
                audioManager.playPop();
                setDifficulty(lvl);
              }}
              className={`px-3 py-1.5 text-xs sm:text-sm font-bold rounded-lg transition-all cursor-pointer ${
                difficulty === lvl
                  ? 'bg-amber-500 text-white shadow-xs'
                  : 'text-amber-900 hover:bg-amber-200/50'
              }`}
            >
              {lvl === 'easy' ? 'Starter (3)' : lvl === 'medium' ? 'Explorer (6)' : 'Champion (10)'}
            </button>
          ))}
        </div>

        {/* Status / Toddler Assistance Switch */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => {
              audioManager.playPop();
              setToddlerAssist(!toddlerAssist);
              audioManager.speak(toddlerAssist ? 'Tap to select mode' : 'One-tap auto place enabled');
            }}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs sm:text-sm font-bold transition-colors cursor-pointer border ${
              toddlerAssist
                ? 'bg-amber-100 text-amber-900 border-amber-300'
                : 'bg-slate-100 text-slate-600 border-slate-200'
            }`}
            title="Auto-snaps on single tap for younger toddlers"
          >
            <Wand2 className="w-4 h-4 text-amber-600" />
            <span>Toddler Assist: {toddlerAssist ? 'ON' : 'OFF'}</span>
          </button>

          <button
            onClick={handleReset}
            className="p-2 text-slate-600 hover:text-amber-800 hover:bg-amber-100/60 rounded-xl border border-slate-200 transition-colors cursor-pointer"
            title="Restart puzzle"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Main Wooden Puzzle Board */}
      <div className="relative w-full max-w-5xl flex-1 flex flex-col justify-center">
        <div
          className="relative rounded-3xl p-4 sm:p-8 md:p-10 shadow-2xl border-8 border-amber-800/40 overflow-hidden"
          style={{
            backgroundImage: `url(${playroomWoodBg})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
        >
          {/* Subtle warm wood tint overlay */}
          <div className="absolute inset-0 bg-amber-950/20 backdrop-contrast-105 pointer-events-none" />

          {/* Wooden board header guide */}
          <div className="relative z-10 text-center mb-6">
            <h2 className="text-xl sm:text-3xl font-black text-amber-950 font-heading drop-shadow-xs">
              Match the Shapes into Their Slots!
            </h2>
            <p className="text-amber-900 text-sm sm:text-base font-semibold drop-shadow-xs">
              {placedShapes.size === activeShapes.length ? (
                <span className="text-emerald-800 font-bold">All shapes matched! Hooray!</span>
              ) : (
                `Placed ${placedShapes.size} of ${activeShapes.length} shapes`
              )}
            </p>
          </div>

          {/* Grid of Cutout Slots */}
          <div
            className={`relative z-10 grid gap-4 sm:gap-6 md:gap-8 justify-items-center items-center ${
              activeShapes.length <= 4
                ? 'grid-cols-3 max-w-2xl mx-auto'
                : activeShapes.length <= 6
                ? 'grid-cols-3 max-w-3xl mx-auto'
                : 'grid-cols-3 sm:grid-cols-4 md:grid-cols-5'
            }`}
          >
            {activeShapes.map((shape) => {
              const isPlaced = placedShapes.has(shape);
              const isWobbling = wobblingSlot === shape;

              return (
                <div
                  key={shape}
                  ref={(el) => {
                    slotRefs.current[shape] = el;
                  }}
                  onClick={() => handleTapSlot(shape)}
                  className={`relative flex flex-col items-center justify-center p-3 sm:p-4 rounded-3xl transition-transform cursor-pointer ${
                    isPlaced
                      ? 'bg-amber-100/80 shadow-md ring-4 ring-emerald-400/80'
                      : 'bg-amber-950/30 shadow-inner hover:bg-amber-950/40 ring-2 ring-amber-900/40'
                  }`}
                  style={{ minWidth: '95px', minHeight: '95px' }}
                >
                  <ShapeGraphic
                    shape={shape}
                    variant={isPlaced ? 'placed' : 'cutout'}
                    size={activeShapes.length > 6 ? 90 : 120}
                    showFace={showFaces}
                    isWobbling={isWobbling}
                  />

                  {/* Sparkling badge when placed */}
                  {isPlaced && (
                    <div className="absolute -top-2 -right-2 bg-emerald-500 text-white rounded-full p-1 shadow-sm animate-bounce">
                      <Sparkles className="w-4 h-4" />
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Bottom Tray with Draggable & Tappable Shape Pieces */}
      <div className="w-full max-w-5xl mt-4 sm:mt-6">
        <div className="bg-white/90 backdrop-blur-md rounded-3xl p-4 sm:p-6 shadow-xl border-2 border-amber-200">
          <div className="flex items-center justify-between mb-3 px-2">
            <span className="text-xs sm:text-sm font-black text-amber-950 uppercase tracking-wider">
              {toddlerAssist ? 'Tap any piece to place it!' : 'Drag or tap a shape to play:'}
            </span>
            <span className="text-xs font-semibold text-slate-500">
              {activeShapes.length - placedShapes.size} left to place
            </span>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-6 min-h-[110px]">
            {activeShapes.map((shape) => {
              const isPlaced = placedShapes.has(shape);
              const isSelected = selectedPiece === shape;
              const isDraggingThis = draggingShape === shape;

              if (isPlaced) {
                // Dimmed placeholder to maintain layout rhythm
                return (
                  <div
                    key={shape}
                    className="opacity-20 grayscale scale-75 pointer-events-none p-2"
                  >
                    <ShapeGraphic shape={shape} size={activeShapes.length > 6 ? 75 : 95} showFace={false} />
                  </div>
                );
              }

              return (
                <div
                  key={shape}
                  onPointerDown={(e) => handlePointerDownPiece(e, shape)}
                  onClick={() => handleTapTrayPiece(shape)}
                  className={`p-2 rounded-2xl cursor-grab active:cursor-grabbing transition-transform hover:scale-105 active:scale-95 touch-none ${
                    isDraggingThis ? 'opacity-30' : 'opacity-100'
                  }`}
                >
                  <ShapeGraphic
                    shape={shape}
                    variant="piece"
                    size={activeShapes.length > 6 ? 85 : 110}
                    showFace={showFaces}
                    showLabel={true}
                    isSelected={isSelected}
                  />
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Floating Drag Avatar follows cursor/touch */}
      {draggingShape && dragPos && (
        <div
          className="fixed pointer-events-none z-50 -translate-x-1/2 -translate-y-1/2"
          style={{ left: `${dragPos.x}px`, top: `${dragPos.y}px` }}
        >
          <ShapeGraphic
            shape={draggingShape}
            variant="piece"
            size={130}
            showFace={showFaces}
            isDragging={true}
          />
        </div>
      )}
    </div>
  );
};
