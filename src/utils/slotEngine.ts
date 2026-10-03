import { CascadeStep, SlotSymbol, SpinExecutionResult, SymbolId, WinningWay } from '../types/slot';

// 6 Generated High-Quality Game Assets
export const COWGIRL_WILD_IMG = '/src/assets/images/cowgirl_wild_1791021656800.jpg';
export const OUTLAW_BANDIT_IMG = '/src/assets/images/outlaw_bandit_1791021670350.jpg';
export const GOLD_BARS_SCATTER_IMG = '/src/assets/images/gold_bars_scatter_1791021682021.jpg';
export const REVOLVERS_HOLSTER_IMG = '/src/assets/images/revolvers_holster_1791021695119.jpg';
export const WHISKEY_DECANTER_IMG = '/src/assets/images/whiskey_decanter_1791021712789.jpg';
export const PURPLE_COWBOY_HAT_IMG = '/src/assets/images/purple_cowboy_hat_1791021725245.jpg';

// Exact 3600 WAYS layout: [3, 4, 5, 5, 4, 3] -> 3 * 4 * 5 * 5 * 4 * 3 = 3600
export const REEL_ROW_COUNTS = [3, 4, 5, 5, 4, 3] as const;

export const SYMBOLS: Record<SymbolId, SlotSymbol> = {
  WILD: {
    id: 'WILD',
    name: 'Cowgirl Wild',
    payouts: [0, 0, 0, 0], // Wild substitutes all paying symbols
    isWild: true,
    color: '#F59E0B',
    image: COWGIRL_WILD_IMG,
  },
  SCATTER: {
    id: 'SCATTER',
    name: 'Gold Bars Scatter',
    payouts: [0, 0, 0, 0], // Scatter awards 10 Free Spins and Level Up!
    isScatter: true,
    color: '#EF4444',
    image: GOLD_BARS_SCATTER_IMG,
  },
  BANDIT: {
    id: 'BANDIT',
    name: 'Outlaw Bandit',
    payouts: [20, 50, 100, 200],
    color: '#EF4444',
    image: OUTLAW_BANDIT_IMG,
  },
  REVOLVERS: {
    id: 'REVOLVERS',
    name: 'Dual Revolvers',
    payouts: [15, 30, 60, 120],
    color: '#F59E0B',
    image: REVOLVERS_HOLSTER_IMG,
  },
  HAT: {
    id: 'HAT',
    name: 'Cowboy Hat',
    payouts: [10, 20, 40, 80],
    color: '#A855F7',
    image: PURPLE_COWBOY_HAT_IMG,
  },
  WHISKEY: {
    id: 'WHISKEY',
    name: 'Saloon Whiskey',
    payouts: [8, 15, 30, 60],
    color: '#D97706',
    image: WHISKEY_DECANTER_IMG,
  },
  A: {
    id: 'A',
    name: 'Golden Ace',
    payouts: [5, 10, 20, 40],
    color: '#FBBF24',
  },
  K: {
    id: 'K',
    name: 'Crimson King',
    payouts: [5, 10, 20, 40],
    color: '#DC2626',
  },
  Q: {
    id: 'Q',
    name: 'Sage Queen',
    payouts: [3, 6, 12, 25],
    color: '#10B981',
  },
  J: {
    id: 'J',
    name: 'Frontier Jack',
    payouts: [3, 6, 12, 25],
    color: '#3B82F6',
  },
};

export const BASE_MULTIPLIERS = [1, 2, 4, 8, 16, 32, 64, 128, 256, 512, 1024];
export const FREE_SPIN_MULTIPLIERS = [8, 16, 32, 64, 128, 256, 512, 1024];

export const LEVEL_CONFIGS = [
  { level: 1, title: 'Deputy Greenhorn', reqScatters: 1, color: '#94A3B8' },
  { level: 2, title: 'Frontier Gunslinger', reqScatters: 2, color: '#38BDF8' },
  { level: 3, title: 'Bounty Hunter', reqScatters: 3, color: '#F59E0B' },
  { level: 4, title: 'Federal Marshal', reqScatters: 4, color: '#EC4899' },
  { level: 5, title: 'Wild Bounty Legend', reqScatters: 5, color: '#EAB308' },
];

