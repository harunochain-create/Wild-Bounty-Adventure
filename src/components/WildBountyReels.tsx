import React from 'react';
import { motion } from 'motion/react';
import { GridTile } from '../types/slot';
import { NUM_COLUMNS, REEL_ROW_COUNTS } from '../utils/slotEngine';
import { SlotSymbolGraphic } from './SlotSymbolGraphic';

export type WinAnimStage = 'IDLE' | 'EXPANDING' | 'HOLD' | 'SHATTERING';

interface WildBountyReelsProps {
  grid: GridTile[][]; // 6 columns: [3, 4, 5, 5, 4, 3] = 24 tiles
  winningTileIds: string[];
  winAnimStage: WinAnimStage;
  isSpinExiting: boolean;
  isTurbo: boolean;
}

// 8 Particle offsets for local shattered gold flakes
const PARTICLE_DIRECTIONS = [
  { x: 0, y: -26 },
  { x: 18, y: -18 },
  { x: 26, y: 0 },
  { x: 18, y: 18 },
  { x: 0, y: 26 },
  { x: -18, y: 18 },
  { x: -26, y: 0 },
  { x: -18, y: -18 },
];

// ENLARGED LAYOUT CONSTANTS:
// Generous cell dimensions & clearance so all 24 symbols stay comfortably INSIDE the box
const PITCH_X = 100;
const PITCH_Y = 102;
const PAD_X = 24;
const PAD_Y = 24;
const SVG_WIDTH = 6 * PITCH_X + 2 * PAD_X; // 648
const SVG_HEIGHT = 5 * PITCH_Y + 2 * PAD_Y; // 558

// Golden Rivets positions along the perimeter of the shield box
const FRAME_RIVETS = [
  // Top boundary
  { x: 40, y: 110 }, { x: 80, y: 110 },
  { x: 124, y: 84 },
  { x: 160, y: 60 }, { x: 195, y: 60 },
  { x: 224, y: 34 },
  { x: 265, y: 10 }, { x: 324, y: 10 }, { x: 383, y: 10 },
  { x: 424, y: 34 },
  { x: 453, y: 60 }, { x: 488, y: 60 },
  { x: 524, y: 84 },
  { x: 568, y: 110 }, { x: 608, y: 110 },
  // Right edge
  { x: 640, y: 180 }, { x: 640, y: 260 }, { x: 640, y: 340 }, { x: 640, y: 410 },
  // Bottom boundary
  { x: 608, y: 438 }, { x: 568, y: 438 },
  { x: 524, y: 464 },
  { x: 488, y: 488 }, { x: 453, y: 488 },
  { x: 424, y: 514 },
  { x: 383, y: 538 }, { x: 324, y: 538 }, { x: 265, y: 538 },
  { x: 224, y: 514 },
  { x: 195, y: 488 }, { x: 160, y: 488 },
  { x: 124, y: 464 },
  { x: 80, y: 438 }, { x: 40, y: 438 },
  // Left edge
  { x: 8, y: 410 }, { x: 8, y: 340 }, { x: 8, y: 260 }, { x: 8, y: 180 },
];

