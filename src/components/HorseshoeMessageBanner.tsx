import React from 'react';

interface HorseshoeMessageBannerProps {
  message: string;
  isFreeSpins: boolean;
  remainingFreeSpins: number;
}

export const HorseshoeMessageBanner: React.FC<HorseshoeMessageBannerProps> = ({
  message,
  isFreeSpins,
  remainingFreeSpins,
}) => {
  return (
    <div className="relative w-full max-w-[400px] mx-auto select-none my-1">
      {/* Golden Horseshoe Emblem at Top Center (Screenshot 2) */}
      <div className="absolute -top-3 left-1/2 -translate-x-1/2 z-20 w-7 h-7 rounded-full bg-gradient-to-b from-yellow-300 via-amber-500 to-amber-700 border border-yellow-200 shadow-md flex items-center justify-center text-xs font-black text-amber-950">
        🧲
      </div>

      {/* Carved Wooden Banner */}
      <div className="relative rounded-xl bg-gradient-to-b from-[#3a1f0c] via-[#231206] to-[#160a03] border-2 border-[#b07232] px-4 py-2 shadow-[0_4px_12px_rgba(0,0,0,0.8)] text-center overflow-hidden">
        <div className="font-western text-xs sm:text-sm font-bold text-amber-300 tracking-wider uppercase drop-shadow">
          {message}
        </div>

        {/* Free Spins Big Counter (Matching Screenshot 1) */}
        {isFreeSpins && (
          <div className="mt-2 pt-2 border-t border-amber-900/60 flex items-center justify-center gap-3 animate-in zoom-in-95 duration-200">
            <div className="text-xs sm:text-sm font-western font-extrabold text-amber-400/90 tracking-widest uppercase">
              REMAINING FREE SPINS
            </div>
            <div className="text-3xl sm:text-4xl font-western font-black text-amber-200 drop-shadow-[0_2px_10px_rgba(245,197,66,0.8)] tabular-nums">
              {remainingFreeSpins}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
