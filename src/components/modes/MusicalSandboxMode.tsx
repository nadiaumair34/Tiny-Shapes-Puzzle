import React, { useState } from 'react';
import { ShapeType } from '../../types/game';
import { SHAPES_DATA } from '../../data/shapes';
import { ShapeGraphic } from '../ShapeGraphic';
import { audioManager } from '../../utils/audio';
import { Music, Play, RotateCcw } from 'lucide-react';

interface MusicalSandboxModeProps {
  showFaces: boolean;
}

// 8 Musical Xylophone Shapes
const MUSICAL_SHAPES: ShapeType[] = [
  'circle',    // C4
  'square',    // D4
  'triangle',  // E4
  'star',      // F4
  'heart',     // G4
  'diamond',   // A4
  'hexagon',   // B4
  'oval',      // C5
];

// Twinkle Twinkle Song sequence for toddler sing-along
const TWINKLE_SONG: { shape: ShapeType; noteName: string }[] = [
  { shape: 'circle', noteName: 'Do' },
  { shape: 'circle', noteName: 'Do' },
  { shape: 'heart', noteName: 'Sol' },
  { shape: 'heart', noteName: 'Sol' },
  { shape: 'diamond', noteName: 'La' },
  { shape: 'diamond', noteName: 'La' },
  { shape: 'heart', noteName: 'Sol' },
  { shape: 'star', noteName: 'Fa' },
  { shape: 'star', noteName: 'Fa' },
  { shape: 'triangle', noteName: 'Mi' },
  { shape: 'triangle', noteName: 'Mi' },
  { shape: 'square', noteName: 'Re' },
  { shape: 'square', noteName: 'Re' },
  { shape: 'circle', noteName: 'Do' },
];

