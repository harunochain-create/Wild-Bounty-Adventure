import React from 'react';
import { SymbolId } from '../types/slot';
import { REEL_ROW_COUNTS, SYMBOLS } from '../utils/slotEngine';

interface WildBountyReelsProps {
  grid: SymbolId[][];
  winningPositions: { reel: number; row: number }[];
  isCascading: boolean;
  droppingReels: boolean[];
}

export const WildBountyReels: React.FC<WildBountyReelsProps> = ({
  grid,
  winningPositions,
  isCascading,
  droppingReels,
}) => {
  const isWinning = (reel: number, row: number) => {
    return winningPositions.some((pos) => pos.reel === reel && pos.row === row);
  };

  return (
    <div className="relative w-full max-w-[420px] mx-auto select-none">
      {/* Saloon Board Frame with Angled Octagonal Corners */}
      <div className="relative rounded-2xl sm:rounded-3xl p-2 sm:p-2.5 bg-gradient-to-b from-[#2d1b10] via-[#1c0f08] to-[#120804] border-[3px] border-[#a06830] shadow-[0_12px_35px_rgba(0,0,0,0.9),inset_0_2px_8px_rgba(245,197,66,0.3)]">
        {/* Corner metal rivets */}
        <div className="absolute top-1.5 left-2 w-2 h-2 rounded-full bg-amber-400 shadow-sm" />
        <div className="absolute top-1.5 right-2 w-2 h-2 rounded-full bg-amber-400 shadow-sm" />
        <div className="absolute bottom-1.5 left-2 w-2 h-2 rounded-full bg-amber-400 shadow-sm" />
        <div className="absolute bottom-1.5 right-2 w-2 h-2 rounded-full bg-amber-400 shadow-sm" />

        {/* 3600 WAYS Engraved Wings */}
        <div className="flex items-center justify-between px-3 py-0.5 mb-1 text-[11px] font-western font-black tracking-widest text-[#7a4820] uppercase">
          <span className="drop-shadow-[0_1px_1px_rgba(0,0,0,0.8)]">3600 WAYS</span>
          <span className="drop-shadow-[0_1px_1px_rgba(0,0,0,0.8)]">3600 WAYS</span>
        </div>

        {/* 6 Columns [3, 4, 5, 5, 4, 3] Grid */}
        <div className="grid grid-cols-6 gap-1 sm:gap-1.5 items-center justify-center min-h-[300px] sm:min-h-[340px]">
          {REEL_ROW_COUNTS.map((rowCount, reelIdx) => {
            const isColumnDropping = droppingReels[reelIdx];
            const reelSymbols = grid[reelIdx] || [];

            return (
              <div
                key={reelIdx}
                className="flex flex-col gap-1 sm:gap-1.5 justify-center"
              >
                {Array.from({ length: rowCount }).map((_, rowIdx) => {
                  const symId = reelSymbols[rowIdx] || 'J';
                  const sym = SYMBOLS[symId] || SYMBOLS['J'];
                  const isWinCell = isWinning(reelIdx, rowIdx);

                  return (
                    <div
                      key={rowIdx}
                      className={`relative aspect-square w-full rounded-lg sm:rounded-xl flex items-center justify-center p-0.5 sm:p-1 border transition-all duration-300 overflow-hidden ${
                        isColumnDropping
                          ? 'animate-in slide-in-from-top-6 duration-300 ease-out'
                          : ''
                      } ${
                        isWinCell
                          ? 'ring-2 ring-amber-400 border-amber-300 scale-105 z-20 shadow-[0_0_20px_rgba(245,197,66,0.9)] bg-amber-950/80 animate-pulse'
                          : sym.isScatter
                          ? 'border-amber-500/80 bg-gradient-to-b from-amber-950/70 to-stone-950 ring-1 ring-amber-500/50 shadow-[0_0_12px_rgba(239,68,68,0.5)]'
                          : sym.isWild
                          ? 'border-yellow-400/80 bg-gradient-to-b from-amber-900/60 to-stone-950 ring-1 ring-yellow-400/50'
                          : 'border-[#5a3818]/60 bg-gradient-to-b from-[#24140b] to-[#120804] shadow-inner'
                      }`}
                    >
                      {/* Golden Target Reticle Overlay for Winners (matching Screenshot 3) */}
                      {isWinCell && (
                        <div className="absolute inset-0 pointer-events-none flex items-center justify-center z-20">
                          <div className="w-full h-full rounded-full border-2 border-amber-300 animate-spin opacity-80" />
                          <div className="absolute w-2 h-2 rounded-full bg-amber-300 animate-ping" />
                        </div>
                      )}

                      {/* Symbol Visual */}
                      {sym.image ? (
                        <div className="relative w-full h-full flex flex-col items-center justify-center">
                          <img
                            src={sym.image}
                            alt={sym.name}
                            className="w-full h-full object-cover rounded-md drop-shadow-md"
                          />
                          {sym.isScatter && (
                            <span className="absolute bottom-0 text-[7px] sm:text-[8px] font-black text-amber-300 bg-black/85 px-1 rounded uppercase tracking-tighter drop-shadow">
                              SCATTER
                            </span>
                          )}
                          {sym.isWild && (
                            <span className="absolute bottom-0 text-[7px] sm:text-[8px] font-black text-amber-300 bg-black/85 px-1 rounded uppercase tracking-tighter drop-shadow">
                              WILD
                            </span>
                          )}
                        </div>
                      ) : (
                        <div className="flex flex-col items-center justify-center w-full h-full">
                          <span
                            className="font-western text-xl sm:text-2xl font-black drop-shadow-[0_2px_4px_rgba(0,0,0,0.9)]"
                            style={{ color: sym.color }}
                          >
                            {sym.id}
                          </span>
                        </div>
                      )}
                    </div>
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
