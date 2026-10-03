import React, { useState, useEffect } from 'react';
import {
  ShieldCheck,
  Trophy,
  HelpCircle,
  Code,
  Volume2,
  VolumeX,
  Wallet,
  Flame,
  X,
  MoreVertical,
  ArrowDownLeft,
  ArrowUpRight,
  History,
  SlidersHorizontal,
} from 'lucide-react';
import {
  GridTile,
  Transaction,
  LeaderboardEntry,
} from './types/slot';
import {
  NUM_COLUMNS,
  REEL_ROW_COUNTS,
  LEVEL_CONFIGS,
  generateInitialTileGrid,
  executeFullCascadeSpin,
  sha256,
  generateRandomHex,
  nextTileId,
  getRandomSymbol,
} from './utils/slotEngine';
import { sound } from './utils/soundEngine';
import { WildBountyReels, WinAnimStage } from './components/WildBountyReels';
import { HangingMultiplierSign } from './components/HangingMultiplierSign';
import { HorseshoeMessageBanner } from './components/HorseshoeMessageBanner';
import { WildBountyControls } from './components/WildBountyControls';
import { ThreeWinCanvas, WinTier } from './components/ThreeWinCanvas';
import { ScatterCongratsModal } from './components/ScatterCongratsModal';
import { SaloonSafeBonus } from './components/SaloonSafeBonus';
import { PaymentModal } from './components/PaymentModal';
import { ProvablyFairModal } from './components/ProvablyFairModal';
import { LeaderboardModal } from './components/LeaderboardModal';
import { PaytableModal } from './components/PaytableModal';
import { NativeEngineModal } from './components/NativeEngineModal';
import { AutoSpinModal } from './components/AutoSpinModal';
import originalDesertBg from './assets/images/wild_bounty_banner_1791020853754.jpg';

// Bet Steps Ladder: 400 -> 600 (+200) -> x2 subsequent steps (1200, 2400, 4800, ...)
const BET_STEPS = [
  400,
  600,
  1200,
  2400,
  4800,
  9600,
  19200,
  38400,
  76800,
  153600,
  307200,
  614400,
  1228800,
];