export const REEL_WEIGHTS: { symbol: SymbolId; weight: number }[] = [
  { symbol: 'J', weight: 22 },
  { symbol: 'Q', weight: 20 },
  { symbol: 'K', weight: 18 },
  { symbol: 'A', weight: 16 },
  { symbol: 'WHISKEY', weight: 13 },
  { symbol: 'HAT', weight: 11 },
  { symbol: 'REVOLVERS', weight: 9 },
  { symbol: 'BANDIT', weight: 7 },
  { symbol: 'WILD', weight: 4 }, // Wild appears on reels 2, 3, 4, 5
  { symbol: 'SCATTER', weight: 5 }, // Scatter gives exciting level progression & 10 free spins
];

// Cryptographic RNG
export function generateRandomHex(length: number = 32): string {
  const array = new Uint8Array(length);
  crypto.getRandomValues(array);
  return Array.from(array)
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('');
}

export async function sha256(message: string): Promise<string> {
  const msgUint8 = new TextEncoder().encode(message);
  const hashBuffer = await crypto.subtle.digest('SHA-256', msgUint8);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map((b) => b.toString(16).padStart(2, '0')).join('');
}

export function hashToFloat(hexString: string): number {
  const subHex = hexString.substring(0, 8);
  const intVal = parseInt(subHex, 16);
  return intVal / 0xffffffff;
}

export function getRandomSymbol(seedFloat: number, reelIndex: number, level: number): SymbolId {
  // Wild cannot appear on reel 0 or 5 in 3600 ways games
  const filtered = REEL_WEIGHTS.map((item) => {
    let w = item.weight;
    if ((reelIndex === 0 || reelIndex === 5) && item.symbol === 'WILD') {
      w = 0;
    }
    // High level perks
    if (level >= 3 && (item.symbol === 'BANDIT' || item.symbol === 'WILD')) {
      w += 3;
    }
    return { symbol: item.symbol, weight: w };
  }).filter((i) => i.weight > 0);

  const totalWeight = filtered.reduce((acc, curr) => acc + curr.weight, 0);
  let threshold = seedFloat * totalWeight;

  for (const item of filtered) {
    if (threshold < item.weight) {
      return item.symbol;
    }
    threshold -= item.weight;
  }
  return 'J';
}

// Generate an initial 6-reel grid: [3, 4, 5, 5, 4, 3]
export function generateInitialGrid(level: number): SymbolId[][] {
  const grid: SymbolId[][] = [];
  for (let reel = 0; reel < REEL_ROW_COUNTS.length; reel++) {
    const numRows = REEL_ROW_COUNTS[reel];
    const col: SymbolId[] = [];
    for (let row = 0; row < numRows; row++) {
      const floatVal = Math.random();
      col.push(getRandomSymbol(floatVal, reel, level));
    }
    grid.push(col);
  }
  return grid;
}

// Evaluate 3600 Ways wins across the 6 reels
export function evaluateWays(grid: SymbolId[][], baseBet: number): {
  winningWays: WinningWay[];
  totalPayout: number;
} {
  const regularSymbols: SymbolId[] = ['BANDIT', 'REVOLVERS', 'HAT', 'WHISKEY', 'A', 'K', 'Q', 'J'];
  const winningWays: WinningWay[] = [];
  let totalPayout = 0;

  for (const targetSym of regularSymbols) {
    let consecutiveReels = 0;
    let waysMultiplier = 1;
    const positions: { reel: number; row: number }[] = [];

    for (let reel = 0; reel < grid.length; reel++) {
      const matchingRowsOnReel: number[] = [];
      for (let row = 0; row < grid[reel].length; row++) {
        const s = grid[reel][row];
        if (s === targetSym || s === 'WILD') {
          matchingRowsOnReel.push(row);
          positions.push({ reel, row });
        }
      }

      if (matchingRowsOnReel.length > 0) {
        consecutiveReels++;
        waysMultiplier *= matchingRowsOnReel.length;
      } else {
        break; // Ways must be strictly adjacent from reel 0
      }
    }

    if (consecutiveReels >= 3) {
      const symConfig = SYMBOLS[targetSym];
      const payoutIndex = consecutiveReels - 3; // 3 reels -> index 0, 4 -> 1, 5 -> 2, 6 -> 3
      const basePay = symConfig.payouts[payoutIndex] || 0;
      const wayWin = (baseBet / 20) * (basePay / 10) * waysMultiplier;

      totalPayout += wayWin;
      winningWays.push({
        symbol: targetSym,
        reelCount: consecutiveReels,
        totalWays: waysMultiplier,
        payout: wayWin,
        symbolPositions: positions.filter((p) => p.reel < consecutiveReels),
      });
    }
  }

  return { winningWays, totalPayout };
}

