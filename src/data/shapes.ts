import { ShapeDefinition, ShapeType } from '../types/game';

export const SHAPES_DATA: Record<ShapeType, ShapeDefinition> = {
  circle: {
    id: 'circle',
    name: 'Circle',
    colorName: 'Sunny Gold',
    sides: 0,
    corners: 0,
    primaryColor: '#F59E0B',
    gradientFrom: '#FBBF24',
    gradientTo: '#D97706',
    borderColor: '#B45309',
    textColor: '#78350F',
    funFact: 'Round and smooth like the sun or a giant cookie!',
    noteFreq: 261.63, // C4
  },
  square: {
    id: 'square',
    name: 'Square',
    colorName: 'Ocean Blue',
    sides: 4,
    corners: 4,
    primaryColor: '#0EA5E9',
    gradientFrom: '#38BDF8',
    gradientTo: '#0284C7',
    borderColor: '#0369A1',
    textColor: '#0C4A6E',
    funFact: 'Four straight sides that are all the exact same length!',
    noteFreq: 293.66, // D4
  },
  triangle: {
    id: 'triangle',
    name: 'Triangle',
    colorName: 'Grass Green',
    sides: 3,
    corners: 3,
    primaryColor: '#10B981',
    gradientFrom: '#34D399',
    gradientTo: '#059669',
    borderColor: '#047857',
    textColor: '#064E3B',
    funFact: 'Three pointy corners, like a slice of delicious pizza!',
    noteFreq: 329.63, // E4
  },
  star: {
    id: 'star',
    name: 'Star',
    colorName: 'Starlight Yellow',
    sides: 10,
    corners: 5,
    primaryColor: '#EAB308',
    gradientFrom: '#FDE047',
    gradientTo: '#CA8A04',
    borderColor: '#A16207',
    textColor: '#713F12',
    funFact: 'Twinkle twinkle! Has 5 sparkling points reaching outward.',
    noteFreq: 349.23, // F4
  },
  heart: {
    id: 'heart',
    name: 'Heart',
    colorName: 'Cherry Red',
    sides: 2,
    corners: 1,
    primaryColor: '#EF4444',
    gradientFrom: '#F87171',
    gradientTo: '#DC2626',
    borderColor: '#B91C1C',
    textColor: '#7F1D1D',
    funFact: 'Two curvy bumps on top and one point on bottom! Means love!',
    noteFreq: 392.0, // G4
  },
  diamond: {
    id: 'diamond',
    name: 'Diamond',
    colorName: 'Royal Purple',
    sides: 4,
    corners: 4,
    primaryColor: '#8B5CF6',
    gradientFrom: '#A78BFA',
    gradientTo: '#7C3AED',
    borderColor: '#6D28D9',
    textColor: '#4C1D95',
    funFact: 'Looks like a square standing up on its tip-toes, like a kite!',
    noteFreq: 440.0, // A4
  },
  hexagon: {
    id: 'hexagon',
    name: 'Hexagon',
    colorName: 'Sweet Tangerine',
    sides: 6,
    corners: 6,
    primaryColor: '#F97316',
    gradientFrom: '#FB923C',
    gradientTo: '#EA580C',
    borderColor: '#C2410C',
    textColor: '#7C2D12',
    funFact: 'Six cool sides, just like bees build in their honeycombs!',
    noteFreq: 493.88, // B4
  },
  oval: {
    id: 'oval',
    name: 'Oval',
    colorName: 'Cotton Pink',
    sides: 0,
    corners: 0,
    primaryColor: '#EC4899',
    gradientFrom: '#F472B6',
    gradientTo: '#DB2777',
    borderColor: '#BE185D',
    textColor: '#831843',
    funFact: 'Like a stretched circle! Looks just like an easter egg.',
    noteFreq: 523.25, // C5
  },
  crescent: {
    id: 'crescent',
    name: 'Moon Crescent',
    colorName: 'Twilight Indigo',
    sides: 2,
    corners: 2,
    primaryColor: '#6366F1',
    gradientFrom: '#818CF8',
    gradientTo: '#4F46E5',
    borderColor: '#4338CA',
    textColor: '#312E81',
    funFact: 'Curved like the glowing night moon smiling in the sky!',
    noteFreq: 587.33, // D5
  },
  pentagon: {
    id: 'pentagon',
    name: 'Pentagon',
    colorName: 'Mint Teal',
    sides: 5,
    corners: 5,
    primaryColor: '#14B8A6',
    gradientFrom: '#2DD4BF',
    gradientTo: '#0D9488',
    borderColor: '#0F766E',
    textColor: '#134E4A',
    funFact: 'Five straight walls, like a tiny cozy birdhouse!',
    noteFreq: 659.25, // E5
  },
};

export const ALL_SHAPE_KEYS = Object.keys(SHAPES_DATA) as ShapeType[];

export const DIFFICULTY_PRESETS: Record<string, { label: string; shapes: ShapeType[]; description: string }> = {
  easy: {
    label: 'Starter (3 Shapes)',
    shapes: ['circle', 'square', 'triangle'],
    description: 'Perfect for little hands starting to explore basic shapes',
  },
  medium: {
    label: 'Explorer (6 Shapes)',
    shapes: ['circle', 'square', 'triangle', 'star', 'heart', 'diamond'],
    description: 'Adds stars, hearts, and diamonds for fun recognition',
  },
  hard: {
    label: 'Champion (10 Shapes)',
    shapes: ['circle', 'square', 'triangle', 'star', 'heart', 'diamond', 'hexagon', 'oval', 'crescent', 'pentagon'],
    description: 'All 10 colorful shapes for the master shape sorter!',
  },
};
