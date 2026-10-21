export type ShapeType =
  | 'circle'
  | 'square'
  | 'triangle'
  | 'star'
  | 'heart'
  | 'diamond'
  | 'hexagon'
  | 'oval'
  | 'crescent'
  | 'pentagon';

export interface ShapeDefinition {
  id: ShapeType;
  name: string;
  colorName: string;
  sides: number;
  corners: number;
  primaryColor: string; // Hex
  gradientFrom: string;
  gradientTo: string;
  borderColor: string;
  textColor: string;
  funFact: string;
  noteFreq: number; // Hz for xylophone sandbox
}

export type GameMode =
  | 'wooden_puzzle' // Classic board with cutouts
  | 'shape_sorter'  // Drop into sorter bucket chute
  | 'find_shape'    // Audio prompt "Can you find the star?"
  | 'tangram'       // Picture builder (Rocket, House, Train)
  | 'musical_box';  // Free-play squishy xylophone sandbox

export type DifficultyLevel = 'easy' | 'medium' | 'hard';

export interface TangramPiece {
  id: string;
  shapeType: ShapeType;
  x: number; // percentage in viewBox
  y: number;
  width: number;
  height: number;
  rotation?: number;
  color?: string;
  label: string;
}

export interface TangramPicture {
  id: string;
  title: string;
  description: string;
  pieces: TangramPiece[];
}
