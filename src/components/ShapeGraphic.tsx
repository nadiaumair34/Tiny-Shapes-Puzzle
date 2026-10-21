import React from 'react';
import { ShapeType } from '../types/game';
import { SHAPES_DATA } from '../data/shapes';

interface ShapeGraphicProps {
  shape: ShapeType;
  variant?: 'piece' | 'cutout' | 'placed' | 'outline' | 'mini';
  size?: number | string;
  showFace?: boolean;
  showLabel?: boolean;
  className?: string;
  isDragging?: boolean;
  isSelected?: boolean;
  isWobbling?: boolean;
  customColor?: string;
}

export const ShapeGraphic: React.FC<ShapeGraphicProps> = ({
  shape,
  variant = 'piece',
  size = 120,
  showFace = true,
  showLabel = false,
  className = '',
  isDragging = false,
  isSelected = false,
  isWobbling = false,
  customColor,
}) => {
  const data = SHAPES_DATA[shape] || SHAPES_DATA.circle;
  const isCutout = variant === 'cutout';
  const isPlaced = variant === 'placed';
  const isOutline = variant === 'outline';
  const isPiece = variant === 'piece';

  // Base path / shape geometry in 100x100 viewBox
  const renderShapePath = () => {
    switch (shape) {
      case 'circle':
        return <circle cx="50" cy="50" r="44" />;

      case 'square':
        return <rect x="8" y="8" width="84" height="84" rx="14" ry="14" />;

      case 'triangle':
        // Rounded corners triangle
        return (
          <path d="M 50 10 L 92 82 A 8 8 0 0 1 85 92 L 15 92 A 8 8 0 0 1 8 82 Z" />
        );

      case 'star':
        // 5-point star with soft points
        return (
          <path d="M 50 8 L 62 34 L 91 37 L 69 57 L 76 86 L 50 71 L 24 86 L 31 57 L 9 37 L 38 34 Z" strokeLinejoin="round" />
        );

      case 'heart':
        return (
          <path d="M 50 88 C 20 68, 6 48, 6 30 C 6 16, 17 6, 31 6 C 40 6, 46 11, 50 18 C 54 11, 60 6, 69 6 C 83 6, 94 16, 94 30 C 94 48, 80 68, 50 88 Z" />
        );

      case 'diamond':
        return (
          <path d="M 50 8 L 92 50 L 50 92 L 8 50 Z" strokeLinejoin="round" />
        );

      case 'hexagon':
        return (
          <path d="M 50 8 L 88 28 L 88 72 L 50 92 L 12 72 L 12 28 Z" strokeLinejoin="round" />
        );

      case 'oval':
        return <ellipse cx="50" cy="50" rx="44" ry="32" />;

      case 'crescent':
        return (
          <path d="M 68 10 C 35 15, 20 40, 26 70 C 32 90, 52 95, 68 90 C 44 80, 42 36, 68 10 Z" strokeLinejoin="round" />
        );

      case 'pentagon':
        return (
          <path d="M 50 8 L 90 38 L 75 88 L 25 88 L 10 38 Z" strokeLinejoin="round" />
        );

      default:
        return <circle cx="50" cy="50" r="44" />;
    }
  };

  // Cute smiling toddler face
  const renderFace = () => {
    if (!showFace || isCutout || isOutline) return null;

    // Adjust face Y center slightly for shapes where centroid differs
    let faceYOffset = 0;
    if (shape === 'triangle') faceYOffset = 10;
    if (shape === 'heart') faceYOffset = -4;
    if (shape === 'star') faceYOffset = 2;

    return (
      <g transform={`translate(0, ${faceYOffset})`}>
        {/* Left Eye */}
        <circle cx="39" cy="46" r="4.2" fill="#1E293B" />
        <circle cx="37.8" cy="44.2" r="1.5" fill="#FFFFFF" />

        {/* Right Eye */}
        <circle cx="61" cy="46" r="4.2" fill="#1E293B" />
        <circle cx="59.8" cy="44.2" r="1.5" fill="#FFFFFF" />

        {/* Cheerful Happy Smile */}
        <path
          d="M 43 54 Q 50 62 57 54"
          fill="none"
          stroke="#1E293B"
          strokeWidth="3.2"
          strokeLinecap="round"
        />

        {/* Cute Rosy Cheeks */}
        <ellipse cx="32" cy="52" rx="4.5" ry="2.8" fill="#F43F5E" opacity="0.45" />
        <ellipse cx="68" cy="52" rx="4.5" ry="2.8" fill="#F43F5E" opacity="0.45" />
      </g>
    );
  };

  const gradId = `grad-${shape}-${Math.random().toString(36).substr(2, 6)}`;
  const bevelId = `bevel-${shape}-${Math.random().toString(36).substr(2, 6)}`;

  return (
    <div
      className={`relative inline-flex flex-col items-center justify-center select-none transition-transform duration-150 ${
        isDragging ? 'scale-110 opacity-90 drop-shadow-2xl' : ''
      } ${isSelected ? 'scale-105 ring-4 ring-amber-400 rounded-3xl' : ''} ${
        isWobbling ? 'animate-gentle-wobble' : ''
      } ${className}`}
      style={{
        width: typeof size === 'number' ? `${size}px` : size,
        height: typeof size === 'number' ? `${size}px` : size,
      }}
    >
      <svg
        viewBox="0 0 100 100"
        className="w-full h-full overflow-visible filter"
        style={{
          filter: isPiece
            ? 'drop-shadow(0px 8px 12px rgba(0,0,0,0.18)) drop-shadow(0px 2px 4px rgba(0,0,0,0.12))'
            : isPlaced
            ? 'drop-shadow(0px 2px 4px rgba(0,0,0,0.15))'
            : 'none',
        }}
      >
        <defs>
          {/* Vibrant Tactile Gradient */}
          <linearGradient id={gradId} x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor={customColor || data.gradientFrom} />
            <stop offset="100%" stopColor={customColor || data.gradientTo} />
          </linearGradient>

          {/* Soft shine reflection on top of shape */}
          <linearGradient id={bevelId} x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.4" />
            <stop offset="50%" stopColor="#FFFFFF" stopOpacity="0.05" />
            <stop offset="100%" stopColor="#000000" stopOpacity="0.15" />
          </linearGradient>
        </defs>

        {/* 1. CUTOUT SLOT VARIANT (Indented silhouette on wooden board) */}
        {isCutout && (
          <g>
            {/* Dark recessed drop shadow layer inside cutout */}
            <g
              fill="#292524"
              opacity="0.35"
              stroke="#44403C"
              strokeWidth="3"
              strokeDasharray="4 3"
              strokeLinejoin="round"
            >
              {renderShapePath()}
            </g>
            {/* Soft inner hint silhouette */}
            <g fill="#A8A29E" opacity="0.25">
              {renderShapePath()}
            </g>
            {/* Shape name text in slot for literacy reinforcement */}
            <text
              x="50"
              y="54"
              textAnchor="middle"
              dominantBaseline="middle"
              fill="#78716C"
              fontSize="12"
              fontWeight="700"
              fontFamily="'Fredoka', sans-serif"
              className="tracking-wide"
            >
              {data.name.toUpperCase()}
            </text>
          </g>
        )}

        {/* 2. OUTLINE BLUEPRINT VARIANT */}
        {isOutline && (
          <g
            fill="none"
            stroke="#94A3B8"
            strokeWidth="3.5"
            strokeDasharray="5 4"
            strokeLinejoin="round"
            opacity="0.65"
          >
            {renderShapePath()}
          </g>
        )}

        {/* 3. SOLID PIECE OR PLACED VARIANT */}
        {(isPiece || isPlaced) && (
          <g>
            {/* Base Shape with tactile thick rounded border */}
            <g
              fill={`url(#${gradId})`}
              stroke={customColor ? '#00000020' : data.borderColor}
              strokeWidth="4"
              strokeLinejoin="round"
              strokeLinecap="round"
            >
              {renderShapePath()}
            </g>

            {/* Glossy top highlight for chunky wooden/plastic toy feel */}
            <g
              fill={`url(#${bevelId})`}
              pointerEvents="none"
              style={{ mixBlendMode: 'overlay' }}
            >
              {renderShapePath()}
            </g>

            {/* Friendly Smiling Face */}
            {renderFace()}
          </g>
        )}
      </svg>

      {/* Optional Shape Name Label Below */}
      {showLabel && (
        <span
          className="mt-1.5 text-xs md:text-sm font-bold tracking-wide rounded-full px-2.5 py-0.5 whitespace-nowrap"
          style={{
            backgroundColor: `${data.primaryColor}20`,
            color: data.textColor,
          }}
        >
          {data.name}
        </span>
      )}
    </div>
  );
};
