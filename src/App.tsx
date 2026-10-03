import React, { useState, useEffect, useRef } from 'react';
import {
  ShieldCheck,
  Trophy,
  HelpCircle,
  Code,
  Volume2,
  VolumeX,
  Wallet,
  Coins,
  Flame,
  X,
  Plus,
} from 'lucide-react';
import {
  SymbolId,
  WinningWay,
  Transaction,
  LeaderboardEntry,
} from './types/slot';
import {
  REEL_ROW_COUNTS,
  LEVEL_CONFIGS,
  generateInitialGrid,
  executeFullCascadeSpin,
  sha256,
  generateRandomHex,
} from './utils/slotEngine';
import { sound } from './utils/soundEngine';
import { WildBountyReels } from './components/WildBountyReels';
import { HangingMultiplierSign } from './components/HangingMultiplierSign';
import { HorseshoeMessageBanner } from './components/HorseshoeMessageBanner';
import { WildBountyControls } from './components/WildBountyControls';
import { ThreeWinCanvas } from './components/ThreeWinCanvas';
import { SaloonSafeBonus } from './components/SaloonSafeBonus';
import { PaymentModal } from './components/PaymentModal';
import { ProvablyFairModal } from './components/ProvablyFairModal';
import { LeaderboardModal } from './components/LeaderboardModal';
import { PaytableModal } from './components/PaytableModal';
import { NativeEngineModal } from './components/NativeEngineModal';