// Full Cascade Step Engine:
// 1. Evaluates winning ways
// 2. Removes winning symbols
// 3. Drops surviving symbols down
// 4. Fills top rows with newly dropped symbols from above
// 5. Multiplier doubles on each cascade!
export function executeFullCascadeSpin(
  initialGrid: SymbolId[][],
  totalBet: number,
  currentLevel: number,
  scattersCollected: number,
  isFreeSpins: boolean = false
): SpinExecutionResult {
  const steps: CascadeStep[] = [];
  let currentGrid = initialGrid.map((col) => [...col]);
  const multipliersTrack = isFreeSpins ? FREE_SPIN_MULTIPLIERS : BASE_MULTIPLIERS;
  let cascadeIndex = 0;
  let totalWin = 0;
  let totalScatters = 0;
  const scatterPositions: { reel: number; row: number }[] = [];

  // Count initial scatters on the board
  for (let r = 0; r < currentGrid.length; r++) {
    for (let row = 0; row < currentGrid[r].length; row++) {
      if (currentGrid[r][row] === 'SCATTER') {
        totalScatters++;
        scatterPositions.push({ reel: r, row });
      }
    }
  }

  // Loop cascades until no more winning ways form
  while (cascadeIndex < 10) {
    const { winningWays, totalPayout } = evaluateWays(currentGrid, totalBet);
    const currentMultiplier = multipliersTrack[Math.min(cascadeIndex, multipliersTrack.length - 1)];
    const stepWin = Math.round(totalPayout * currentMultiplier);
    totalWin += stepWin;

    steps.push({
      grid: currentGrid.map((c) => [...c]),
      winningWays,
      multiplier: currentMultiplier,
      stepWin,
      scatterCount: cascadeIndex === 0 ? totalScatters : 0,
      scatterPositions: cascadeIndex === 0 ? scatterPositions : [],
    });

    if (winningWays.length === 0) {
      break; // No more wins, cascade ends
    }

    // Set of winning coordinates to remove
    const winningCoordsSet = new Set<string>();
    winningWays.forEach((way) => {
      way.symbolPositions.forEach((pos) => {
        winningCoordsSet.add(`${pos.reel},${pos.row}`);
      });
    });

    // CASCADE PHYSICS (FALL DOWN):
    // For each column: keep surviving symbols, drop them to bottom, spawn fresh symbols at top
    const nextGrid: SymbolId[][] = [];
    for (let r = 0; r < currentGrid.length; r++) {
      const maxRows = REEL_ROW_COUNTS[r];
      // Surviving symbols in this reel (those NOT in winningCoordsSet)
      const surviving = currentGrid[r].filter((_, rowIdx) => !winningCoordsSet.has(`${r},${rowIdx}`));
      const neededCount = maxRows - surviving.length;

      // Generate new symbols falling in from top
      const newFallingSymbols: SymbolId[] = [];
      for (let n = 0; n < neededCount; n++) {
        newFallingSymbols.push(getRandomSymbol(Math.random(), r, currentLevel));
      }

      // New symbols enter from top, followed by surviving falling symbols
      nextGrid.push([...newFallingSymbols, ...surviving]);
    }

    currentGrid = nextGrid;
    cascadeIndex++;
  }

  // Level Progression & Scatter Rules:
  // "jika dapat Scatter maka dapat 10 free spin"
  // "Syarat naik level jika dapat 1 Scatter maka akan naik level berikutnya. jika level 2 ingin naik ke level 3 harus dapat 2 Scatter dulu dan seterusnya"
  let levelUpOccurred = false;
  let newLevel = currentLevel;
  let awardedFreeSpins = 0;

  if (totalScatters > 0) {
    // Award 10 Free Spins whenever Scatter hits!
    awardedFreeSpins = 10;

    const currentCfg = LEVEL_CONFIGS[currentLevel - 1] || LEVEL_CONFIGS[0];
    const req = currentCfg.reqScatters;

    if (totalScatters >= req || (scattersCollected + totalScatters) >= req) {
      if (currentLevel < 5) {
        newLevel = currentLevel + 1;
        levelUpOccurred = true;
      }
    }
  }

  return {
    initialGrid,
    steps,
    totalWin,
    totalScatters,
    awardedFreeSpins,
    finalGrid: currentGrid,
    maxMultiplierReached: multipliersTrack[Math.min(cascadeIndex, multipliersTrack.length - 1)],
    levelUpOccurred,
    newLevel,
  };
}
