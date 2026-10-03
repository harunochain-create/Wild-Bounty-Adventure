import {
  CascadeStep,
  GridTile,
  ShiftedTileInfo,
  SlotSymbol,
  SpinExecutionResult,
  SymbolId,
  WinningWay,
} from '../types/slot';

import cowgirlWildImg from '../assets/images/cowgirl_wild_1791021656800.jpg';
import outlawBanditImg from '../assets/images/outlaw_bandit_1791021670350.jpg';
import goldBarsScatterImg from '../assets/images/gold_bars_scatter_1791021682021.jpg';
import revolversHolsterImg from '../assets/images/revolvers_holster_1791021695119.jpg';
import whiskeyDecanterImg from '../assets/images/whiskey_decanter_1791021712789.jpg';
import purpleCowboyHatImg from '../assets/images/purple_cowboy_hat_1791021725245.jpg';
import letterAImg from '../assets/images/letter_a.png';
import letterKImg from '../assets/images/letter_k.png';
import letterQImg from '../assets/images/letter_q.png';
import letterJImg from '../assets/images/letter_j.png';

// 10 Original Game Asset PNGs
export const COWGIRL_WILD_IMG = cowgirlWildImg;
export const OUTLAW_BANDIT_IMG = outlawBanditImg;
export const GOLD_BARS_SCATTER_IMG = goldBarsScatterImg;
export const REVOLVERS_HOLSTER_IMG = revolversHolsterImg;
export const WHISKEY_DECANTER_IMG = whiskeyDecanterImg;
export const PURPLE_COWBOY_HAT_IMG = purpleCowboyHatImg;
export const LETTER_A_IMG = letterAImg;
export const LETTER_K_IMG = letterKImg;
export const LETTER_Q_IMG = letterQImg;
export const LETTER_J_IMG = letterJImg;

// Exact 3-4-5-5-4-3 Shield Grid: 24 tiles total
export const NUM_COLUMNS = 6;
export const MAX_ROWS = 5;
export const REEL_ROW_COUNTS = [3, 4, 5, 5, 4, 3] as const;

let globalTileCounter = 0;
export function nextTileId(): string {
  globalTileCounter++;
  return `tile_${Date.now()}_${globalTileCounter}_${Math.random().toString(36).substring(2, 6)}`;
}