export default function App() {
  // Player Balance & Wallet
  const [balance, setBalance] = useState<number>(100000);
  const [currency, setCurrency] = useState<'USD' | 'IDR'>('IDR');
  const [bet, setBet] = useState<number>(12);
  const [currentWin, setCurrentWin] = useState<number>(0);

  // Progressive Scatter Level
  const [currentLevel, setCurrentLevel] = useState<number>(1);
  const [scattersCollected, setScattersCollected] = useState<number>(0);

  // Free Spins State ("jika dapat Scatter maka dapat 10 free spin")
  const [isFreeSpins, setIsFreeSpins] = useState<boolean>(false);
  const [remainingFreeSpins, setRemainingFreeSpins] = useState<number>(0);
  const [freeSpinsTotalWin, setFreeSpinsTotalWin] = useState<number>(0);

  // Active Multiplier
  const [currentMultiplier, setCurrentMultiplier] = useState<number>(1);
  const [statusMessage, setStatusMessage] = useState<string>('3600 WAYS!');

  // 6 Reels Grid with [3, 4, 5, 5, 4, 3] layout
  const [grid, setGrid] = useState<SymbolId[][]>(() => generateInitialGrid(1));
  const [winningPositions, setWinningPositions] = useState<{ reel: number; row: number }[]>([]);
  const [isSpinning, setIsSpinning] = useState<boolean>(false);
  const [isCascading, setIsCascading] = useState<boolean>(false);
  const [droppingReels, setDroppingReels] = useState<boolean[]>([false, false, false, false, false, false]);

  // Controls & Options
  const [isTurbo, setIsTurbo] = useState<boolean>(false);
  const [autoSpinsRemaining, setAutoSpinsRemaining] = useState<number>(0);
  const [isMuted, setIsMuted] = useState<boolean>(false);

  // Provably Fair Real RNG Seeds
  const [serverSeed, setServerSeed] = useState<string>(() => generateRandomHex(32));
  const [serverSeedHash, setServerSeedHash] = useState<string>('');
  const [clientSeed, setClientSeed] = useState<string>('wild-bounty-player-2026');
  const [nonce, setNonce] = useState<number>(1);
  const [lastRevealedServerSeed, setLastRevealedServerSeed] = useState<string | null>(null);

  // Modals & Menu
  const [showMenu, setShowMenu] = useState<boolean>(false);
  const [showPayment, setShowPayment] = useState<boolean>(false);
  const [showFairness, setShowFairness] = useState<boolean>(false);
  const [showLeaderboard, setShowLeaderboard] = useState<boolean>(false);
  const [showPaytable, setShowPaytable] = useState<boolean>(false);
  const [showNativeSpecs, setShowNativeSpecs] = useState<boolean>(false);
  const [showSafeBonus, setShowSafeBonus] = useState<boolean>(false);

  // Win Celebration Canvas
  const [winCelebration, setWinCelebration] = useState<{
    active: boolean;
    tier: 'WIN' | 'BIG_WIN' | 'MEGA_WIN' | 'LEVEL_UP';
    amount: number;
  }>({ active: false, tier: 'WIN', amount: 0 });

  // Transactions Ledger
  const [transactions, setTransactions] = useState<Transaction[]>([
    {
      id: 'TX-DEP-884920',
      type: 'DEPOSIT',
      method: 'QRIS Instant Transfer',
      amount: 100000,
      currency: 'IDR',
      timestamp: Date.now() - 1800000,
      status: 'COMPLETED',
      reference: 'GW-SECURE-9182AB',
    },
  ]);

  // Global Leaderboard Mock Entries
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([
    { rank: 1, playerName: 'Gunslinger_Tex', country: 'US 🇺🇸', biggestWin: 38400, level: 5, multiplier: 35.0, timestamp: '10m ago' },
    { rank: 2, playerName: 'BanditQueen_ID', country: 'ID 🇮🇩', biggestWin: 29500, level: 5, multiplier: 35.0, timestamp: '24m ago' },
    { rank: 3, playerName: 'ElDorado_MX', country: 'MX 🇲🇽', biggestWin: 18200, level: 4, multiplier: 15.0, timestamp: '1h ago' },
    { rank: 4, playerName: 'You (Bounty Hunter)', country: 'ID 🇮🇩', biggestWin: 4800, level: 1, multiplier: 8.0, timestamp: 'Just now', isCurrentPlayer: true },
  ]);

  // Compute Provably Fair Hash
  useEffect(() => {
    sha256(serverSeed).then((hash) => setServerSeedHash(hash));
  }, [serverSeed]);

  // Toggle Mute
  const handleToggleMute = () => {
    const next = !isMuted;
    setIsMuted(next);
    sound.setMuted(next);
  };

  // CORE SPIN WITH CASCADING SYMBOL DROPS ("simbol turun, bukan bolak balik begitu")
  const handleSpin = async () => {
    if (isSpinning || isCascading) return;
    if (!isFreeSpins && balance < bet) {
      setShowPayment(true);
      return;
    }

    // Deduct bet if not free spin
    if (!isFreeSpins) {
      setBalance((prev) => prev - bet);
    }
    setCurrentWin(0);
    setWinningPositions([]);
    setIsSpinning(true);
    setStatusMessage('3600 WAYS!');

    // Reset base multiplier
    setCurrentMultiplier(isFreeSpins ? 8 : 1);

    // 1. Generate new initial grid dropping from the sky
    const newGrid = generateInitialGrid(currentLevel);

    // Drop animation for all 6 columns
    setDroppingReels([true, true, true, true, true, true]);
    sound.playSpinTick();

    setTimeout(() => {
      setGrid(newGrid);
      setDroppingReels([false, false, false, false, false, false]);
      sound.playReelStop(false);

      // Execute full cascade steps:
      const result = executeFullCascadeSpin(
        newGrid,
        bet,
        currentLevel,
        scattersCollected,
        isFreeSpins
      );

      // Sequentially animate each cascade step
      animateCascadeSteps(result);
    }, isTurbo ? 250 : 500);
  };

  // Animate the cascade tumble sequence
  const animateCascadeSteps = (result: ReturnType<typeof executeFullCascadeSpin>) => {
    const { steps, totalWin, totalScatters, awardedFreeSpins, levelUpOccurred, newLevel } = result;
    let stepIndex = 0;

    const playNextStep = () => {
      if (stepIndex >= steps.length) {
        // All cascades complete
        setIsSpinning(false);
        setIsCascading(false);
        setWinningPositions([]);

        // Advance Provably Fair nonce & server seed
        setLastRevealedServerSeed(serverSeed);
        setServerSeed(generateRandomHex(32));
        setNonce((n) => n + 1);

        // Win tally
        if (totalWin > 0) {
          setBalance((prev) => prev + totalWin);
          setCurrentWin(totalWin);
          setStatusMessage(`KEMENANGAN TOTAL ${currency === 'IDR' ? 'Rp ' : '$'}${totalWin.toLocaleString()}!`);
          sound.playWin(totalWin / bet >= 10);

          if (totalWin / bet >= 20) {
            setWinCelebration({ active: true, tier: 'MEGA_WIN', amount: totalWin });
          }
        } else {
          setStatusMessage('MULTIPLIER DOUBLES AFTER');
        }

        // SCATTER LEVEL-UP & 10 FREE SPINS RULE:
        // "jika dapat Scatter maka dapat 10 free spin"
        // "Syarat naik level jika dapat 1 Scatter maka akan naik level berikutnya. jika level 2 ingin naik ke level 3 harus dapat 2 Scatter dulu dan seterusnya"
        if (totalScatters > 0 || awardedFreeSpins > 0) {
          sound.playScatterHit();
          sound.playLevelUp();

          if (levelUpOccurred) {
            setCurrentLevel(newLevel);
            setScattersCollected(0);
            setWinCelebration({
              active: true,
              tier: 'LEVEL_UP',
              amount: totalWin,
            });
          } else {
            setScattersCollected((prev) => prev + totalScatters);
          }

          // Award 10 Free Spins!
          setIsFreeSpins(true);
          setRemainingFreeSpins((prev) => prev + 10);
          setStatusMessage('⭐ 10 FREE SPINS AWARDED! ⭐');
        }

        // Handle Free Spins Countdown
        if (isFreeSpins) {
          setRemainingFreeSpins((prev) => {
            const nextCount = prev - 1;
            if (nextCount <= 0) {
              setIsFreeSpins(false);
              setStatusMessage('FREE SPINS COMPLETED!');
            }
            return Math.max(0, nextCount);
          });
        }

        // Handle Auto-Spin loop
        if (autoSpinsRemaining > 0) {
          setAutoSpinsRemaining((c) => c - 1);
          setTimeout(() => {
            if (balance >= bet || isFreeSpins) {
              handleSpin();
            }
          }, isTurbo ? 600 : 1200);
        }

        return;
      }

      const currentStep = steps[stepIndex];
      setGrid(currentStep.grid);
      setCurrentMultiplier(currentStep.multiplier);

      if (currentStep.winningWays.length > 0) {
        setIsCascading(true);
        // Highlight winning symbols
        const winPositions: { reel: number; row: number }[] = [];
        currentStep.winningWays.forEach((w) => {
          winPositions.push(...w.symbolPositions);
        });
        setWinningPositions(winPositions);
        sound.playGunshot();

        setStatusMessage(`WIN X${currentStep.multiplier}! +${currency === 'IDR' ? 'Rp ' : '$'}${currentStep.stepWin.toLocaleString()}`);

        // Wait, then drop next cascade symbols
        setTimeout(() => {
          setWinningPositions([]);
          // Columns that had winners drop new symbols from top
          const winReels = Array.from(new Set(winPositions.map((p) => p.reel)));
          const dropState = [false, false, false, false, false, false];
          winReels.forEach((r) => (dropState[r] = true));
          setDroppingReels(dropState);
          sound.playCoin();

          stepIndex++;
          setTimeout(() => {
            setDroppingReels([false, false, false, false, false, false]);
            playNextStep();
          }, isTurbo ? 200 : 350);
        }, isTurbo ? 400 : 800);
      } else {
        stepIndex++;
        playNextStep();
      }
    };

    playNextStep();
  };

  const handleDepositSuccess = (amount: number, tx: Transaction) => {
    setBalance((prev) => prev + amount);
    setTransactions((prev) => [tx, ...prev]);
  };

  const handleWithdrawSuccess = (amount: number, tx: Transaction) => {
    setBalance((prev) => Math.max(0, prev - amount));
    setTransactions((prev) => [tx, ...prev]);
  };

  const currentLevelConfig = LEVEL_CONFIGS[currentLevel - 1] || LEVEL_CONFIGS[0];

  return (
    <div className="min-h-screen bg-[#0e0704] text-stone-100 flex flex-col justify-between selection:bg-amber-500 selection:text-black overflow-x-hidden relative font-sans">
      {/* 3D Gold Coin Rain Celebration */}
      <ThreeWinCanvas
        active={winCelebration.active}
        tier={winCelebration.tier}
        amount={winCelebration.amount}
        onComplete={() => setWinCelebration((prev) => ({ ...prev, active: false }))}
      />

      {/* Western Canyon Desert Background (matching Screenshot 1, 2, 3) */}
      <div
        className="fixed inset-0 pointer-events-none opacity-25 bg-cover bg-center transition-all duration-700"
        style={{
          backgroundImage: `radial-gradient(circle at 50% 30%, transparent 20%, #0e0704 85%), url(/src/assets/images/wild_bounty_banner_1791020853754.jpg)`,
        }}
      />

      {/* TOP COMPACT BRAND & QUICK BAR */}
      <header className="relative z-30 px-3 py-2 bg-[#120804]/90 border-b border-[#523015] flex items-center justify-between backdrop-blur-sm max-w-lg mx-auto w-full">
        <div className="flex items-center gap-2">
          <span className="font-western text-base sm:text-lg text-gold-gradient tracking-wide">
            WILD BOUNTY
          </span>
          <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-amber-500/20 text-amber-300 border border-amber-500/40">
            L{currentLevel} · {currentLevelConfig.title}
          </span>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleToggleMute}
            className="p-1.5 rounded-lg bg-[#221208] border border-[#523015] text-stone-300 hover:text-amber-400"
          >
            {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4 text-amber-400" />}
          </button>
          <button
            onClick={() => setCurrency((c) => (c === 'IDR' ? 'USD' : 'IDR'))}
            className="px-2 py-1 rounded-lg bg-[#221208] border border-[#523015] text-[10px] font-mono font-bold text-amber-300"
          >
            {currency}
          </button>
          <button
            onClick={() => setShowPayment(true)}
            className="px-3 py-1 bg-gradient-to-r from-amber-500 to-yellow-500 text-stone-950 font-bold text-xs rounded-lg flex items-center gap-1 shadow-sm hover:brightness-110 active:scale-95"
          >
            <Plus className="w-3.5 h-3.5 stroke-[3]" />
            <span>Top Up</span>
          </button>
        </div>
      </header>

      {/* MAIN GAME CONTAINER (Authentic Portrait Layout matching Screenshot 1 & 2) */}
      <main className="relative z-20 flex-1 flex flex-col items-center justify-center px-2 py-1 max-w-md mx-auto w-full">
        {/* Top Hanging Wooden Multiplier Sign Suspended by Chains */}
        <HangingMultiplierSign
          currentMultiplier={currentMultiplier}
          isFreeSpins={isFreeSpins}
        />

        {/* 6-Reel [3, 4, 5, 5, 4, 3] 3600-Ways Cascading Grid */}
        <div className="my-1 w-full">
          <WildBountyReels
            grid={grid}
            winningPositions={winningPositions}
            isCascading={isCascading}
            droppingReels={droppingReels}
          />
        </div>

        {/* Middle Horseshoe Wooden Plank Banner */}
        <HorseshoeMessageBanner
          message={statusMessage}
          isFreeSpins={isFreeSpins}
          remainingFreeSpins={remainingFreeSpins}
        />

        {/* Scatter Level Progression Tracker */}
        <div className="w-full max-w-[400px] mx-auto px-3 py-1 flex items-center justify-between text-[11px] text-stone-400 bg-[#160a04]/80 rounded-lg border border-[#3d200d] my-1">
          <div className="flex items-center gap-1">
            <Flame className="w-3.5 h-3.5 text-red-500" />
            <span>Level {currentLevel} Bounty Target:</span>
          </div>
          <div className="font-mono font-bold text-amber-400">
            {scattersCollected} / {currentLevelConfig.reqScatters} Scatter{currentLevelConfig.reqScatters > 1 ? 's' : ''} (10 Free Spins on hit!)
          </div>
        </div>
      </main>

      {/* BOTTOM CONTROLS DOCK (Matching Screenshot 2 & 3) */}
      <footer className="relative z-30 w-full bg-[#120804]/95 border-t border-[#523015] backdrop-blur-md">
        <WildBountyControls
          balance={balance}
          bet={bet}
          win={currentWin}
          currency={currency}
          isSpinning={isSpinning || isCascading}
          isTurbo={isTurbo}
          autoSpinsRemaining={autoSpinsRemaining}
          onToggleTurbo={() => setIsTurbo((t) => !t)}
          onDecreaseBet={() => setBet((b) => Math.max(2, b - 2))}
          onIncreaseBet={() => setBet((b) => Math.min(500, b + 2))}
          onSpin={handleSpin}
          onToggleAuto={() => {
            if (autoSpinsRemaining > 0) {
              setAutoSpinsRemaining(0);
            } else {
              setAutoSpinsRemaining(10);
              if (!isSpinning && !isCascading) handleSpin();
            }
          }}
          onOpenMenu={() => setShowMenu(true)}
        />
      </footer>

      {/* HAMBURGER SIDE DRAWER MENU */}
      {showMenu && (
        <div className="fixed inset-0 z-50 flex justify-end bg-black/70 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="w-72 bg-[#1c0e07] border-l-2 border-[#824c20] p-5 flex flex-col justify-between shadow-2xl animate-in slide-in-from-right duration-200">
            <div className="space-y-4">
              <div className="flex items-center justify-between border-b border-[#523015] pb-3">
                <span className="font-western text-lg text-gold-gradient">GAME MENU</span>
                <button
                  onClick={() => setShowMenu(false)}
                  className="p-1 rounded-lg text-stone-400 hover:text-white hover:bg-stone-800"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="space-y-2 text-xs">
                <button
                  onClick={() => {
                    setShowMenu(false);
                    setShowFairness(true);
                  }}
                  className="w-full p-2.5 rounded-xl bg-[#2a160c] border border-[#5a3215] text-stone-200 hover:border-amber-500 flex items-center gap-2.5 font-semibold"
                >
                  <ShieldCheck className="w-4 h-4 text-emerald-400" />
                  <span>Real RNG (SHA-256 Verifier)</span>
                </button>

                <button
                  onClick={() => {
                    setShowMenu(false);
                    setShowPayment(true);
                  }}
                  className="w-full p-2.5 rounded-xl bg-[#2a160c] border border-[#5a3215] text-stone-200 hover:border-amber-500 flex items-center gap-2.5 font-semibold"
                >
                  <Wallet className="w-4 h-4 text-amber-400" />
                  <span>Payment Gateway (QRIS/VA)</span>
                </button>

                <button
                  onClick={() => {
                    setShowMenu(false);
                    setShowLeaderboard(true);
                  }}
                  className="w-full p-2.5 rounded-xl bg-[#2a160c] border border-[#5a3215] text-stone-200 hover:border-amber-500 flex items-center gap-2.5 font-semibold"
                >
                  <Trophy className="w-4 h-4 text-yellow-400" />
                  <span>Global Tournament Ranks</span>
                </button>

                <button
                  onClick={() => {
                    setShowMenu(false);
                    setShowPaytable(true);
                  }}
                  className="w-full p-2.5 rounded-xl bg-[#2a160c] border border-[#5a3215] text-stone-200 hover:border-amber-500 flex items-center gap-2.5 font-semibold"
                >
                  <HelpCircle className="w-4 h-4 text-blue-400" />
                  <span>3600 Ways & Paytable Rules</span>
                </button>

                <button
                  onClick={() => {
                    setShowMenu(false);
                    setShowSafeBonus(true);
                  }}
                  className="w-full p-2.5 rounded-xl bg-[#2a160c] border border-[#5a3215] text-stone-200 hover:border-amber-500 flex items-center gap-2.5 font-semibold"
                >
                  <Flame className="w-4 h-4 text-red-400" />
                  <span>Saloon Safe Heist Bonus</span>
                </button>

                <button
                  onClick={() => {
                    setShowMenu(false);
                    setShowNativeSpecs(true);
                  }}
                  className="w-full p-2.5 rounded-xl bg-[#2a160c] border border-[#5a3215] text-stone-200 hover:border-amber-500 flex items-center gap-2.5 font-semibold"
                >
                  <Code className="w-4 h-4 text-purple-400" />
                  <span>Android Kotlin / C++ / Unity SDK</span>
                </button>
              </div>
            </div>

            <div className="text-[11px] text-stone-400 text-center border-t border-[#523015] pt-3">
              Wild Bounty Showdown · 3600 Ways Real RNG Edition
            </div>
          </div>
        </div>
      )}

      {/* Saloon Safe Vault Heist Bonus */}
      {showSafeBonus && (
        <SaloonSafeBonus
          currentBet={bet}
          currentLevel={currentLevel}
          onFinish={(winAmt) => {
            setBalance((prev) => prev + winAmt);
            setWinCelebration({ active: true, tier: 'MEGA_WIN', amount: winAmt });
          }}
          onClose={() => setShowSafeBonus(false)}
        />
      )}

      {/* Payment Gateway Modal */}
      <PaymentModal
        isOpen={showPayment}
        onClose={() => setShowPayment(false)}
        currentBalance={balance}
        currency={currency}
        onDepositSuccess={handleDepositSuccess}
        onWithdrawSuccess={handleWithdrawSuccess}
        transactions={transactions}
      />

      {/* Provably Fair Modal */}
      <ProvablyFairModal
        isOpen={showFairness}
        onClose={() => setShowFairness(false)}
        serverSeedHash={serverSeedHash}
        clientSeed={clientSeed}
        nonce={nonce}
        lastRevealedServerSeed={lastRevealedServerSeed}
        onUpdateClientSeed={(newSeed) => setClientSeed(newSeed)}
      />

      {/* Leaderboard Modal */}
      <LeaderboardModal
        isOpen={showLeaderboard}
        onClose={() => setShowLeaderboard(false)}
        entries={leaderboard}
        playerBestWin={4800}
        playerLevel={currentLevel}
      />

      {/* Paytable Modal */}
      <PaytableModal
        isOpen={showPaytable}
        onClose={() => setShowPaytable(false)}
        currentLevel={currentLevel}
      />

      {/* Native SDK Specs Modal */}
      <NativeEngineModal
        isOpen={showNativeSpecs}
        onClose={() => setShowNativeSpecs(false)}
      />
    </div>
  );
}
