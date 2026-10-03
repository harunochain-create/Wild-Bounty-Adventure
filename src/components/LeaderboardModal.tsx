import React, { useState } from 'react';
import { Trophy, Flame, Crown, Medal, X, Globe, Sparkles } from 'lucide-react';
import { LeaderboardEntry } from '../types/slot';

interface LeaderboardModalProps {
  isOpen: boolean;
  onClose: () => void;
  entries: LeaderboardEntry[];
  playerBestWin: number;
  playerLevel: number;
}

export const LeaderboardModal: React.FC<LeaderboardModalProps> = ({
  isOpen,
  onClose,
  entries,
  playerBestWin,
  playerLevel,
}) => {
  const [filter, setFilter] = useState<'BIGGEST_WIN' | 'HIGHEST_LEVEL' | 'TOURNAMENT'>('BIGGEST_WIN');

  if (!isOpen) return null;

  const sortedEntries = [...entries].sort((a, b) => {
    if (filter === 'HIGHEST_LEVEL') {
      return b.level - a.level || b.multiplier - a.multiplier;
    }
    return b.biggestWin - a.biggestWin;
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl bg-stone-900 border-2 border-amber-600/60 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-stone-800 bg-stone-950">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-lg bg-amber-500/10 text-amber-400">
              <Trophy className="w-5 h-5 text-amber-400" />
            </div>
            <div>
              <div className="text-sm font-bold text-stone-100 flex items-center gap-2">
                <span>Global Bounty Leaderboard</span>
                <span className="text-[10px] px-2 py-0.5 rounded bg-amber-950 text-amber-400 border border-amber-800 font-mono">
                  LIVE TOURNAMENT
                </span>
              </div>
              <div className="text-xs text-stone-400">
                Compete against bounty hunters across 48+ countries
              </div>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-stone-400 hover:text-white hover:bg-stone-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tournament Prize Pool Banner */}
        <div className="p-4 bg-gradient-to-r from-amber-950/60 via-stone-900 to-amber-950/60 border-b border-amber-600/30 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2 text-center sm:text-left">
            <Crown className="w-6 h-6 text-amber-400 shrink-0" />
            <div>
              <div className="text-xs font-semibold text-amber-300">Daily Western Showdown Pool</div>
              <div className="text-xl font-bold font-mono text-gold-gradient">$50,000 USD / Rp 750.000.000</div>
            </div>
          </div>
          <div className="text-right text-xs text-stone-400">
            Resets in: <span className="font-mono text-amber-300 font-semibold">05h 22m 14s</span>
          </div>
        </div>

        {/* Segmented Filter */}
        <div className="flex items-center gap-1 p-2 bg-stone-950 border-b border-stone-800">
          <button
            onClick={() => setFilter('BIGGEST_WIN')}
            className={`flex-1 py-1.5 px-3 text-xs font-medium rounded-lg transition-colors ${
              filter === 'BIGGEST_WIN'
                ? 'bg-amber-500 text-stone-950 font-bold shadow-sm'
                : 'text-stone-400 hover:text-stone-200'
            }`}
          >
            Biggest Payouts
          </button>
          <button
            onClick={() => setFilter('HIGHEST_LEVEL')}
            className={`flex-1 py-1.5 px-3 text-xs font-medium rounded-lg transition-colors ${
              filter === 'HIGHEST_LEVEL'
                ? 'bg-amber-500 text-stone-950 font-bold shadow-sm'
                : 'text-stone-400 hover:text-stone-200'
            }`}
          >
            Highest Level Reached
          </button>
        </div>

        {/* Leaderboard Table */}
        <div className="p-4 overflow-y-auto space-y-2">
          {sortedEntries.map((entry, index) => {
            const isTop3 = index < 3;
            const rank = index + 1;
            return (
              <div
                key={entry.rank + entry.playerName}
                className={`flex items-center justify-between p-3 rounded-xl border transition-all ${
                  entry.isCurrentPlayer
                    ? 'bg-amber-500/10 border-amber-500/80 shadow-md shadow-amber-500/10'
                    : isTop3
                    ? 'bg-stone-950 border-stone-700/80'
                    : 'bg-stone-950/50 border-stone-800/60'
                }`}
              >
                <div className="flex items-center gap-3">
                  {/* Rank Badge */}
                  <div
                    className={`w-7 h-7 rounded-lg flex items-center justify-center font-bold text-xs font-mono shrink-0 ${
                      rank === 1
                        ? 'bg-amber-400 text-stone-950'
                        : rank === 2
                        ? 'bg-stone-300 text-stone-950'
                        : rank === 3
                        ? 'bg-amber-700 text-stone-100'
                        : 'bg-stone-800 text-stone-400'
                    }`}
                  >
                    {rank === 1 ? <Crown className="w-4 h-4" /> : rank}
                  </div>

                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-stone-100">
                        {entry.playerName} {entry.isCurrentPlayer && '(You)'}
                      </span>
                      <span className="text-[10px] text-stone-400 font-mono">{entry.country}</span>
                    </div>
                    <div className="flex items-center gap-2 text-[10px] text-stone-400">
                      <span>Level {entry.level}</span>
                      <span>·</span>
                      <span className="text-amber-400/90 font-medium">{entry.multiplier}x Multiplier</span>
                      <span>·</span>
                      <span>{entry.timestamp}</span>
                    </div>
                  </div>
                </div>

                <div className="text-right">
                  <div className="text-xs font-bold font-mono text-amber-400 tabular-nums">
                    ${entry.biggestWin.toLocaleString()}
                  </div>
                  <div className="text-[10px] text-stone-500">
                    Prize: ${Math.round(entry.biggestWin * 0.15).toLocaleString()}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Current player sticky footer stat */}
        <div className="p-4 bg-stone-950 border-t border-stone-800 flex items-center justify-between text-xs">
          <div className="flex items-center gap-2">
            <span className="text-stone-400">Your Current Bounty:</span>
            <span className="font-bold text-amber-400 font-mono">${playerBestWin.toLocaleString()}</span>
            <span className="text-stone-500">·</span>
            <span className="text-stone-300 font-semibold">Tier Level {playerLevel}</span>
          </div>
          <div className="text-amber-400 font-medium">Rank #12 Worldwide</div>
        </div>
      </div>
    </div>
  );
};