export const SYMBOLS: Record<SymbolId, SlotSymbol> = {
  WILD: {
    id: 'WILD',
    name: 'Cowgirl Wild',
    payouts: [0, 0, 0], // Wild substitutes for the regular symbol with highest count
    isWild: true,
    color: '#F59E0B',
    image: COWGIRL_WILD_IMG,
  },
  SCATTER: {
    id: 'SCATTER',
    name: 'Gold Bars Scatter',
    payouts: [0, 0, 0], // 3+ Scatters award 10 Free Spins
    isScatter: true,
    color: '#EF4444',
    image: GOLD_BARS_SCATTER_IMG,
  },
  BANDIT: {
    id: 'BANDIT',
    name: 'Outlaw Bandit',
    payouts: [8, 20, 40], // 6-7, 8-9, 10+
    color: '#EF4444',
    image: OUTLAW_BANDIT_IMG,
  },
  REVOLVERS: {
    id: 'REVOLVERS',
    name: 'Dual Revolvers',
    payouts: [4, 10, 20],
    color: '#F59E0B',
    image: REVOLVERS_HOLSTER_IMG,
  },
  HAT: {
    id: 'HAT',
    name: 'Cowboy Hat',
    payouts: [2.5, 6, 12],
    color: '#A855F7',
    image: PURPLE_COWBOY_HAT_IMG,
  },
  WHISKEY: {
    id: 'WHISKEY',
    name: 'Saloon Whiskey',
    payouts: [1.5, 4, 8],
    color: '#D97706',
    image: WHISKEY_DECANTER_IMG,
  },
  A: {
    id: 'A',
    name: 'Golden Ace',
    payouts: [1.0, 2.0, 6],
    color: '#FBBF24',
    image: LETTER_A_IMG,
  },
  K: {
    id: 'K',
    name: 'Crimson King',
    payouts: [0.8, 1.5, 5],
    color: '#DC2626',
    image: LETTER_K_IMG,
  },
  Q: {
    id: 'Q',
    name: 'Sage Queen',
    payouts: [0.6, 1.2, 4],
    color: '#10B981',
    image: LETTER_Q_IMG,
  },
  J: {
    id: 'J',
    name: 'Frontier Jack',
    payouts: [0.4, 0.8, 3],
    color: '#3B82F6',
    image: LETTER_J_IMG,
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
  { symbol: 'J', weight: 26 },
  { symbol: 'Q', weight: 24 },
  { symbol: 'K', weight: 22 },
  { symbol: 'A', weight: 20 },
  { symbol: 'WHISKEY', weight: 16 },
  { symbol: 'HAT', weight: 14 },
  { symbol: 'REVOLVERS', weight: 12 },
  { symbol: 'BANDIT', weight: 10 },
  { symbol: 'WILD', weight: 6 }, // WILD can appear on ALL columns
  { symbol: 'SCATTER', weight: 5 }, // 4+ triggers 10 free spins
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

export function getRandomSymbol(seedFloat: number, level: number): SymbolId {
  const weights = REEL_WEIGHTS.map((item) => {
    let w = item.weight;
    if (level >= 3 && (item.symbol === 'BANDIT' || item.symbol === 'WILD')) {
      w += 3;
    }
    return { symbol: item.symbol, weight: w };
  });

  const totalWeight = weights.reduce((acc, curr) => acc + curr.weight, 0);
  let threshold = seedFloat * totalWeight;

  for (const item of weights) {
    if (threshold < item.weight) {
      return item.symbol;
    }
    threshold -= item.weight;
  }
  return 'J';
}

// Generate an initial 3-4-5-5-4-3 shield grid (24 tiles total)
export function generateInitialTileGrid(level: number): GridTile[][] {
  const grid: GridTile[][] = [];
  for (let col = 0; col < NUM_COLUMNS; col++) {
    const rowCount = REEL_ROW_COUNTS[col];
    const colTiles: GridTile[] = [];
    for (let row = 0; row < rowCount; row++) {
      colTiles.push({
        id: nextTileId(),
        symbol: getRandomSymbol(Math.random(), level),
        col,
        row,
      });
    }
    grid.push(colTiles);
  }
  return grid;
}

// Evaluate Pay Anywhere for 24-tile Shield Grid:
// - Symbols win if count >= 6 anywhere on the 24-tile grid.
// - No adjacent rule, no left-to-right requirement.
// - Tiers: 6-7 (payouts[0]), 8-9 (payouts[1]), 10+ (payouts[2]).
// - WILD substitutes for the regular symbol with the highest count, appearing on all columns.
export function evaluatePayAnywhere(grid: GridTile[][], totalBet: number): {
  winningWays: WinningWay[];
  totalPayout: number;
  winningTileIds: string[];
} {
  const regularSymbols: SymbolId[] = ['BANDIT', 'REVOLVERS', 'HAT', 'WHISKEY', 'A', 'K', 'Q', 'J'];
  const symbolTilesMap: Record<SymbolId, GridTile[]> = {
    BANDIT: [],
    REVOLVERS: [],
    HAT: [],
    WHISKEY: [],
    A: [],
    K: [],
    Q: [],
    J: [],
    WILD: [],
    SCATTER: [],
  };

  // Collect tiles across all 24 tiles
  for (let col = 0; col < NUM_COLUMNS; col++) {
    const rowCount = REEL_ROW_COUNTS[col];
    for (let row = 0; row < rowCount; row++) {
      const tile = grid[col]?.[row];
      if (tile) {
        symbolTilesMap[tile.symbol]?.push(tile);
      }
    }
  }

  const wildTiles = symbolTilesMap.WILD;
  const wildCount = wildTiles.length;

  // Find regular symbol with highest natural count to assign WILDs
  let bestRegularSymbol: SymbolId = 'BANDIT';
  let maxCount = -1;

  for (const sym of regularSymbols) {
    const count = symbolTilesMap[sym].length;
    if (count > maxCount) {
      maxCount = count;
      bestRegularSymbol = sym;
    }
  }

  const winningWays: WinningWay[] = [];
  const winningTileIdSet = new Set<string>();
  let totalPayout = 0;

  for (const sym of regularSymbols) {
    const naturalTiles = symbolTilesMap[sym];
    let totalCount = naturalTiles.length;
    const combinedTiles = [...naturalTiles];

    // Assign WILD to the symbol with the highest count
    if (sym === bestRegularSymbol && wildCount > 0) {
      totalCount += wildCount;
      combinedTiles.push(...wildTiles);
    }

    if (totalCount >= 6) {
      const symConfig = SYMBOLS[sym];
      // Tiers: 6-7 (idx 0), 8-9 (idx 1), 10+ (idx 2)
      let tierIdx = 0;
      if (totalCount >= 10) tierIdx = 2;
      else if (totalCount >= 8) tierIdx = 1;

      const payoutMultiplier = symConfig.payouts[tierIdx];
      const winAmount = totalBet * payoutMultiplier;

      const winningIds = combinedTiles.map((t) => t.id);
      winningIds.forEach((id) => winningTileIdSet.add(id));

      totalPayout += winAmount;
      winningWays.push({
        symbol: sym,
        count: totalCount,
        payout: winAmount,
        symbolPositions: combinedTiles.map((t) => ({ reel: t.col, row: t.row })),
        winningTileIds: winningIds,
      });
    }
  }

  return {
    winningWays,
    totalPayout,
    winningTileIds: Array.from(winningTileIdSet),
  };
}

// Full Cascade Step Engine for 24-tile Shield Grid:
// - Evaluates 6+ scatter-pays
// - Identifies exploded tiles
// - Surviving tiles fall down by gravity per column
// - Fresh tiles enter from above the frame with isNew: true
export function executeFullCascadeSpin(
  initialGrid: GridTile[][],
  totalBet: number,
  currentLevel: number,
  scattersCollected: number,
  isFreeSpins: boolean = false
): SpinExecutionResult {
  const steps: CascadeStep[] = [];
  // Clone grid of GridTiles
  let currentGrid: GridTile[][] = initialGrid.map((colTiles) =>
    colTiles.map((tile) => ({ ...tile }))
  );
  const multipliersTrack = isFreeSpins ? FREE_SPIN_MULTIPLIERS : BASE_MULTIPLIERS;
  let cascadeIndex = 0;
  let totalWin = 0;
  let totalScatters = 0;
  const scatterPositions: { reel: number; row: number }[] = [];

  // Count initial scatters on the 24 tiles
  for (let col = 0; col < NUM_COLUMNS; col++) {
    const rowCount = REEL_ROW_COUNTS[col];
    for (let row = 0; row < rowCount; row++) {
      if (currentGrid[col]?.[row]?.symbol === 'SCATTER') {
        totalScatters++;
        scatterPositions.push({ reel: col, row });
      }
    }
  }

  while (cascadeIndex < 10) {
    const { winningWays, totalPayout, winningTileIds } = evaluatePayAnywhere(currentGrid, totalBet);
    const currentMultiplier = multipliersTrack[Math.min(cascadeIndex, multipliersTrack.length - 1)];
    const stepWin = Math.round(totalPayout * currentMultiplier);
    totalWin += stepWin;

    // Snapshot current grid with isWinning flags marked
    const markedGrid: GridTile[][] = currentGrid.map((colTiles) =>
      colTiles.map((t) => ({
        ...t,
        isWinning: winningTileIds.includes(t.id),
      }))
    );

    const explodedTiles: GridTile[] = [];
    currentGrid.forEach((colTiles) => {
      colTiles.forEach((t) => {
        if (winningTileIds.includes(t.id)) {
          explodedTiles.push(t);
        }
      });
    });

    if (winningWays.length === 0) {
      steps.push({
        grid: markedGrid,
        winningTileIds: [],
        winningWays: [],
        multiplier: currentMultiplier,
        stepWin: 0,
        scatterCount: cascadeIndex === 0 ? totalScatters : 0,
        scatterPositions: cascadeIndex === 0 ? scatterPositions : [],
        explodedTiles: [],
        shiftedTiles: [],
        newTiles: [],
      });
      break; // No wins, cascade ends
    }

    // CASCADE PHYSICS (Gravity per column):
    const nextGrid: GridTile[][] = [];
    const shiftedTiles: ShiftedTileInfo[] = [];
    const allNewTilesInStep: GridTile[] = [];

    for (let col = 0; col < NUM_COLUMNS; col++) {
      const colRowCount = REEL_ROW_COUNTS[col];
      // Surviving tiles in this column
      const surviving = currentGrid[col].filter((t) => !winningTileIds.includes(t.id));
      const neededCount = colRowCount - surviving.length;

      // Surviving tiles shift down by neededCount
      const updatedSurviving: GridTile[] = surviving.map((t, idx) => {
        const targetRow = neededCount + idx;
        if (t.row !== targetRow) {
          shiftedTiles.push({
            id: t.id,
            col,
            fromRow: t.row,
            toRow: targetRow,
          });
        }
        return {
          ...t,
          row: targetRow,
          isWinning: false,
          isNew: false,
        };
      });

      // New tiles entering from top of column
      const newColTiles: GridTile[] = [];
      for (let r = 0; r < neededCount; r++) {
        const newTile: GridTile = {
          id: nextTileId(),
          symbol: getRandomSymbol(Math.random(), currentLevel),
          col,
          row: r,
          isWinning: false,
          isNew: true,
        };
        newColTiles.push(newTile);
        allNewTilesInStep.push(newTile);
      }

      nextGrid.push([...newColTiles, ...updatedSurviving]);
    }

    steps.push({
      grid: markedGrid,
      winningTileIds,
      winningWays,
      multiplier: currentMultiplier,
      stepWin,
      scatterCount: cascadeIndex === 0 ? totalScatters : 0,
      scatterPositions: cascadeIndex === 0 ? scatterPositions : [],
      explodedTiles,
      shiftedTiles,
      newTiles: allNewTilesInStep,
    });

    currentGrid = nextGrid;
    cascadeIndex++;
  }

  // Scatter & Free Spins Rule:
  // - Mode normal: 3 scatter = 10 free spin, tiap scatter tambahan = +2 free spin.
  // - Saat free spin berjalan: 3 atau lebih scatter hanya menambah 5 free spin (tetap 5).
  let levelUpOccurred = false;
  let newLevel = currentLevel;
  let awardedFreeSpins = 0;

  if (totalScatters >= 3) {
    if (isFreeSpins) {
      awardedFreeSpins = 5; // Retrigger gives fixed 5 free spins
    } else {
      awardedFreeSpins = 10 + (totalScatters - 3) * 2;
    }
  }

  const currentCfg = LEVEL_CONFIGS[currentLevel - 1] || LEVEL_CONFIGS[0];
  const req = currentCfg.reqScatters;

  if (totalScatters >= req || (scattersCollected + totalScatters) >= req) {
    if (currentLevel < 5) {
      newLevel = currentLevel + 1;
      levelUpOccurred = true;
    }
    // If leveled up with at least 3 scatters, ensure awardedFreeSpins is calculated
    if (awardedFreeSpins === 0 && totalScatters >= 3) {
      awardedFreeSpins = isFreeSpins ? 5 : 10 + (totalScatters - 3) * 2;
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
