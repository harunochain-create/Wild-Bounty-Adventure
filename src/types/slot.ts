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
  payouts: [number, number, number]; // 6-7, 8-9, 10+ symbols anywhere
  isWild?: boolean;
  isScatter?: boolean;
  color: string;
  image?: string;
}

export interface GridTile {
  id: string; // Unique persistent ID, used as React key
  symbol: SymbolId;
  col: number; // 0 to 5
  row: number; // 0 to 4
  isWinning?: boolean;
  isNew?: boolean; // True if just dropped into the column during tumble
}

export interface WinningWay {
  symbol: SymbolId;
  count: number; // 6-7, 8-9, 10+
  payout: number;
  symbolPositions: { reel: number; row: number }[];
  winningTileIds: string[];
}

export interface ShiftedTileInfo {
  id: string;
  col: number;
  fromRow: number;
  toRow: number;
}

export interface CascadeStep {
  grid: GridTile[][];
  winningTileIds: string[];
  winningWays: WinningWay[];
  multiplier: number;
  stepWin: number;
  scatterCount: number;
  scatterPositions: { reel: number; row: number }[];
  explodedTiles: GridTile[];
  shiftedTiles: ShiftedTileInfo[];
  newTiles: GridTile[];
}

export interface SpinExecutionResult {
  initialGrid: GridTile[][];
  steps: CascadeStep[];
  totalWin: number;
  totalScatters: number;
  awardedFreeSpins: number;
  finalGrid: GridTile[][];
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
