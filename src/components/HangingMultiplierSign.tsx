import React from 'react';
import { BASE_MULTIPLIERS, FREE_SPIN_MULTIPLIERS } from '../utils/slotEngine';

interface HangingMultiplierSignProps {
  currentMultiplier: number;
  isFreeSpins: boolean;
}

export const HangingMultiplierSign: React.FC<HangingMultiplierSignProps> = ({
  currentMultiplier,
  isFreeSpins,
}) => {
  const multipliers = isFreeSpins ? FREE_SPIN_MULTIPLIERS : BASE_MULTIPLIERS;
  const activeIndex = Math.max(0, multipliers.indexOf(currentMultiplier));

  // Determine which 5 multipliers to show in the viewing window
  // e.g. [idx-2, idx-1, idx, idx+1, idx+2]
  const displayList = [-2, -1, 0, 1, 2].map((offset) => {
    let targetIndex = (activeIndex + offset) % multipliers.length;
    if (targetIndex < 0) targetIndex += multipliers.length;
    return {
      value: multipliers[targetIndex],
      isCurrent: offset === 0,
    };
  });

  return (
    <div className="relative w-full max-w-[380px] mx-auto select-none pt-2 pb-1">
      {/* Hanging Iron Chains */}
      <div className="absolute -top-3 left-8 flex flex-col items-center z-10">
        <div className="w-1.5 h-6 bg-gradient-to-b from-stone-400 via-stone-700 to-stone-900 border-x border-stone-500 rounded-sm" />
        <div className="w-3.5 h-3.5 -mt-1 rounded-full border-2 border-amber-600 bg-stone-900" />
      </div>
      <div className="absolute -top-3 right-8 flex flex-col items-center z-10">
        <div className="w-1.5 h-6 bg-gradient-to-b from-stone-400 via-stone-700 to-stone-900 border-x border-stone-500 rounded-sm" />
        <div className="w-3.5 h-3.5 -mt-1 rounded-full border-2 border-amber-600 bg-stone-900" />
      </div>

      {/* Carved Curved Wooden Plank Sign (matching Screenshot 1 & 2) */}
      <div className="relative mx-3 rounded-2xl bg-gradient-to-b from-[#4d2912] via-[#2f1809] to-[#1e0e04] border-[3px] border-[#b87834] px-4 py-2 sm:py-2.5 shadow-[0_6px_20px_rgba(0,0,0,0.8),inset_0_2px_6px_rgba(245,197,66,0.35)] flex items-center justify-around overflow-hidden">
        {/* Subtle woodgrain and bevel lines */}
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-amber-500/10 to-transparent pointer-events-none" />

        {displayList.map((item, idx) => {
          if (item.isCurrent) {
            return (
              <div
                key={idx}
                className="relative flex items-center justify-center px-3 z-10"
              >
                {/* Sunburst Fire Ring for Free Spins / High multiplier (Screenshot 1) */}
                {isFreeSpins && (
                  <div className="absolute inset-0 -m-3 rounded-full border-2 border-amber-400/80 bg-amber-500/20 animate-spin opacity-80 blur-[1px]" />
                )}

                <div className="relative flex items-center justify-center">
                  <span className="font-western text-2xl sm:text-3xl font-black text-amber-200 drop-shadow-[0_2px_8px_rgba(245,197,66,0.9)] tracking-wider">
                    X{item.value}
                  </span>
                </div>
              </div>
            );
          }

          return (
            <div
              key={idx}
              className="text-[#996535] font-western text-xs sm:text-sm font-bold opacity-60 tracking-wider transition-opacity hover:opacity-90"
            >
              x{item.value}
            </div>
          );
        })}
      </div>
    </div>
  );
};
