import React from 'react';
import { Wallet, Coins, Trophy, Zap, Minus, Plus, Play, Menu, RotateCcw } from 'lucide-react';

interface WildBountyControlsProps {
  balance: number;
  bet: number;
  win: number;
  currency: 'USD' | 'IDR';
  isSpinning: boolean;
  isTurbo: boolean;
  autoSpinsRemaining: number;
  isFreeSpins?: boolean;
  remainingFreeSpins?: number;
  onToggleTurbo: () => void;
  onDecreaseBet: () => void;
  onIncreaseBet: () => void;
  onSpin: () => void;
  onToggleAuto: () => void;
  onOpenMenu: () => void;
}

export const WildBountyControls: React.FC<WildBountyControlsProps> = ({
  balance,
  bet,
  win,
  currency,
  isSpinning,
  isTurbo,
  autoSpinsRemaining,
  isFreeSpins = false,
  remainingFreeSpins = 0,
  onToggleTurbo,
  onDecreaseBet,
  onIncreaseBet,
  onSpin,
  onToggleAuto,
  onOpenMenu,
}) => {
  const formatVal = (num: number) => {
    if (currency === 'IDR') {
      return `Rp ${num.toLocaleString('id-ID')}`;
    }
    return `$${num.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  };

  return (
    <div className="w-full max-w-[420px] mx-auto select-none pt-1 pb-3 px-2 flex flex-col gap-2">
      {/* 3-Column Status Bar (Matching Screenshot 1, 2, 3) */}
      <div className="grid grid-cols-3 gap-1.5 p-1 rounded-xl bg-[#140b06]/90 border border-[#7a4820]/70 text-[11px] font-mono shadow-md">
        {/* Balance */}
        <div className="flex items-center gap-1.5 px-2 py-1 rounded-lg bg-[#221208] border border-[#523015] overflow-hidden">
          <Wallet className="w-3.5 h-3.5 text-amber-400 shrink-0" />
          <div className="truncate text-stone-200 font-bold" title={formatVal(balance)}>
            {formatVal(balance)}
          </div>
        </div>

        {/* Bet */}
        <div className="flex items-center gap-1.5 px-2 py-1 rounded-lg bg-[#221208] border border-[#523015] overflow-hidden">
          <Coins className="w-3.5 h-3.5 text-amber-400 shrink-0" />
          <div className="truncate text-amber-300 font-bold" title={formatVal(bet)}>
            {formatVal(bet)}
          </div>
        </div>

        {/* Win */}
        <div className="flex items-center gap-1.5 px-2 py-1 rounded-lg bg-[#221208] border border-[#523015] overflow-hidden">
          <Trophy className="w-3.5 h-3.5 text-amber-400 shrink-0" />
          <div className="truncate text-emerald-400 font-bold" title={formatVal(win)}>
            {formatVal(win)}
          </div>
        </div>
      </div>

      {/* Control Buttons Deck (Matching Screenshot 2 & 3) */}
      <div className="flex items-center justify-between gap-1.5 px-1 pt-1">
        {/* Turbo Button */}
        <button
          onClick={onToggleTurbo}
          className={`flex flex-col items-center justify-center w-12 h-12 rounded-full border-2 transition-all cursor-pointer ${
            isTurbo
              ? 'bg-amber-500/20 border-yellow-400 shadow-[0_0_12px_rgba(245,197,66,0.6)]'
              : 'bg-[#1e1109] border-[#6b401c] hover:border-amber-500'
          }`}
          title="Toggle Turbo Speed"
        >
          <Zap className={`w-5 h-5 ${isTurbo ? 'text-yellow-400 fill-yellow-400 animate-pulse' : 'text-stone-400'}`} />
          <span className="text-[8px] font-bold text-stone-300 uppercase tracking-tighter -mt-0.5">TURBO</span>
        </button>

        {/* Minus Button */}
        <button
          disabled={isSpinning || isFreeSpins || bet <= 400}
          onClick={onDecreaseBet}
          className="flex items-center justify-center w-11 h-11 rounded-full bg-gradient-to-b from-[#3a2010] to-[#1a0e07] border-2 border-[#b87834] text-amber-200 hover:brightness-110 active:scale-95 disabled:opacity-40 transition-all cursor-pointer shadow-md"
        >
          <Minus className="w-5 h-5 stroke-[2.5]" />
        </button>

        {/* BIG CARVED WOODEN CIRCULAR SPIN BUTTON (With Buffalo / Bull Skull Emblem) */}
        <button
          disabled={isSpinning || isFreeSpins}
          onClick={onSpin}
          className={`relative flex items-center justify-center w-18 h-18 sm:w-20 sm:h-20 rounded-full bg-gradient-to-b from-[#6b3a16] via-[#42220c] to-[#251206] border-4 border-[#e2a84d] shadow-[0_6px_25px_rgba(226,168,77,0.5),inset_0_2px_8px_rgba(255,255,255,0.4)] transition-all overflow-hidden ${
            isFreeSpins
              ? 'ring-4 ring-amber-400/50 shadow-[0_0_20px_rgba(245,197,66,0.8)] cursor-default'
              : 'hover:brightness-110 active:scale-95 cursor-pointer'
          }`}
        >
          {/* Circular refresh arrow / Buffalo horns engraving */}
          <div className="absolute inset-1 rounded-full border border-amber-500/40 pointer-events-none" />

          {isFreeSpins ? (
            // In Free Spins Mode (Auto status badge with remaining spins)
            <div className="flex flex-col items-center justify-center animate-pulse">
              <span className="text-[10px] font-western font-black text-amber-300 uppercase tracking-widest drop-shadow">
                AUTO
              </span>
              <span className="text-xl sm:text-2xl font-western font-black text-amber-200 drop-shadow tabular-nums -mt-1">
                {remainingFreeSpins}
              </span>
            </div>
          ) : autoSpinsRemaining > 0 ? (
            // In Auto Spin Mode (matching Screenshot 3 with the big number!)
            <div className="flex flex-col items-center justify-center animate-in zoom-in-75">
              <span className="text-2xl sm:text-3xl font-western font-black text-amber-200 drop-shadow">
                {autoSpinsRemaining}
              </span>
            </div>
          ) : isSpinning ? (
            <div className="w-8 h-8 border-3 border-amber-300 border-t-transparent rounded-full animate-spin" />
          ) : (
            // Buffalo skull icon with circular spin arrow
            <div className="flex flex-col items-center justify-center text-amber-300">
              <RotateCcw className="w-7 h-7 sm:w-8 sm:h-8 stroke-[2.5] text-amber-300 drop-shadow" />
            </div>
          )}
        </button>

        {/* Plus Button */}
        <button
          disabled={isSpinning || isFreeSpins || bet >= 500}
          onClick={onIncreaseBet}
          className="flex items-center justify-center w-11 h-11 rounded-full bg-gradient-to-b from-[#3a2010] to-[#1a0e07] border-2 border-[#b87834] text-amber-200 hover:brightness-110 active:scale-95 disabled:opacity-40 transition-all cursor-pointer shadow-md"
        >
          <Plus className="w-5 h-5 stroke-[2.5]" />
        </button>

        {/* Auto Spin Button */}
        <button
          disabled={isFreeSpins}
          onClick={onToggleAuto}
          className={`flex flex-col items-center justify-center w-12 h-12 rounded-full border-2 transition-all cursor-pointer ${
            isFreeSpins
              ? 'opacity-40 cursor-not-allowed bg-[#1e1109] border-[#6b401c]'
              : autoSpinsRemaining > 0
              ? 'bg-red-950/80 border-red-500 shadow-[0_0_12px_rgba(239,68,68,0.7)] animate-pulse'
              : 'bg-[#1e1109] border-[#6b401c] hover:border-amber-500'
          }`}
          title="Auto Spin"
        >
          <Play className={`w-4 h-4 ${autoSpinsRemaining > 0 ? 'text-red-400 fill-red-400' : 'text-stone-300 fill-stone-300'}`} />
          <span className="text-[8px] font-bold text-stone-300 uppercase tracking-tighter mt-0.5">AUTO</span>
        </button>

        {/* Menu Button */}
        <button
          onClick={onOpenMenu}
          className="flex items-center justify-center w-10 h-10 rounded-full bg-[#1e1109] border border-[#6b401c] text-stone-300 hover:text-white hover:border-amber-500 transition-all cursor-pointer"
          title="Open Menu"
        >
          <Menu className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
};