export const MusicalSandboxMode: React.FC<MusicalSandboxModeProps> = ({ showFaces }) => {
  const [activeShape, setActiveShape] = useState<ShapeType | null>(null);
  const [isPlayingSong, setIsPlayingSong] = useState<boolean>(false);
  const [currentSongStep, setCurrentSongStep] = useState<number>(-1);
  const [audioFeedbackMode, setAudioFeedbackMode] = useState<'note' | 'name'>('note');

  const handleTapShape = (shape: ShapeType) => {
    setActiveShape(shape);
    const data = SHAPES_DATA[shape];

    if (audioFeedbackMode === 'note') {
      audioManager.playNote(data.noteFreq);
    } else {
      audioManager.playPop();
      audioManager.speak(data.name);
    }

    setTimeout(() => {
      setActiveShape(null);
    }, 300);
  };

  // Play Twinkle Twinkle nursery rhyme automatically
  const handlePlayTwinkle = () => {
    if (isPlayingSong) return;
    setIsPlayingSong(true);
    audioManager.speak('Listen to the shapes play Twinkle Twinkle!');

    TWINKLE_SONG.forEach((step, index) => {
      setTimeout(() => {
        setCurrentSongStep(index);
        setActiveShape(step.shape);
        audioManager.playNote(SHAPES_DATA[step.shape].noteFreq);

        setTimeout(() => {
          setActiveShape(null);
        }, 320);

        if (index === TWINKLE_SONG.length - 1) {
          setTimeout(() => {
            setIsPlayingSong(false);
            setCurrentSongStep(-1);
            audioManager.playCelebrationFanfare();
            audioManager.speak('Now it is your turn to play!');
          }, 600);
        }
      }, 1200 + index * 550);
    });
  };

  return (
    <div className="relative flex flex-col items-center justify-between min-h-[calc(100vh-5rem)] p-3 md:p-6">
      {/* Control Header */}
      <div className="w-full max-w-5xl flex flex-wrap items-center justify-between gap-3 bg-white/90 backdrop-blur-md rounded-2xl p-3 border border-amber-200/80 shadow-xs mb-4">
        {/* Sound Mode Toggle */}
        <div className="flex items-center gap-1.5 p-1 bg-amber-100/60 rounded-xl">
          <button
            onClick={() => {
              audioManager.playPop();
              setAudioFeedbackMode('note');
            }}
            className={`px-3 py-1.5 text-xs sm:text-sm font-bold rounded-lg transition-all cursor-pointer ${
              audioFeedbackMode === 'note'
                ? 'bg-amber-500 text-white shadow-xs'
                : 'text-amber-900 hover:bg-amber-200/50'
            }`}
          >
            Musical Notes (Xylophone)
          </button>
          <button
            onClick={() => {
              audioManager.playPop();
              setAudioFeedbackMode('name');
            }}
            className={`px-3 py-1.5 text-xs sm:text-sm font-bold rounded-lg transition-all cursor-pointer ${
              audioFeedbackMode === 'name'
                ? 'bg-amber-500 text-white shadow-xs'
                : 'text-amber-900 hover:bg-amber-200/50'
            }`}
          >
            Spoken Names
          </button>
        </div>

        {/* Nursery Song Play Button */}
        <div className="flex items-center gap-2">
          <button
            onClick={handlePlayTwinkle}
            disabled={isPlayingSong}
            className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-500 to-indigo-600 hover:from-purple-600 hover:to-indigo-700 text-white font-bold rounded-xl text-xs sm:text-sm shadow-sm transition-all active:scale-95 disabled:opacity-50 cursor-pointer"
          >
            {isPlayingSong ? <Music className="w-4 h-4 animate-spin" /> : <Play className="w-4 h-4 fill-current" />}
            <span>{isPlayingSong ? 'Playing Song...' : 'Play "Twinkle Twinkle"'}</span>
          </button>
        </div>
      </div>

      {/* Main Interactive Musical Sandbox Stage */}
      <div className="relative flex-1 flex flex-col items-center justify-center my-auto w-full max-w-6xl">
        <div className="relative w-full bg-gradient-to-b from-amber-50 via-white to-amber-100/60 rounded-3xl p-6 md:p-10 shadow-2xl border-4 border-amber-200 text-center">
          <div className="mb-6">
            <h2 className="text-2xl sm:text-4xl font-black text-amber-950 font-heading tracking-tight mb-1">
              Squishy Musical Shapes
            </h2>
            <p className="text-slate-600 font-semibold text-sm sm:text-base">
              Tap or click any shape to hear it sing and bounce!
            </p>
          </div>

          {/* 8 Giant Interactive Musical Shapes Row */}
          <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-8 gap-4 justify-items-center">
            {MUSICAL_SHAPES.map((shape, idx) => {
              const data = SHAPES_DATA[shape];
              const isTapped = activeShape === shape;
              const noteNames = ['Do (C)', 'Re (D)', 'Mi (E)', 'Fa (F)', 'Sol (G)', 'La (A)', 'Ti (B)', 'High Do'];

              return (
                <div key={shape} className="flex flex-col items-center">
                  <button
                    onClick={() => handleTapShape(shape)}
                    className={`relative p-3 rounded-3xl transition-transform duration-150 cursor-pointer focus:outline-none ${
                      isTapped
                        ? 'scale-125 -translate-y-4 filter brightness-110 ring-4 ring-amber-400'
                        : 'hover:scale-110 active:scale-95'
                    }`}
                  >
                    <ShapeGraphic
                      shape={shape}
                      variant="piece"
                      size={100}
                      showFace={showFaces}
                    />

                    {/* Elastic sound ring animation on tap */}
                    {isTapped && (
                      <span className="absolute inset-0 rounded-full border-4 border-amber-400/80 animate-ping pointer-events-none" />
                    )}
                  </button>

                  {/* Note & Shape Name */}
                  <span className="mt-2 text-xs font-black text-slate-700 tracking-wide">
                    {data.name}
                  </span>
                  <span
                    className="text-[10px] font-extrabold px-2 py-0.5 rounded-full mt-1"
                    style={{
                      backgroundColor: `${data.primaryColor}20`,
                      color: data.textColor,
                    }}
                  >
                    {noteNames[idx]}
                  </span>
                </div>
              );
            })}
          </div>

          {/* Song indicator step */}
          {isPlayingSong && currentSongStep >= 0 && (
            <div className="mt-8 inline-flex items-center gap-2 px-5 py-2.5 bg-purple-100 rounded-full text-purple-900 font-black text-sm animate-pulse">
              <Music className="w-4 h-4 text-purple-600" />
              <span>
                Playing note {currentSongStep + 1} of {TWINKLE_SONG.length}: {TWINKLE_SONG[currentSongStep].noteName}
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Gentle Tips */}
      <div className="text-center mt-4">
        <p className="text-xs sm:text-sm font-semibold text-slate-500">
          Tip: Switch to "Spoken Names" to hear how each shape is called!
        </p>
      </div>
    </div>
  );
};
