/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { GameMode, ShapeType } from './types/game';
import { audioManager } from './utils/audio';
import { TopBar } from './components/TopBar';
import { WoodenPuzzleMode } from './components/modes/WoodenPuzzleMode';
import { ShapeSorterMode } from './components/modes/ShapeSorterMode';
import { FindShapeMode } from './components/modes/FindShapeMode';
import { TangramMode } from './components/modes/TangramMode';
import { MusicalSandboxMode } from './components/modes/MusicalSandboxMode';
import { CelebrationModal } from './components/CelebrationModal';
import { ParentGuideModal } from './components/ParentGuideModal';
import kidsPlayfulBg from './assets/images/kids_playful_background_1792492558249.jpg';

export default function App() {
  const [currentMode, setCurrentMode] = useState<GameMode>('wooden_puzzle');
  const [soundEnabled, setSoundEnabled] = useState<boolean>(true);
  const [voiceEnabled, setVoiceEnabled] = useState<boolean>(true);
  const [showFaces, setShowFaces] = useState<boolean>(true);
  const [parentGuideOpen, setParentGuideOpen] = useState<boolean>(false);
  const [backgroundIntensity, setBackgroundIntensity] = useState<'vivid' | 'soft'>('vivid');

  // Celebration modal state
  const [celebration, setCelebration] = useState<{
    isOpen: boolean;
    title: string;
    subtitle: string;
    completedShapes: ShapeType[];
  }>({
    isOpen: false,
    title: 'Hooray! You Did It!',
    subtitle: 'You matched all the colorful shapes!',
    completedShapes: [],
  });

  // Sync sound manager settings
  useEffect(() => {
    audioManager.soundEnabled = soundEnabled;
  }, [soundEnabled]);

  useEffect(() => {
    audioManager.voiceEnabled = voiceEnabled;
  }, [voiceEnabled]);

  const handleToggleSound = () => {
    setSoundEnabled((prev) => !prev);
  };

  const handleToggleVoice = () => {
    setVoiceEnabled((prev) => !prev);
  };

  const handleToggleFaces = () => {
    setShowFaces((prev) => !prev);
  };

  // Called when a puzzle mode is finished
  const handleModeComplete = (shapes: ShapeType[]) => {
    setCelebration({
      isOpen: true,
      title: 'Hooray! Puzzle Master!',
      subtitle: 'Great job exploring and matching all the shapes!',
      completedShapes: shapes,
    });
  };

  const handleCloseCelebration = () => {
    setCelebration((prev) => ({ ...prev, isOpen: false }));
  };

  // Switch to next mode on celebration completion
  const handleNextMode = () => {
    setCelebration((prev) => ({ ...prev, isOpen: false }));
    const modes: GameMode[] = ['wooden_puzzle', 'shape_sorter', 'find_shape', 'tangram', 'musical_box'];
    const currentIndex = modes.indexOf(currentMode);
    const nextIndex = (currentIndex + 1) % modes.length;
    setCurrentMode(modes[nextIndex]);
  };

  return (
    <div className="relative min-h-screen flex flex-col text-slate-800 selection:bg-amber-200 overflow-x-hidden">
      {/* Whimsical Kids Playroom Background Layer */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <img
          src={kidsPlayfulBg}
          alt="Whimsical kids playroom scenery with rainbow, clouds, and hot air balloons"
          className="w-full h-full object-cover object-bottom"
          referrerPolicy="no-referrer"
        />
        {/* Soft atmospheric scrim ensuring maximum readability for games */}
        <div
          className={`absolute inset-0 transition-opacity duration-300 ${
            backgroundIntensity === 'vivid'
              ? 'bg-gradient-to-b from-white/60 via-white/35 to-amber-50/45 backdrop-blur-[0.5px]'
              : 'bg-white/75 backdrop-blur-[2px]'
          }`}
        />
      </div>

      {/* Floating Whimsical Background Elements for Toddler Delight */}
      <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
        {/* Gentle floating cloud top-left */}
        <div className="absolute top-20 left-6 opacity-60 animate-float-cloud">
          <svg width="80" height="45" viewBox="0 0 100 60" fill="white">
            <path d="M 20 40 A 15 15 0 0 1 35 20 A 20 20 0 0 1 70 20 A 15 15 0 0 1 85 40 A 10 10 0 0 1 75 55 L 25 55 A 10 10 0 0 1 20 40 Z" />
          </svg>
        </div>

        {/* Gentle floating cloud top-right */}
        <div
          className="absolute top-28 right-12 opacity-50 animate-float-cloud"
          style={{ animationDelay: '-4s' }}
        >
          <svg width="95" height="55" viewBox="0 0 100 60" fill="white">
            <path d="M 20 40 A 15 15 0 0 1 35 20 A 20 20 0 0 1 70 20 A 15 15 0 0 1 85 40 A 10 10 0 0 1 75 55 L 25 55 A 10 10 0 0 1 20 40 Z" />
          </svg>
        </div>

        {/* Twinkling star left */}
        <div className="absolute top-44 left-1/4 opacity-75 animate-gentle-twinkle">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="#FBBF24">
            <polygon points="12,2 15,9 22,9 17,14 19,21 12,17 5,21 7,14 2,9 9,9" />
          </svg>
        </div>

        {/* Twinkling star right */}
        <div
          className="absolute top-36 right-1/4 opacity-75 animate-gentle-twinkle"
          style={{ animationDelay: '-1.5s' }}
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="#FBBF24">
            <polygon points="12,2 15,9 22,9 17,14 19,21 12,17 5,21 7,14 2,9 9,9" />
          </svg>
        </div>
      </div>

      {/* 3-Zone Top Navigation Bar */}
      <TopBar
        currentMode={currentMode}
        onSelectMode={(mode) => {
          setCelebration((prev) => ({ ...prev, isOpen: false }));
          setCurrentMode(mode);
        }}
        soundEnabled={soundEnabled}
        onToggleSound={handleToggleSound}
        voiceEnabled={voiceEnabled}
        onToggleVoice={handleToggleVoice}
        onOpenParentGuide={() => setParentGuideOpen(true)}
      />

      {/* Main Game Stage Container */}
      <main className="relative z-10 flex-1 flex flex-col">
        {currentMode === 'wooden_puzzle' && (
          <WoodenPuzzleMode onComplete={handleModeComplete} showFaces={showFaces} />
        )}

        {currentMode === 'shape_sorter' && (
          <ShapeSorterMode onComplete={handleModeComplete} showFaces={showFaces} />
        )}

        {currentMode === 'find_shape' && (
          <FindShapeMode onComplete={handleModeComplete} showFaces={showFaces} />
        )}

        {currentMode === 'tangram' && (
          <TangramMode onComplete={handleModeComplete} showFaces={showFaces} />
        )}

        {currentMode === 'musical_box' && (
          <MusicalSandboxMode showFaces={showFaces} />
        )}
      </main>

      {/* Victory Celebration Modal */}
      <CelebrationModal
        isOpen={celebration.isOpen}
        onPlayAgain={handleCloseCelebration}
        onNextLevel={handleNextMode}
        title={celebration.title}
        subtitle={celebration.subtitle}
        completedShapes={celebration.completedShapes}
      />

      {/* Educational Guide Modal for Parents & Teachers */}
      <ParentGuideModal
        isOpen={parentGuideOpen}
        onClose={() => setParentGuideOpen(false)}
        showFaces={showFaces}
        onToggleFaces={handleToggleFaces}
        backgroundIntensity={backgroundIntensity}
        onToggleBackgroundIntensity={() =>
          setBackgroundIntensity((prev) => (prev === 'vivid' ? 'soft' : 'vivid'))
        }
      />
    </div>
  );
}

