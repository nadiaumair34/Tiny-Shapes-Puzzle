import React, { useState, useEffect } from 'react';
import { ShapeType, TangramPicture, TangramPiece } from '../../types/game';
import { TANGRAM_PICTURES } from '../../data/tangramPictures';
import { SHAPES_DATA } from '../../data/shapes';
import { ShapeGraphic } from '../ShapeGraphic';
import { audioManager } from '../../utils/audio';
import { Sparkles, Wand2, RotateCcw } from 'lucide-react';

interface TangramModeProps {
  onComplete: (shapes: ShapeType[]) => void;
  showFaces: boolean;
}

export const TangramMode: React.FC<TangramModeProps> = ({ onComplete, showFaces }) => {
  const [selectedPicIndex, setSelectedPicIndex] = useState<number>(0);
  const [placedPieceIds, setPlacedPieceIds] = useState<Set<string>>(new Set());
  const [selectedTrayShape, setSelectedTrayShape] = useState<ShapeType | null>(null);
  const [toddlerAssist, setToddlerAssist] = useState<boolean>(true);

  const currentPicture: TangramPicture = TANGRAM_PICTURES[selectedPicIndex] || TANGRAM_PICTURES[0];
  const allPlaced = placedPieceIds.size === currentPicture.pieces.length;

  useEffect(() => {
    setPlacedPieceIds(new Set());
    setSelectedTrayShape(null);
    audioManager.speak(`Let's build a ${currentPicture.title}!`);
  }, [selectedPicIndex]);

  useEffect(() => {
    if (allPlaced && currentPicture.pieces.length > 0) {
      const distinctShapes = Array.from(new Set(currentPicture.pieces.map((p) => p.shapeType)));
      const timer = setTimeout(() => {
        audioManager.speak(`Magnificent! You built the ${currentPicture.title}!`);
        onComplete(distinctShapes);
      }, 700);
      return () => clearTimeout(timer);
    }
  }, [allPlaced, currentPicture, onComplete]);

  // Handle piece placement
  const handlePlacePiece = (piece: TangramPiece) => {
    if (placedPieceIds.has(piece.id)) return;

    audioManager.playSnap();
    audioManager.playPieceSuccess();
    audioManager.speak(`${SHAPES_DATA[piece.shapeType].name}! Placed the ${piece.label}!`);

    setPlacedPieceIds((prev) => new Set([...prev, piece.id]));
    setSelectedTrayShape(null);
  };

  // Tap shape in tray
  const handleTapTray = (shape: ShapeType) => {
    audioManager.playPop();
    const info = SHAPES_DATA[shape];

    // Find the first unfilled piece of this shape type
    const unfilledPiece = currentPicture.pieces.find(
      (p) => p.shapeType === shape && !placedPieceIds.has(p.id)
    );

    if (!unfilledPiece) {
      audioManager.speak(`All ${info.name}s are already placed!`);
      return;
    }

    if (toddlerAssist) {
      // Direct assist: fly to target slot
      handlePlacePiece(unfilledPiece);
    } else {
      setSelectedTrayShape(shape);
      audioManager.speak(`${info.name}! Now tap the outline on the picture.`);
    }
  };

  // Tap slot on tangram canvas
  const handleTapCanvasPiece = (piece: TangramPiece) => {
    if (placedPieceIds.has(piece.id)) {
      audioManager.playPop();
      audioManager.speak(piece.label);
      return;
    }

    if (!selectedTrayShape) {
      audioManager.playPop();
      audioManager.speak(`Find a ${SHAPES_DATA[piece.shapeType].name} at the bottom!`);
      return;
    }

    if (selectedTrayShape === piece.shapeType) {
      handlePlacePiece(piece);
    } else {
      audioManager.playGentleOops();
      audioManager.speak(`That needs a ${SHAPES_DATA[piece.shapeType].name}!`);
    }
  };

  const handleReset = () => {
    audioManager.playPop();
    setPlacedPieceIds(new Set());
    setSelectedTrayShape(null);
  };

  // Remaining shapes needed for the tray
  const remainingPieces = currentPicture.pieces.filter((p) => !placedPieceIds.has(p.id));

  return (
    <div className="relative flex flex-col items-center justify-between min-h-[calc(100vh-5rem)] p-3 md:p-6">
      {/* Picture Selector & Toddler Assist Controls */}
      <div className="w-full max-w-4xl flex flex-wrap items-center justify-between gap-3 bg-white/90 backdrop-blur-md rounded-2xl p-3 border border-amber-200/80 shadow-xs mb-3">
        {/* Pictures Tabs */}
        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-1">
          {TANGRAM_PICTURES.map((pic, idx) => {
            const isSelected = selectedPicIndex === idx;
            return (
              <button
                key={pic.id}
                onClick={() => {
                  audioManager.playPop();
                  setSelectedPicIndex(idx);
                }}
                className={`px-3 py-1.5 text-xs sm:text-sm font-bold rounded-xl whitespace-nowrap transition-all cursor-pointer ${
                  isSelected
                    ? 'bg-amber-500 text-white shadow-xs'
                    : 'bg-amber-50 text-amber-900 hover:bg-amber-100'
                }`}
              >
                {pic.title}
              </button>
            );
          })}
        </div>

        {/* Controls */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => {
              audioManager.playPop();
              setToddlerAssist(!toddlerAssist);
            }}
            className={`flex items-center gap-1 px-3 py-1.5 rounded-xl text-xs sm:text-sm font-bold transition-colors cursor-pointer border ${
              toddlerAssist
                ? 'bg-amber-100 text-amber-900 border-amber-300'
                : 'bg-slate-100 text-slate-600 border-slate-200'
            }`}
          >
            <Wand2 className="w-4 h-4 text-amber-600" />
            <span>Assist: {toddlerAssist ? 'ON' : 'OFF'}</span>
          </button>
          <button
            onClick={handleReset}
            className="p-2 text-slate-500 hover:text-amber-800 hover:bg-amber-100 rounded-xl transition-colors cursor-pointer"
            title="Reset Picture"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Main Tangram Picture Canvas */}
      <div className="relative flex-1 flex flex-col items-center justify-center my-2 w-full max-w-3xl">
        <div className="relative w-full aspect-[4/3] max-w-[500px] bg-sky-50 rounded-3xl p-4 shadow-xl border-4 border-amber-200 overflow-hidden">
          {/* Subtle playful backdrop */}
          <div className="absolute inset-0 bg-radial from-amber-100/50 via-sky-50 to-sky-100/60 pointer-events-none" />

          {/* Picture SVG Canvas */}
          <svg
            viewBox="0 0 400 320"
            className="w-full h-full relative z-10 overflow-visible"
          >
            {currentPicture.pieces.map((piece) => {
              const isPlaced = placedPieceIds.has(piece.id);
              const data = SHAPES_DATA[piece.shapeType];

              return (
                <g
                  key={piece.id}
                  onClick={() => handleTapCanvasPiece(piece)}
                  className="cursor-pointer transition-transform duration-200"
                  transform={`translate(${piece.x}, ${piece.y}) rotate(${piece.rotation || 0} ${
                    piece.width / 2
                  } ${piece.height / 2})`}
                >
                  {isPlaced ? (
                    // Solid Placed Piece
                    <foreignObject width={piece.width} height={piece.height}>
                      <div className="w-full h-full animate-in zoom-in-75">
                        <ShapeGraphic
                          shape={piece.shapeType}
                          variant="placed"
                          size="100%"
                          showFace={showFaces}
                        />
                      </div>
                    </foreignObject>
                  ) : (
                    // Dashed Silhouette Slot
                    <foreignObject width={piece.width} height={piece.height}>
                      <div className="w-full h-full hover:scale-105 transition-transform">
                        <ShapeGraphic
                          shape={piece.shapeType}
                          variant="outline"
                          size="100%"
                          showFace={false}
                        />
                      </div>
                    </foreignObject>
                  )}
                </g>
              );
            })}
          </svg>

          {/* Celebratory badge if whole picture is complete */}
          {allPlaced && (
            <div className="absolute top-4 right-4 bg-emerald-500 text-white rounded-2xl px-4 py-2 shadow-lg flex items-center gap-2 animate-bounce z-20">
              <Sparkles className="w-5 h-5" />
              <span className="font-extrabold text-sm font-heading">{currentPicture.title} Complete!</span>
            </div>
          )}
        </div>
      </div>

      {/* Piece Tray */}
      <div className="w-full max-w-3xl mt-3">
        <div className="bg-white/95 rounded-3xl p-4 shadow-xl border-2 border-amber-200 text-center">
          <span className="text-xs sm:text-sm font-black text-amber-950 uppercase tracking-wider block mb-3">
            {toddlerAssist ? 'Tap shapes to build the picture:' : 'Pick a shape to place on the outline:'}
          </span>

          <div className="flex flex-wrap items-center justify-center gap-4 min-h-[90px]">
            {remainingPieces.length === 0 ? (
              <div className="py-2 text-emerald-700 font-extrabold text-base flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-emerald-500" />
                <span>All shapes placed! Tap another picture above to build more!</span>
              </div>
            ) : (
              remainingPieces.map((piece) => {
                const isSelected = selectedTrayShape === piece.shapeType;
                return (
                  <button
                    key={piece.id}
                    onClick={() => handleTapTray(piece.shapeType)}
                    className={`p-2 rounded-2xl transition-transform hover:scale-110 active:scale-95 cursor-pointer ${
                      isSelected ? 'ring-4 ring-amber-400 scale-105' : ''
                    }`}
                  >
                    <ShapeGraphic
                      shape={piece.shapeType}
                      variant="piece"
                      size={80}
                      showFace={showFaces}
                      showLabel={true}
                    />
                  </button>
                );
              })
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
