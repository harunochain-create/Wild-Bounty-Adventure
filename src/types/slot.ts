export type SymbolId =
  | 'WILD'
  | 'SCATTER'
  | 'BANDIT'
  | 'REVOLVERS'
  | 'HAT'
  | 'WHISKEY'
  | 'A'
  | 'K'
  | 'Q'
  | 'J';

export interface SlotSymbol {
  id: SymbolId;
  name: string;
  payouts: [number, number, number, number]; // 3, 4, 5, 6 of a kind
  isWild?: boolean;
  isScatter?: boolean;
  color: string;
  image?: string;
}

export interface WinningWay {
  symbol: SymbolId;
  reelCount: number; // e.g. 3, 4, 5, or 6 reels
  totalWays: number; // ways = count0 * count1 * count2...
  payout: number;
  symbolPositions: { reel: number; row: number }[];
}

export interface CascadeStep {
  grid: SymbolId[][];
  winningWays: WinningWay[];
  multiplier: number;
  stepWin: number;
  scatterCount: number;
  scatterPositions: { reel: number; row: number }[];
}

export interface SpinExecutionResult {
  initialGrid: SymbolId[][];
  steps: CascadeStep[];
  totalWin: number;
  totalScatters: number;
  awardedFreeSpins: number;
  finalGrid: SymbolId[][];
  maxMultiplierReached: number;
  levelUpOccurred: boolean;
  newLevel: number;
}

export interface Transaction {
  id: string;
  type: 'DEPOSIT' | 'WITHDRAW' | 'BONUS_RELOAD';
  method: string;
  amount: number;
  currency: 'USD' | 'IDR';
  timestamp: number;
  status: 'COMPLETED' | 'PENDING' | 'PROCESSING';
  reference: string;
}

export interface LeaderboardEntry {
  rank: number;
  playerName: string;
  country: string;
  biggestWin: number;
  level: number;
  multiplier: number;
  timestamp: string;
  isCurrentPlayer?: boolean;
}