export default function App() {
  // Player Balance & Wallet
  const [balance, setBalance] = useState<number>(100000);
  const [currency, setCurrency] = useState<'USD' | 'IDR'>('IDR');
  const [bet, setBet] = useState<number>(400);
  const [currentWin, setCurrentWin] = useState<number>(0);

  // Progressive Scatter Level
  const [currentLevel, setCurrentLevel] = useState<number>(1);
  const [scattersCollected, setScattersCollected] = useState<number>(0);

  // Free Spins State
  const [isFreeSpins, setIsFreeSpins] = useState<boolean>(false);
  const [remainingFreeSpins, setRemainingFreeSpins] = useState<number>(0);
  const [totalFreeSpinsSession, setTotalFreeSpinsSession] = useState<number>(10);
  const [freeSpinsTotalWon, setFreeSpinsTotalWon] = useState<number>(0);
  const [freeSpinsSummaryBanner, setFreeSpinsSummaryBanner] = useState<{
    active: boolean;
    totalWon: number;
  } | null>(null);

  // Scatter Congratulations Popup State
  const [showScatterCongrats, setShowScatterCongrats] = useState<boolean>(false);
  const [scatterCongratsAwarded, setScatterCongratsAwarded] = useState<number>(10);

  // Active Multiplier
  const [currentMultiplier, setCurrentMultiplier] = useState<number>(1);
  const [statusMessage, setStatusMessage] = useState<string>('PAY ANYWHERE!');

  // Uniform 6x5 Grid of GridTiles
  const [grid, setGrid] = useState<GridTile[][]>(() => generateInitialTileGrid(1));
  const [winningTileIds, setWinningTileIds] = useState<string[]>([]);
  const [winAnimStage, setWinAnimStage] = useState<WinAnimStage>('IDLE');
  const [isSpinExiting, setIsSpinExiting] = useState<boolean>(false);
  const [isSpinning, setIsSpinning] = useState<boolean>(false);
  const [isCascading, setIsCascading] = useState<boolean>(false);

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
  const [paymentTab, setPaymentTab] = useState<'DEPOSIT' | 'WITHDRAW' | 'HISTORY'>('DEPOSIT');
  const [showFairness, setShowFairness] = useState<boolean>(false);
  const [showLeaderboard, setShowLeaderboard] = useState<boolean>(false);
  const [showPaytable, setShowPaytable] = useState<boolean>(false);
  const [showNativeSpecs, setShowNativeSpecs] = useState<boolean>(false);
  const [showSafeBonus, setShowSafeBonus] = useState<boolean>(false);
  const [showAutoSpinModal, setShowAutoSpinModal] = useState<boolean>(false);

  // Bet Stepping Handlers (Min 400 -> 600 (+200) -> x2 steps up to 1.2M)
  const handleIncreaseBet = () => {
    setBet((prev) => {
      const idx = BET_STEPS.indexOf(prev);
      if (idx !== -1 && idx < BET_STEPS.length - 1) {
        return BET_STEPS[idx + 1];
      }
      if (prev < 400) return 400;
      if (prev === 400) return 600;
      return Math.min(1228800, prev * 2);
    });
  };

  const handleDecreaseBet = () => {
    setBet((prev) => {
      const idx = BET_STEPS.indexOf(prev);
      if (idx > 0) {
        return BET_STEPS[idx - 1];
      }
      if (prev === 600) return 400;
      if (prev > 600) return Math.max(400, Math.floor(prev / 2));
      return 400;
    });
  };

  const handleSelectAutoSpins = (count: number) => {
    setAutoSpinsRemaining(count);
    if (!isSpinning && !isCascading) {
      handleSpin();
    }
  };

  // Win Celebration Canvas (Compact top banner, max 2.5s, non-blocking)
  const [winCelebration, setWinCelebration] = useState<{
    active: boolean;
    tier: WinTier;
    amount: number;
  }>({ active: false, tier: 'BIG_WIN', amount: 0 });

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

  // Pre-calculate SHA-256 Server Seed Hash for Provably Fair
  useEffect(() => {
    sha256(serverSeed).then((hash) => setServerSeedHash(hash));
  }, [serverSeed]);

  // Toggle Mute
  const handleToggleMute = () => {
    const next = !isMuted;
    setIsMuted(next);
    sound.setMuted(next);
  };

  // CORE SPIN FUNCTION
  const handleSpin = async () => {
    if (isSpinning || isCascading || showScatterCongrats) return;
    if (!isFreeSpins && balance < bet) {
      setShowPayment(true);
      return;
    }

    // Decrement free spins if in Free Spins mode
    if (isFreeSpins) {
      const nextRemaining = Math.max(0, remainingFreeSpins - 1);
      setRemainingFreeSpins(nextRemaining);
      const currentSpinNum = Math.max(1, totalFreeSpinsSession - nextRemaining);
      setStatusMessage(`FREE SPIN ${currentSpinNum} / ${totalFreeSpinsSession}`);
    } else {
      setBalance((prev) => prev - bet);
      setStatusMessage('PAY ANYWHERE!');
    }

    setCurrentWin(0);
    setWinningTileIds([]);
    setWinAnimStage('IDLE');
    setIsSpinning(true);
    setCurrentMultiplier(isFreeSpins ? 8 : 1);

    // STEP 1: Old symbols fall out downward sequentially in normal mode (turbo: simultaneous)
    setIsSpinExiting(true);
    sound.playSpinTick();

    const exitDuration = isTurbo ? 160 : 650;
    setTimeout(() => {
      // STEP 2: New symbols spawn above frame and fall down sequentially from left to right (turbo: simultaneous)
      setIsSpinExiting(false);
      const newGrid = generateInitialTileGrid(currentLevel);
      const enteringGrid: GridTile[][] = newGrid.map((colTiles) =>
        colTiles.map((t) => ({ ...t, isNew: true }))
      );
      setGrid(enteringGrid);

      // Landing sound per column in normal mode
      if (!isTurbo) {
        [0, 1, 2, 3, 4, 5].forEach((c) => {
          setTimeout(() => {
            sound.playReelStop(c >= 4);
          }, c * 100 + 200);
        });
      } else {
        sound.playReelStop(false);
      }

      const entryDuration = isTurbo ? 220 : 850;
      setTimeout(() => {
        // Clear isNew flag and start cascade evaluation
        const settledGrid: GridTile[][] = enteringGrid.map((colTiles) =>
          colTiles.map((t) => ({ ...t, isNew: false }))
        );
        setGrid(settledGrid);

        const result = executeFullCascadeSpin(
          settledGrid,
          bet,
          currentLevel,
          scattersCollected,
          isFreeSpins
        );

        animateCascadeSteps(settledGrid, result);
      }, entryDuration);
    }, exitDuration);
  };

  // Sequential Cascade Tumble Animation:
  // (a) membesar ke 1.2 dalam 0.25s (turbo 0.12s) dengan ring emas
  // (b) tahan sekitar 0.15s (turbo 0.08s)
  // (c) pecah bersamaan ke 0 dengan partikel emas dalam 0.25s (turbo 0.12s)
  // (d) jatuh serentak mengisi kekosongan (0.35s, turbo 0.2s)
  const animateCascadeSteps = (
    currentGridState: GridTile[][],
    result: ReturnType<typeof executeFullCascadeSpin>
  ) => {
    const { steps, totalWin, totalScatters, awardedFreeSpins, levelUpOccurred, newLevel } = result;
    let stepIndex = 0;
    let runningGrid = currentGridState;

    const playNextStep = () => {
      if (stepIndex >= steps.length) {
        // All cascades of this spin complete
        setIsSpinning(false);
        setIsCascading(false);
        setWinningTileIds([]);
        setWinAnimStage('IDLE');

        // Advance Provably Fair nonce & server seed
        setLastRevealedServerSeed(serverSeed);
        setServerSeed(generateRandomHex(32));
        setNonce((n) => n + 1);

        // Win calculation per spin
        if (totalWin > 0) {
          setBalance((prev) => prev + totalWin);
          setCurrentWin(totalWin);
          if (isFreeSpins) {
            setFreeSpinsTotalWon((prev) => prev + totalWin);
          }
          setStatusMessage(`KEMENANGAN TOTAL ${currency === 'IDR' ? 'Rp ' : '$'}${totalWin.toLocaleString()}!`);

          // 2. TINGKAT KEMENANGAN (kelipatan total bet, dihitung dari total kemenangan satu spin):
          // - < 10x: tanpa overlay, hanya angka win di status bar
          // - 10x - 24x: BIG WIN (banner kecil)
          // - 25x - 49x: SUPER BIG WIN
          // - 50x - 99x: MEGA WIN
          // - 100x+: EPIC WIN
          const winRatio = totalWin / bet;
          if (winRatio >= 100) {
            setWinCelebration({ active: true, tier: 'EPIC_WIN', amount: totalWin });
            sound.playWin(true);
          } else if (winRatio >= 50) {
            setWinCelebration({ active: true, tier: 'MEGA_WIN', amount: totalWin });
            sound.playWin(true);
          } else if (winRatio >= 25) {
            setWinCelebration({ active: true, tier: 'SUPER_BIG_WIN', amount: totalWin });
            sound.playWin(true);
          } else if (winRatio >= 10) {
            setWinCelebration({ active: true, tier: 'BIG_WIN', amount: totalWin });
            sound.playWin(true);
          } else {
            // < 10x: tanpa overlay
            sound.playWin(false);
          }
        } else {
          setStatusMessage(isFreeSpins ? 'MULTIPLIER BERKELIPATAN' : 'MULTIPLIER DOUBLES AFTER');
        }

        // 3. SCATTER (EMAS BATANGAN) & POPUP SELAMAT (Perbaikan 3)
        // Minimal 3 Scatter = 10 Free Spins (+2 per additional scatter) / Retrigger = 5 Free Spins
        if (awardedFreeSpins > 0) {
          const triggerScatterSequence = () => {
            // (a) Semua scatter di papan membesar/berkedip sebentar (0.6 detik)
            const scatterIds: string[] = [];
            runningGrid.forEach((col) => {
              col.forEach((t) => {
                if (t.symbol === 'SCATTER') scatterIds.push(t.id);
              });
            });
            setWinningTileIds(scatterIds);
            setWinAnimStage('EXPANDING');

            sound.playScatterHit();
            sound.playLevelUp();

            if (levelUpOccurred) {
              setCurrentLevel(newLevel);
              setScattersCollected(0);
            } else {
              setScattersCollected((prev) => prev + totalScatters);
            }

            // (b) Popup SELAMAT muncul (zoom in) setelah 0.6 detik
            setTimeout(() => {
              setScatterCongratsAwarded(awardedFreeSpins);
              setShowScatterCongrats(true);
            }, 600);
          };

          // Jika ada efek win (10x+), efek win muncul dulu baru popup scatter
          const winRatio = totalWin / bet;
          if (winRatio >= 10) {
            setTimeout(() => {
              triggerScatterSequence();
            }, 2000);
          } else {
            triggerScatterSequence();
          }

          return; // Modal close callback triggers the free spin sequence
        } else if (totalScatters > 0) {
          // Progress level counter
          if (levelUpOccurred) {
            setCurrentLevel(newLevel);
            setScattersCollected(0);
            sound.playLevelUp();
          } else {
            setScattersCollected((prev) => prev + totalScatters);
          }
        }

        // Check if Free Spins ended
        if (isFreeSpins && remainingFreeSpins <= 1) {
          setIsFreeSpins(false);
          setRemainingFreeSpins(0);
          const finalWon = freeSpinsTotalWon + totalWin;
          setFreeSpinsSummaryBanner({ active: true, totalWon: finalWon });
          setStatusMessage(`FREE SPINS SELESAI! TOTAL MENANG: ${currency === 'IDR' ? 'Rp ' : '$'}${finalWon.toLocaleString()}`);
          setTimeout(() => {
            setFreeSpinsSummaryBanner(null);
          }, 3500);
          return;
        }

        // Normal Auto-Spin loop
        if (!isFreeSpins && autoSpinsRemaining > 0) {
          setAutoSpinsRemaining((c) => c - 1);
          setTimeout(() => {
            if (balance >= bet) {
              handleSpin();
            }
          }, isTurbo ? 400 : 800);
        }

        return;
      }

      const currentStep = steps[stepIndex];
      setCurrentMultiplier(currentStep.multiplier);

      if (currentStep.winningWays.length > 0) {
        setIsCascading(true);
        setWinningTileIds(currentStep.winningTileIds);
        sound.playGunshot();
        setStatusMessage(`WIN X${currentStep.multiplier}! +${currency === 'IDR' ? 'Rp ' : '$'}${currentStep.stepWin.toLocaleString()}`);

        // (a) EXPANDING: membesar ke skala 1.2 bersamaan dalam 0.25s (turbo 0.12s)
        setWinAnimStage('EXPANDING');
        const expandTime = isTurbo ? 120 : 250;

        setTimeout(() => {
          // (b) HOLD: tahan sekitar 0.15s (turbo 0.08s)
          setWinAnimStage('HOLD');
          const holdTime = isTurbo ? 80 : 150;

          setTimeout(() => {
            // (c) SHATTERING: menyusut cepat ke 0 sambil memancarkan partikel emas dalam 0.25s (turbo 0.12s)
            setWinAnimStage('SHATTERING');
            const shatterTime = isTurbo ? 120 : 250;

            setTimeout(() => {
              // (d) JATUH BERURUTAN / SERENTAK: simbol lain jatuh mengisi kekosongan
              setWinningTileIds([]);
              setWinAnimStage('IDLE');

              const nextGrid: GridTile[][] = [];
              for (let col = 0; col < NUM_COLUMNS; col++) {
                const colRowCount = REEL_ROW_COUNTS[col];
                const surviving = runningGrid[col].filter(
                  (t) => !currentStep.winningTileIds.includes(t.id)
                );
                const neededCount = colRowCount - surviving.length;

                const shiftedSurviving: GridTile[] = surviving.map((t, idx) => ({
                  ...t,
                  row: neededCount + idx,
                  isWinning: false,
                  isNew: false,
                }));

                const newColTiles: GridTile[] = [];
                for (let r = 0; r < neededCount; r++) {
                  newColTiles.push({
                    id: nextTileId(),
                    symbol: getRandomSymbol(Math.random(), currentLevel),
                    col,
                    row: r,
                    isWinning: false,
                    isNew: true, // starts above frame and falls down
                  });
                }

                nextGrid.push([...newColTiles, ...shiftedSurviving]);
              }

              runningGrid = nextGrid;
              setGrid(nextGrid);
              sound.playCoin();

              // Landing audio per column in normal mode
              if (!isTurbo) {
                [0, 1, 2, 3, 4, 5].forEach((c) => {
                  setTimeout(() => {
                    sound.playReelStop(false);
                  }, c * 100 + 180);
                });
              }

              const tumbleDropWait = isTurbo ? 200 : 750;
              setTimeout(() => {
                const settled = runningGrid.map((colTiles) =>
                  colTiles.map((t) => ({ ...t, isNew: false }))
                );
                runningGrid = settled;
                setGrid(settled);

                stepIndex++;
                playNextStep();
              }, tumbleDropWait);
            }, shatterTime);
          }, holdTime);
        }, expandTime);
      } else {
        stepIndex++;
        playNextStep();
      }
    };

    playNextStep();
  };

  // 5. FREE SPIN AUTO RUN LOOP
  useEffect(() => {
    if (
      isFreeSpins &&
      remainingFreeSpins > 0 &&
      !isSpinning &&
      !isCascading &&
      !showScatterCongrats &&
      !winCelebration.active &&
      !freeSpinsSummaryBanner
    ) {
      const delay = isTurbo ? 400 : 800;
      const timer = setTimeout(() => {
        handleSpin();
      }, delay);
      return () => clearTimeout(timer);
    }
  }, [
    isFreeSpins,
    remainingFreeSpins,
    isSpinning,
    isCascading,
    showScatterCongrats,
    winCelebration.active,
    freeSpinsSummaryBanner,
    isTurbo,
  ]);

  // Handler when Scatter Congrats Popup closes:
  const handleScatterCongratsClose = () => {
    setShowScatterCongrats(false);
    setWinningTileIds([]);
    setWinAnimStage('IDLE');

    if (!isFreeSpins) {
      setIsFreeSpins(true);
      setRemainingFreeSpins(scatterCongratsAwarded);
      setTotalFreeSpinsSession(scatterCongratsAwarded);
      setFreeSpinsTotalWon(0);
      setStatusMessage(`FREE SPIN 1 / ${scatterCongratsAwarded}`);
    } else {
      setRemainingFreeSpins((prev) => prev + scatterCongratsAwarded);
      setTotalFreeSpinsSession((prev) => prev + scatterCongratsAwarded);
      setStatusMessage(`RETRIGGER! +${scatterCongratsAwarded} FREE SPINS!`);
    }
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
    <div className="h-[100dvh] max-h-[100dvh] bg-[#0e0704] text-stone-100 flex flex-col justify-between selection:bg-amber-500 selection:text-black overflow-hidden relative font-sans">
      {/* COMPACT WIN CELEBRATION BANNER (Does not cover the grid, max 2.5s, tap to skip) */}
      <ThreeWinCanvas
        active={winCelebration.active}
        tier={winCelebration.tier}
        amount={winCelebration.amount}
        currency={currency}
        onComplete={() => setWinCelebration((prev) => ({ ...prev, active: false }))}
      />

      {/* POPUP SELAMAT SAAT SCATTER (Emas Batangan, 2.5s auto dismiss, tap to skip) */}
      {showScatterCongrats && (
        <ScatterCongratsModal
          freeSpinsAwarded={scatterCongratsAwarded}
          onClose={handleScatterCongratsClose}
        />
      )}

      {/* COMPACT FREE SPINS SUMMARY BANNER AT COMPLETION */}
      {freeSpinsSummaryBanner && (
        <div
          onClick={() => setFreeSpinsSummaryBanner(null)}
          className="fixed top-12 sm:top-14 left-1/2 -translate-x-1/2 z-50 w-[92%] max-w-[380px] pointer-events-auto cursor-pointer animate-in slide-in-from-top-4 select-none"
        >
          <div className="relative rounded-2xl bg-gradient-to-b from-[#3a1d0d] via-[#241107] to-[#120703] border-2 border-amber-400 p-3 text-center shadow-2xl">
            <div className="text-[10px] uppercase font-bold tracking-widest text-amber-300">
              🏆 TOTAL KEMENANGAN FREE SPIN 🏆
            </div>
            <div className="text-xl sm:text-2xl font-western font-black text-gold-gradient my-0.5">
              +{currency === 'IDR' ? 'Rp ' : '$'}{freeSpinsSummaryBanner.totalWon.toLocaleString()}
            </div>
            <div className="text-[9px] text-stone-400">Kembali ke mode permainan normal</div>
          </div>
        </div>
      )}

      {/* Original Western Canyon Background from repository */}
      <div
        className="fixed inset-0 pointer-events-none opacity-90 bg-cover bg-center transition-all duration-700"
        style={{
          backgroundImage: `url(${originalDesertBg})`,
        }}
      />

      {/* 4. NEW COMPACT HEADER (Western Title & Three-Dots Menu Button) */}
      <header className="relative z-30 px-3 py-1.5 bg-[#120804]/90 border-b border-[#523015] flex items-center justify-between backdrop-blur-sm max-w-md mx-auto w-full shrink-0">
        <div className="flex items-center">
          <h1 className="font-western text-lg sm:text-xl font-black text-gold-gradient tracking-wide drop-shadow-[0_2px_4px_rgba(0,0,0,0.9)]">
            WILD BOUNTY ADVENTURE
          </h1>
        </div>

        <button
          onClick={() => setShowMenu(true)}
          className="p-1.5 rounded-lg bg-[#221208] border border-[#6b401c] text-amber-300 hover:text-white hover:border-amber-400 transition-colors shadow-sm cursor-pointer"
          title="Menu & Pengaturan"
        >
          <MoreVertical className="w-5 h-5" />
        </button>
      </header>

      {/* 3. MAIN GAME CONTAINER (Compact unified stack, controls right under the box grid) */}
      <main className="relative z-20 flex-1 min-h-0 flex flex-col items-center justify-start sm:justify-center px-1 py-1 max-w-[480px] mx-auto w-full overflow-y-auto overflow-x-hidden gap-1.5">
        {/* Top Hanging Wooden Multiplier Sign */}
        <div className="w-full shrink-0">
          <HangingMultiplierSign
            currentMultiplier={currentMultiplier}
            isFreeSpins={isFreeSpins}
          />
        </div>

        {/* Enlarged Shield Box Grid (Transparent interior) */}
        <div className="w-full shrink-0 flex items-center justify-center my-0.5">
          <WildBountyReels
            grid={grid}
            winningTileIds={winningTileIds}
            winAnimStage={winAnimStage}
            isSpinExiting={isSpinExiting}
            isTurbo={isTurbo}
          />
        </div>

        {/* Plakat Kemenangan Total / Status Message */}
        <div className="w-full shrink-0">
          <HorseshoeMessageBanner
            message={statusMessage}
            isFreeSpins={isFreeSpins}
            remainingFreeSpins={remainingFreeSpins}
            currentWin={currentWin}
            currency={currency}
          />
        </div>

        {/* Scatter Level Progression Bar */}
        <div className="w-full max-w-[400px] mx-auto px-3 py-1 flex items-center justify-between text-[10px] sm:text-[11px] text-stone-300 bg-[#160a04]/90 rounded-lg border border-[#3d200d] shrink-0">
          <div className="flex items-center gap-1.5">
            <Flame className="w-3.5 h-3.5 text-red-500 shrink-0" />
            <span className="font-semibold text-stone-200">Level {currentLevel}:</span>
            <span className="text-amber-200 truncate">{currentLevelConfig.title}</span>
          </div>
          <div className="font-mono font-bold text-amber-400">
            {scattersCollected} / {currentLevelConfig.reqScatters} Scatters (3+ = 10 FS)
          </div>
        </div>

        {/* CONTROLS DOCK (Placed directly underneath the grid without vertical gap) */}
        <div className="w-full shrink-0 pt-0.5">
          <WildBountyControls
            balance={balance}
            bet={bet}
            win={currentWin}
            currency={currency}
            isSpinning={isSpinning || isCascading}
            isTurbo={isTurbo}
            autoSpinsRemaining={autoSpinsRemaining}
            isFreeSpins={isFreeSpins}
            remainingFreeSpins={remainingFreeSpins}
            onToggleTurbo={() => setIsTurbo((t) => !t)}
            onDecreaseBet={handleDecreaseBet}
            onIncreaseBet={handleIncreaseBet}
            onSpin={handleSpin}
            onToggleAuto={() => {
              if (isFreeSpins) return;
              if (autoSpinsRemaining > 0) {
                setAutoSpinsRemaining(0);
              } else {
                setShowAutoSpinModal(true);
              }
            }}
            onOpenMenu={() => setShowMenu(true)}
          />
        </div>
      </main>

      {/* 4. FULL-FEATURED DRAWER MENU (Deposit, Withdraw, History, Level Info, Sound, Currency, etc.) */}
      {showMenu && (
        <div className="fixed inset-0 z-50 flex justify-end bg-black/75 backdrop-blur-sm animate-in fade-in duration-200 select-none">
          <div className="w-80 bg-[#1c0e07] border-l-2 border-[#824c20] p-4 flex flex-col justify-between shadow-2xl animate-in slide-in-from-right duration-200 overflow-y-auto">
            <div className="space-y-3.5">
              {/* Menu Title Bar */}
              <div className="flex items-center justify-between border-b border-[#523015] pb-2.5">
                <span className="font-western text-lg text-gold-gradient">GAME MENU</span>
                <button
                  onClick={() => setShowMenu(false)}
                  className="p-1.5 rounded-lg text-stone-400 hover:text-white hover:bg-stone-800 transition-colors cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Current Level & Scatter Progression Card */}
              <div className="p-3 rounded-xl bg-gradient-to-r from-amber-950/60 to-[#291408] border border-amber-600/50 space-y-2">
                <div className="flex items-center justify-between">
                  <div className="text-xs font-bold text-amber-300 flex items-center gap-1.5">
                    <Flame className="w-4 h-4 text-red-500" />
                    <span>Level {currentLevel}: {currentLevelConfig.title}</span>
                  </div>
                  <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/40 font-bold">
                    {scattersCollected}/{currentLevelConfig.reqScatters}
                  </span>
                </div>
                {/* Progress bar */}
                <div className="w-full h-2 bg-stone-900 rounded-full overflow-hidden border border-amber-900">
                  <div
                    className="h-full bg-gradient-to-r from-amber-500 to-yellow-400 transition-all duration-300"
                    style={{
                      width: `${Math.min(100, (scattersCollected / currentLevelConfig.reqScatters) * 100)}%`,
                    }}
                  />
                </div>
                <div className="text-[9.5px] text-stone-300">
                  Kumpulkan Scatter (Emas Batangan) untuk naik level & unlock multiplier lebih tinggi!
                </div>
              </div>

              {/* Quick Banking Actions: Deposit, Withdraw, History */}
              <div className="grid grid-cols-3 gap-1.5">
                <button
                  onClick={() => {
                    setPaymentTab('DEPOSIT');
                    setShowPayment(true);
                    setShowMenu(false);
                  }}
                  className="p-2 rounded-xl bg-[#2a160c] border border-[#6b3a16] text-amber-300 hover:border-amber-400 flex flex-col items-center justify-center gap-1 cursor-pointer transition-all active:scale-95 shadow-sm"
                >
                  <ArrowDownLeft className="w-4 h-4 text-emerald-400" />
                  <span className="text-[11px] font-bold">Deposit</span>
                </button>

                <button
                  onClick={() => {
                    setPaymentTab('WITHDRAW');
                    setShowPayment(true);
                    setShowMenu(false);
                  }}
                  className="p-2 rounded-xl bg-[#2a160c] border border-[#6b3a16] text-amber-300 hover:border-amber-400 flex flex-col items-center justify-center gap-1 cursor-pointer transition-all active:scale-95 shadow-sm"
                >
                  <ArrowUpRight className="w-4 h-4 text-amber-400" />
                  <span className="text-[11px] font-bold">Withdraw</span>
                </button>

                <button
                  onClick={() => {
                    setPaymentTab('HISTORY');
                    setShowPayment(true);
                    setShowMenu(false);
                  }}
                  className="p-2 rounded-xl bg-[#2a160c] border border-[#6b3a16] text-amber-300 hover:border-amber-400 flex flex-col items-center justify-center gap-1 cursor-pointer transition-all active:scale-95 shadow-sm"
                >
                  <History className="w-4 h-4 text-sky-400" />
                  <span className="text-[11px] font-bold">Riwayat</span>
                </button>
              </div>

              {/* Quick Settings: Sound Toggle & Currency Switch */}
              <div className="grid grid-cols-2 gap-2 p-2 rounded-xl bg-[#221208] border border-[#523015]">
                {/* Sound */}
                <button
                  onClick={handleToggleMute}
                  className="py-1.5 px-2 rounded-lg bg-[#2e170a] border border-[#6b3a16] text-xs font-semibold text-stone-200 hover:border-amber-400 flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  {isMuted ? (
                    <>
                      <VolumeX className="w-3.5 h-3.5 text-stone-400" />
                      <span>Suara: Off</span>
                    </>
                  ) : (
                    <>
                      <Volume2 className="w-3.5 h-3.5 text-amber-400" />
                      <span>Suara: On</span>
                    </>
                  )}
                </button>

                {/* Currency */}
                <button
                  onClick={() => setCurrency((c) => (c === 'IDR' ? 'USD' : 'IDR'))}
                  className="py-1.5 px-2 rounded-lg bg-[#2e170a] border border-[#6b3a16] text-xs font-semibold text-amber-300 hover:border-amber-400 flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <SlidersHorizontal className="w-3.5 h-3.5 text-yellow-400" />
                  <span>Valuta: {currency}</span>
                </button>
              </div>

              {/* Game Feature Modals */}
              <div className="space-y-1.5 text-xs">
                <button
                  onClick={() => {
                    setShowMenu(false);
                    setShowFairness(true);
                  }}
                  className="w-full p-2.5 rounded-xl bg-[#2a160c] border border-[#5a3215] text-stone-200 hover:border-amber-500 flex items-center gap-2.5 font-semibold cursor-pointer"
                >
                  <ShieldCheck className="w-4 h-4 text-emerald-400" />
                  <span>Provably Fair Real RNG (SHA-256)</span>
                </button>

                <button
                  onClick={() => {
                    setShowMenu(false);
                    setShowLeaderboard(true);
                  }}
                  className="w-full p-2.5 rounded-xl bg-[#2a160c] border border-[#5a3215] text-stone-200 hover:border-amber-500 flex items-center gap-2.5 font-semibold cursor-pointer"
                >
                  <Trophy className="w-4 h-4 text-yellow-400" />
                  <span>Global Tournament Ranks</span>
                </button>

                <button
                  onClick={() => {
                    setShowMenu(false);
                    setShowPaytable(true);
                  }}
                  className="w-full p-2.5 rounded-xl bg-[#2a160c] border border-[#5a3215] text-stone-200 hover:border-amber-500 flex items-center gap-2.5 font-semibold cursor-pointer"
                >
                  <HelpCircle className="w-4 h-4 text-blue-400" />
                  <span>Pay Anywhere & Paytable Rules</span>
                </button>

                <button
                  onClick={() => {
                    setShowMenu(false);
                    setShowSafeBonus(true);
                  }}
                  className="w-full p-2.5 rounded-xl bg-[#2a160c] border border-[#5a3215] text-stone-200 hover:border-amber-500 flex items-center gap-2.5 font-semibold cursor-pointer"
                >
                  <Flame className="w-4 h-4 text-red-400" />
                  <span>Saloon Safe Vault Heist Bonus</span>
                </button>

                <button
                  onClick={() => {
                    setShowMenu(false);
                    setShowNativeSpecs(true);
                  }}
                  className="w-full p-2.5 rounded-xl bg-[#2a160c] border border-[#5a3215] text-stone-200 hover:border-amber-500 flex items-center gap-2.5 font-semibold cursor-pointer"
                >
                  <Code className="w-4 h-4 text-purple-400" />
                  <span>Android Kotlin / C++ / Unity SDK</span>
                </button>
              </div>
            </div>

            <div className="text-[10.5px] text-stone-400 text-center border-t border-[#523015] pt-2.5 mt-3">
              Wild Bounty Adventure · 3-4-5-5-4-3 Shield Real RNG
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
        initialTab={paymentTab}
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

      {/* Auto Spin Selection Modal (10, 30, 50, 80, 800) */}
      <AutoSpinModal
        isOpen={showAutoSpinModal}
        onClose={() => setShowAutoSpinModal(false)}
        onSelectAutoSpins={handleSelectAutoSpins}
      />
    </div>
  );
}
