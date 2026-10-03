import React from 'react';

interface HorseshoeMessageBannerProps {
  message: string;
  isFreeSpins: boolean;
  remainingFreeSpins: number;
  currentWin: number;
  currency: 'USD' | 'IDR';
}

export const HorseshoeMessageBanner: React.FC<HorseshoeMessageBannerProps> = ({
  message,
  isFreeSpins,
  remainingFreeSpins,
  currentWin,
  currency,
}) => {
  const formattedWin =
    currency === 'IDR'
      ? `Rp ${currentWin.toLocaleString('id-ID')}`
      : `$${currentWin.toLocaleString('en-US', { minimumFractionDigits: 2 })}`;

  return (
    <div className="relative w-full max-w-[400px] mx-auto select-none my-1">
      {/* Golden Horseshoe Emblem at Top Center */}
      <div className="absolute -top-2.5 left-1/2 -translate-x-1/2 z-20 w-6 h-6 rounded-full bg-gradient-to-b from-yellow-300 via-amber-500 to-amber-700 border border-yellow-200 shadow-md flex items-center justify-center text-[11px] font-black text-amber-950">
        🧲
      </div>

      {/* Carved Wooden Banner */}
      <div className="relative rounded-2xl bg-gradient-to-b from-[#3a1f0c] via-[#231206] to-[#160a03] border-2 border-[#b07232] px-4 py-2 shadow-[0_4px_12px_rgba(0,0,0,0.8)] text-center overflow-hidden">
        {isFreeSpins ? (
          /* Free Spins Big Counter: "REMAINING FREE SPINS 10" */
          <div className="flex items-center justify-center gap-2.5 py-0.5 animate-in zoom-in-95 duration-200">
            <span className="text-xs sm:text-sm font-western font-black text-amber-300 tracking-wider uppercase drop-shadow">
              REMAINING FREE SPINS
            </span>
            <span className="text-2xl sm:text-3xl font-western font-black text-gold-gradient drop-shadow-[0_2px_10px_rgba(245,197,66,0.9)] tabular-nums">
              {remainingFreeSpins}
            </span>
          </div>
        ) : (
          /* Normal mode: KEMENANGAN TOTAL plakat & Status message */
          <div className="flex flex-col items-center justify-center">
            {currentWin > 0 ? (
              <div className="flex items-center gap-2">
                <span className="text-[10px] sm:text-[11px] font-western font-extrabold text-amber-400 tracking-wider uppercase">
                  KEMENANGAN TOTAL:
                </span>
                <span className="text-sm sm:text-base font-western font-black text-gold-gradient tabular-nums drop-shadow-[0_1px_4px_rgba(245,197,66,0.8)]">
                  {formattedWin}
                </span>
              </div>
            ) : (
              <div className="font-western text-xs sm:text-sm font-bold text-amber-300 tracking-wider uppercase drop-shadow">
                {message}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
