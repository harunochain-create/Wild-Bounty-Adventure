import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
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
  const [showMultiplierBurst, setShowMultiplierBurst] = useState<boolean>(false);

  // Trigger brief burst when multiplier increases
  useEffect(() => {
    if (currentMultiplier > (isFreeSpins ? 8 : 1)) {
      setShowMultiplierBurst(true);
      const timer = setTimeout(() => setShowMultiplierBurst(false), 550);
      return () => clearTimeout(timer);
    }
  }, [currentMultiplier, isFreeSpins]);

  // Viewing window around activeIndex
  const displayList = [-2, -1, 0, 1, 2].map((offset) => {
    let targetIndex = (activeIndex + offset) % multipliers.length;
    if (targetIndex < 0) targetIndex += multipliers.length;
    return {
      value: multipliers[targetIndex],
      isCurrent: offset === 0,
      offset,
    };
  });

  return (
    <div className="relative w-full max-w-[400px] mx-auto select-none pt-1 pb-1">
      {/* Hanging Iron Chains */}
      <div className="absolute -top-3 left-10 flex flex-col items-center z-10 pointer-events-none">
        <div className="w-1.5 h-6 bg-gradient-to-b from-stone-400 via-stone-700 to-stone-900 border-x border-stone-500 rounded-sm" />
        <div className="w-3.5 h-3.5 -mt-1 rounded-full border-2 border-amber-600 bg-stone-900" />
      </div>
      <div className="absolute -top-3 right-10 flex flex-col items-center z-10 pointer-events-none">
        <div className="w-1.5 h-6 bg-gradient-to-b from-stone-400 via-stone-700 to-stone-900 border-x border-stone-500 rounded-sm" />
        <div className="w-3.5 h-3.5 -mt-1 rounded-full border-2 border-amber-600 bg-stone-900" />
      </div>

      {/* Carved Wooden Hanging Plank */}
      <div className="relative mx-3 rounded-2xl bg-gradient-to-b from-[#4a2610] via-[#2c1608] to-[#1a0c04] border-[3px] border-[#b87834] px-3 py-2 shadow-[0_6px_20px_rgba(0,0,0,0.8),inset_0_2px_6px_rgba(245,197,66,0.35)] flex flex-col items-center overflow-hidden">
        {/* Subtle woodgrain sheen */}
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-amber-500/10 to-transparent pointer-events-none" />

        {/* Row of Multipliers */}
        <div className="relative z-10 flex items-center justify-around w-full">
          {displayList.map((item) => {
            if (item.isCurrent) {
              return (
                <div
                  key={`cur-${item.value}`}
                  className="relative flex items-center justify-center px-4 z-20"
                >
                  {/* Sunburst glowing ring for active multiplier */}
                  <div className="absolute inset-0 -m-2 rounded-full border-2 border-amber-300 shadow-[0_0_16px_rgba(245,197,66,0.9)] bg-amber-400/20 animate-pulse" />

                  <motion.div
                    key={item.value}
                    initial={{ scale: 0.85, y: -2 }}
                    animate={{ scale: 1, y: 0 }}
                    transition={{ type: 'spring', stiffness: 350, damping: 20 }}
                    className="relative flex items-center justify-center"
                  >
                    <span className="font-western text-2xl sm:text-3xl font-black text-gold-gradient drop-shadow-[0_2px_8px_rgba(245,197,66,0.9)] tracking-wider">
                      X{item.value}
                    </span>
                  </motion.div>
                </div>
              );
            }

            return (
              <div
                key={`other-${item.offset}-${item.value}`}
                className="text-[#996535] font-western text-xs sm:text-sm font-bold opacity-50 tracking-wider"
              >
                x{item.value}
              </div>
            );
          })}
        </div>

        {/* Brief Pop-Up Multiplier Burst across center (max 0.6s) */}
        <AnimatePresence>
          {showMultiplierBurst && (
            <motion.div
              initial={{ scale: 0.4, opacity: 0 }}
              animate={{ scale: 1.3, opacity: 1 }}
              exit={{ scale: 1.6, opacity: 0 }}
              transition={{ duration: 0.5 }}
              className="absolute inset-0 z-30 flex items-center justify-center bg-black/40 pointer-events-none"
            >
              <span className="font-western text-4xl sm:text-5xl font-black text-amber-200 drop-shadow-[0_0_20px_#f59e0b]">
                X{currentMultiplier}
              </span>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Subtitle text below board */}
        <div className="text-[9px] sm:text-[10px] font-western font-bold tracking-widest text-[#d4963e] uppercase mt-1 opacity-90">
          MULTIPLIER DOUBLES AFTER
        </div>
      </div>
    </div>
  );
};