export const WildBountyReels: React.FC<WildBountyReelsProps> = ({
  grid,
  winningTileIds,
  winAnimStage,
  isSpinExiting,
  isTurbo,
}) => {
  const normalTransition = {
    type: 'spring',
    damping: 18,
    stiffness: 220,
    mass: 0.8,
  } as const;

  const turboTransition = {
    type: 'spring',
    damping: 22,
    stiffness: 340,
    mass: 0.6,
  } as const;

  const baseTransition = isTurbo ? turboTransition : normalTransition;

  // Mathematical SVG shield frame path enclosing the 3-4-5-5-4-3 layout with concave transitions
  const shieldPath = `
    M 8, 124
    Q 8, 110 24, 110
    L 110, 110
    C 124, 114 120, 64 138, 60
    L 210, 60
    C 224, 64 220, 14 238, 10
    L 410, 10
    C 428, 14 424, 64 438, 60
    L 510, 60
    C 524, 64 520, 114 538, 110
    L 624, 110
    Q 640, 110 640, 124
    L 640, 424
    Q 640, 438 624, 438
    L 538, 438
    C 520, 434 524, 484 510, 488
    L 438, 488
    C 424, 484 428, 534 410, 538
    L 238, 538
    C 220, 534 224, 484 210, 488
    L 138, 488
    C 120, 484 124, 434 110, 438
    L 24, 438
    Q 8, 438 8, 424
    Z
  `;

  return (
    <div className="relative w-full max-w-[480px] mx-auto select-none px-0.5">
      {/* 1. ENLARGED SHIELD-SHAPED WOOD/GOLD FRAME WITH TRANSPARENT INTERIOR */}
      <div
        className="relative w-full"
        style={{
          aspectRatio: `${SVG_WIDTH} / ${SVG_HEIGHT}`,
        }}
      >
        {/* SVG Shield Frame (Transparent backdrop so desert background shows through) */}
        <svg
          viewBox={`0 0 ${SVG_WIDTH} ${SVG_HEIGHT}`}
          className="absolute inset-0 w-full h-full pointer-events-none drop-shadow-[0_8px_28px_rgba(0,0,0,0.8)]"
        >
          <defs>
            {/* Transparent Smoky Glass Interior */}
            <linearGradient id="transparentGlassBackdrop" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#1a0c04" stopOpacity="0.45" />
              <stop offset="50%" stopColor="#0f0602" stopOpacity="0.35" />
              <stop offset="100%" stopColor="#080301" stopOpacity="0.45" />
            </linearGradient>

            {/* Radiant Gold Metallic Border */}
            <linearGradient id="goldShieldRim" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#fffbeb" />
              <stop offset="25%" stopColor="#fbbf24" />
              <stop offset="50%" stopColor="#d97706" />
              <stop offset="75%" stopColor="#f59e0b" />
              <stop offset="100%" stopColor="#78350f" />
            </linearGradient>

            {/* Rivet Gold Gradient */}
            <radialGradient id="rivetGrad" cx="35%" cy="35%" r="65%">
              <stop offset="0%" stopColor="#fffbeb" />
              <stop offset="40%" stopColor="#fbbf24" />
              <stop offset="85%" stopColor="#b45309" />
              <stop offset="100%" stopColor="#451a03" />
            </radialGradient>
          </defs>

          {/* Layer 1: Semi-transparent Glass Tint (Background clearly visible!) */}
          <path
            d={shieldPath}
            fill="url(#transparentGlassBackdrop)"
          />

          {/* Layer 2: Subtle Grid Column Divider Lines */}
          <g opacity="0.15" stroke="#f59e0b" strokeWidth="1" strokeDasharray="4 4">
            <line x1="124" y1="110" x2="124" y2="438" />
            <line x1="224" y1="60" x2="224" y2="488" />
            <line x1="324" y1="10" x2="324" y2="538" />
            <line x1="424" y1="10" x2="424" y2="538" />
            <line x1="524" y1="60" x2="524" y2="488" />
          </g>

          {/* Layer 3: Thick Dark Wood Framing */}
          <path
            d={shieldPath}
            fill="none"
            stroke="#3a1806"
            strokeWidth="8"
            strokeLinejoin="round"
          />

          {/* Layer 4: Radiant Gold Metallic Outer Trim */}
          <path
            d={shieldPath}
            fill="none"
            stroke="url(#goldShieldRim)"
            strokeWidth="3.5"
            strokeLinejoin="round"
          />

          {/* Layer 5: Golden Rivets along the perimeter */}
          {FRAME_RIVETS.map((r, idx) => (
            <g key={idx}>
              <circle cx={r.x} cy={r.y} r="3.8" fill="url(#rivetGrad)" stroke="#451a03" strokeWidth="0.8" />
              <circle cx={r.x - 0.8} cy={r.y - 0.8} r="1" fill="#ffffff" opacity="0.85" />
            </g>
          ))}

          {/* Layer 6: Golden Ornaments on the 4 Concave Curves */}
          <g transform="translate(124, 85)">
            <polygon points="0,-4 3,0 0,4 -3,0" fill="#fef08a" stroke="#78350f" strokeWidth="0.5" />
          </g>
          <g transform="translate(524, 85)">
            <polygon points="0,-4 3,0 0,4 -3,0" fill="#fef08a" stroke="#78350f" strokeWidth="0.5" />
          </g>
          <g transform="translate(124, 463)">
            <polygon points="0,-4 3,0 0,4 -3,0" fill="#fef08a" stroke="#78350f" strokeWidth="0.5" />
          </g>
          <g transform="translate(524, 463)">
            <polygon points="0,-4 3,0 0,4 -3,0" fill="#fef08a" stroke="#78350f" strokeWidth="0.5" />
          </g>
        </svg>

        {/* TOP BADGES: PAY ANYWHERE IN WINGS, 6+ MATCH AT PEAK (Clear of tiles & frame) */}
        <div className="absolute top-0 left-0 right-0 z-30 flex items-center justify-between px-3 pointer-events-none">
          {/* Top-Left Wing */}
          <div className="px-2 py-0.5 rounded bg-[#1e0d04]/90 border border-[#b87834]/80 shadow-md -translate-y-1">
            <span className="text-[9px] sm:text-[10px] font-western font-black text-amber-300 tracking-wider uppercase drop-shadow">
              PAY ANYWHERE
            </span>
          </div>

          {/* Top-Center Peak: 6+ MATCH */}
          <div className="px-3 py-0.5 rounded-full bg-gradient-to-b from-amber-500 to-amber-950 border border-amber-300 shadow-[0_2px_8px_rgba(0,0,0,0.9)] -translate-y-2">
            <span className="text-[9px] sm:text-[10px] text-amber-200 font-sans font-black tracking-tight drop-shadow">
              6+ MATCH
            </span>
          </div>

          {/* Top-Right Wing */}
          <div className="px-2 py-0.5 rounded bg-[#1e0d04]/90 border border-[#b87834]/80 shadow-md -translate-y-1">
            <span className="text-[9px] sm:text-[10px] font-western font-black text-amber-300 tracking-wider uppercase drop-shadow">
              PAY ANYWHERE
            </span>
          </div>
        </div>

        {/* 2. REEL GRID TILES: Perfectly fitted inside cell bounds with generous room */}
        <div className="absolute inset-0 z-20 overflow-hidden pointer-events-none">
          {Array.from({ length: NUM_COLUMNS }).map((_, colIdx) => {
            const colTiles = grid[colIdx] || [];
            const colRowCount = REEL_ROW_COUNTS[colIdx];
            const offsetY = ((5 - colRowCount) * PITCH_Y) / 2;

            const colDelay = isTurbo ? 0 : colIdx * 0.1;

            const colLeftPct = ((PAD_X + colIdx * PITCH_X) / SVG_WIDTH) * 100;
            const colWidthPct = (PITCH_X / SVG_WIDTH) * 100;

            return (
              <div
                key={colIdx}
                className="absolute top-0 bottom-0 overflow-visible"
                style={{
                  left: `${colLeftPct}%`,
                  width: `${colWidthPct}%`,
                }}
              >
                {colTiles.map((tile) => {
                  const isWinning = winningTileIds.includes(tile.id);

                  const visualY = PAD_Y + offsetY + tile.row * PITCH_Y;
                  const visualYPct = (visualY / SVG_HEIGHT) * 100;
                  const tileHeightPct = (PITCH_Y / SVG_HEIGHT) * 100;

                  const targetY = isSpinExiting ? `${(tile.row + 6) * 100}%` : '0%';
                  const initialY = tile.isNew ? `${(tile.row - 6) * 100}%` : '0%';

                  let scaleVal = 1;
                  let opacityVal = 1;
                  let glowFilter = 'none';

                  if (isWinning) {
                    if (winAnimStage === 'EXPANDING' || winAnimStage === 'HOLD') {
                      scaleVal = 1.15;
                      glowFilter = 'drop-shadow(0 0 12px rgba(245, 197, 66, 0.95))';
                    } else if (winAnimStage === 'SHATTERING') {
                      scaleVal = 0;
                      opacityVal = 0;
                    }
                  }

                  const scaleDuration = isTurbo ? 0.12 : 0.25;

                  return (
                    <motion.div
                      key={tile.id}
                      initial={{
                        y: initialY,
                        scale: 1,
                        opacity: 1,
                      }}
                      animate={{
                        y: targetY,
                        scale: scaleVal,
                        opacity: opacityVal,
                      }}
                      transition={
                        isSpinExiting
                          ? {
                              duration: isTurbo ? 0.15 : 0.35,
                              delay: colDelay,
                              ease: 'easeIn',
                            }
                          : isWinning
                          ? { duration: scaleDuration, ease: 'easeInOut' }
                          : {
                              ...baseTransition,
                              delay: tile.isNew ? colDelay : 0,
                            }
                      }
                      className={`absolute left-0 right-0 w-full flex items-center justify-center ${
                        isWinning ? 'z-30' : 'z-10'
                      }`}
                      style={{
                        top: `${visualYPct}%`,
                        height: `${tileHeightPct}%`,
                        willChange: 'transform',
                      }}
                    >
                      {/* Local Gold Flakes Shatter when winning symbol collapses */}
                      {isWinning && winAnimStage === 'SHATTERING' && (
                        <div className="absolute inset-0 pointer-events-none flex items-center justify-center z-40">
                          {PARTICLE_DIRECTIONS.map((dir, pIdx) => (
                            <motion.div
                              key={pIdx}
                              initial={{ x: 0, y: 0, opacity: 1, scale: 1 }}
                              animate={{ x: dir.x, y: dir.y, opacity: 0, scale: 0.2 }}
                              transition={{ duration: isTurbo ? 0.12 : 0.25, ease: 'easeOut' }}
                              className="absolute w-1.5 h-1.5 rounded-full bg-amber-300 shadow-[0_0_8px_#f59e0b]"
                            />
                          ))}
                        </div>
                      )}

                      {/* Clean transparent symbol fitted cleanly inside cell without cutting off */}
                      <div
                        className="relative flex items-center justify-center w-[96%] h-[96%] p-0.5 overflow-visible pointer-events-none"
                        style={{
                          filter: glowFilter !== 'none' ? glowFilter : undefined,
                        }}
                      >
                        <SlotSymbolGraphic symbolId={tile.symbol} />
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
