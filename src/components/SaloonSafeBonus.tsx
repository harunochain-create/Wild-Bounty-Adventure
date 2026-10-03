import React, { useState } from 'react';
import { Lock, Unlock, Sparkles, Coins, Flame, Trophy } from 'lucide-react';
import { sound } from '../utils/soundEngine';

interface SafePrize {
  id: number;
  name: string;
  type: 'CASH' | 'MULTIPLIER' | 'JACKPOT';
  value: number; // Cash amount or multiplier factor
  description: string;
}

interface SaloonSafeBonusProps {
  currentBet: number;
  currentLevel: number;
  onFinish: (totalBonusWin: number) => void;
  onClose: () => void;
}

export const SaloonSafeBonus: React.FC<SaloonSafeBonusProps> = ({
  currentBet,
  currentLevel,
  onFinish,
  onClose,
}) => {
  const [openedSafes, setOpenedSafes] = useState<number[]>([]);
  const [picksRemaining, setPicksRemaining] = useState<number>(3);
  const [accumulatedWin, setAccumulatedWin] = useState<number>(0);
  const [isCompleted, setIsCompleted] = useState<boolean>(false);

  // Pre-determined hidden prizes under the 5 safes
  const safePrizes: SafePrize[] = [
    {
      id: 0,
      name: 'Sheriff Gold Stash',
      type: 'CASH',
      value: Math.max(500, currentBet * 25 * currentLevel),
      description: 'Heavy gold bars recovered from bandits',
    },
    {
      id: 1,
      name: 'Dynamite Multiplier',
      type: 'MULTIPLIER',
      value: 15 * currentLevel,
      description: 'Multiplier explosive boost',
    },
    {
      id: 2,
      name: 'Saloon Grand Vault',
      type: 'JACKPOT',
      value: Math.max(2000, currentBet * 80 * currentLevel),
      description: 'The Legendary Frontier Bank Vault Cache',
    },
    {
      id: 3,
      name: 'Whiskey Bootleg Bag',
      type: 'CASH',
      value: Math.max(300, currentBet * 15 * currentLevel),
      description: 'Smuggler silver doubloons',
    },
    {
      id: 4,
      name: 'Wanted Bandit Ransom',
      type: 'CASH',
      value: Math.max(800, currentBet * 35 * currentLevel),
      description: 'Federal bounty reward envelope',
    },
  ];

  const handlePickSafe = (safeIndex: number) => {
    if (openedSafes.includes(safeIndex) || picksRemaining <= 0 || isCompleted) return;

    sound.playGunshot();
    setTimeout(() => {
      sound.playCoin();
    }, 200);

    const prize = safePrizes[safeIndex];
    const newOpened = [...openedSafes, safeIndex];
    const newTotal = accumulatedWin + prize.value;

    setOpenedSafes(newOpened);
    setAccumulatedWin(newTotal);

    const remaining = picksRemaining - 1;
    setPicksRemaining(remaining);

    if (remaining === 0) {
      setTimeout(() => {
        sound.playLevelUp();
        setIsCompleted(true);
      }, 700);
    }
  };

  const handleCollect = () => {
    onFinish(accumulatedWin);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl bg-stone-900 border-2 border-amber-600/80 rounded-2xl p-6 sm:p-8 shadow-2xl shadow-amber-950/60 overflow-hidden">
        {/* Western Header */}
        <div className="text-center mb-6">
          <div className="flex items-center justify-center gap-2 text-xs font-semibold uppercase tracking-widest text-amber-400 mb-1">
            <Flame className="w-4 h-4 text-red-500 animate-pulse" />
            <span>Saloon Safe Vault Heist</span>
            <Flame className="w-4 h-4 text-red-500 animate-pulse" />
          </div>
          <h2 className="text-2xl sm:text-3xl font-western text-gold-gradient tracking-wide">
            CRACK THE OUTLAW SAFES
          </h2>
          <p className="text-xs sm:text-sm text-stone-300 mt-1">
            Choose carefully! Pick <span className="text-amber-400 font-bold">{picksRemaining}</span> more
            heavy bank safe{picksRemaining > 1 ? 's' : ''} to reveal concealed gold treasures.
          </p>
        </div>

        {/* 5 Safes Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 sm:gap-4 mb-6">
          {safePrizes.map((prize, idx) => {
            const isOpened = openedSafes.includes(idx);
            return (
              <button
                key={idx}
                disabled={isOpened || picksRemaining === 0}
                onClick={() => handlePickSafe(idx)}
                className={`relative flex flex-col items-center justify-center p-4 rounded-xl border-2 transition-all duration-300 ${
                  isOpened
                    ? 'bg-amber-950/40 border-amber-500 shadow-lg shadow-amber-500/20 scale-95'
                    : 'bg-stone-800/90 border-stone-700 hover:border-amber-400 hover:scale-105 active:scale-95 cursor-pointer shadow-md'
                }`}
              >
                {/* Safe dial art */}
                <div
                  className={`w-14 h-14 rounded-full flex items-center justify-center mb-2 transition-transform duration-300 ${
                    isOpened
                      ? 'bg-amber-500/20 text-amber-300 rotate-180 border-2 border-amber-400'
                      : 'bg-stone-900 border border-stone-600 text-stone-400'
                  }`}
                >
                  {isOpened ? (
                    <Unlock className="w-6 h-6 text-amber-400" />
                  ) : (
                    <Lock className="w-6 h-6 text-stone-400" />
                  )}
                </div>

                <div className="text-xs font-bold text-stone-300 mb-1">
                  Safe #{idx + 1}
                </div>

                {isOpened ? (
                  <div className="text-center animate-in zoom-in-75 duration-200">
                    <div className="text-sm font-extrabold text-amber-300 font-mono">
                      +${prize.value.toLocaleString()}
                    </div>
                    <div className="text-[10px] text-amber-400/80 leading-tight mt-0.5 line-clamp-1">
                      {prize.name}
                    </div>
                  </div>
                ) : (
                  <div className="text-[11px] text-stone-500 font-medium">Click to Crack</div>
                )}
              </button>
            );
          })}
        </div>

        {/* Current bonus tally & actions */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 rounded-xl bg-stone-950/80 border border-stone-800">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-lg bg-amber-500/10 text-amber-400">
              <Coins className="w-6 h-6" />
            </div>
            <div>
              <div className="text-xs text-stone-400 uppercase tracking-wide">Total Bounty Loot</div>
              <div className="text-2xl font-mono font-bold text-amber-400 tabular-nums">
                ${accumulatedWin.toLocaleString()}
              </div>
            </div>
          </div>

          {isCompleted ? (
            <button
              onClick={handleCollect}
              className="w-full sm:w-auto px-6 py-3 rounded-xl bg-gradient-to-r from-amber-500 to-yellow-500 text-stone-950 font-bold text-sm tracking-wide shadow-lg shadow-amber-500/30 hover:brightness-110 active:scale-95 transition-all flex items-center justify-center gap-2"
            >
              <Trophy className="w-4 h-4 text-stone-950" />
              Collect Bounty & Return
            </button>
          ) : (
            <div className="flex items-center gap-2 text-xs text-amber-300/80">
              <Sparkles className="w-4 h-4 text-amber-400" />
              <span>{picksRemaining} Pick{picksRemaining > 1 ? 's' : ''} Left</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
