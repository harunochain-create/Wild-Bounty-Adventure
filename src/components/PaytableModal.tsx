import React, { useState } from 'react';
import { HelpCircle, X, Flame } from 'lucide-react';
import { LEVEL_CONFIGS, SYMBOLS } from '../utils/slotEngine';
import { SlotSymbolGraphic } from './SlotSymbolGraphic';

interface PaytableModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentLevel: number;
}

export const PaytableModal: React.FC<PaytableModalProps> = ({
  isOpen,
  onClose,
  currentLevel,
}) => {
  const [tab, setTab] = useState<'PAY_ANYWHERE' | 'SCATTER_LEVELS' | 'PAYTABLE'>('PAY_ANYWHERE');

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-200 select-none">
      <div className="relative w-full max-w-2xl bg-[#1c0e07] border-2 border-[#824c20] rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#523015] bg-[#120804]">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-lg bg-amber-500/10 text-amber-400">
              <HelpCircle className="w-5 h-5 text-amber-400" />
            </div>
            <div>
              <div className="text-sm font-bold text-stone-100 flex items-center gap-2">
                <span>Rules & Pay Anywhere Paytable</span>
                <span className="text-[10px] px-2 py-0.5 rounded bg-amber-950 text-amber-400 border border-amber-800 font-mono font-bold">
                  SHIELD 3-4-5-5-4-3 (24 TILES)
                </span>
              </div>
              <div className="text-xs text-stone-400">
                Pay Anywhere (6+ Match), Sequential Gravity & 10 Free Spins
              </div>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-stone-400 hover:text-white hover:bg-stone-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab switcher */}
        <div className="flex border-b border-[#523015] bg-[#140b05]">
          <button
            onClick={() => setTab('PAY_ANYWHERE')}
            className={`flex-1 py-3 text-xs font-semibold transition-colors cursor-pointer ${
              tab === 'PAY_ANYWHERE'
                ? 'text-amber-400 border-b-2 border-amber-400 bg-amber-500/5'
                : 'text-stone-400 hover:text-stone-200'
            }`}
          >
            💥 Pay Anywhere (6+)
          </button>
          <button
            onClick={() => setTab('SCATTER_LEVELS')}
            className={`flex-1 py-3 text-xs font-semibold transition-colors cursor-pointer ${
              tab === 'SCATTER_LEVELS'
                ? 'text-amber-400 border-b-2 border-amber-400 bg-amber-500/5'
                : 'text-stone-400 hover:text-stone-200'
            }`}
          >
            ⭐ 3+ Scatter & Free Spins
          </button>
          <button
            onClick={() => setTab('PAYTABLE')}
            className={`flex-1 py-3 text-xs font-semibold transition-colors cursor-pointer ${
              tab === 'PAYTABLE'
                ? 'text-amber-400 border-b-2 border-amber-400 bg-amber-500/5'
                : 'text-stone-400 hover:text-stone-200'
            }`}
          >
            💰 Symbol Payouts (6-7, 8-9, 10+)
          </button>
        </div>

        {/* Body */}
        <div className="p-6 overflow-y-auto space-y-4">
          {tab === 'PAY_ANYWHERE' && (
            <div className="space-y-4">
              <div className="p-4 rounded-xl bg-[#2a160c] border border-[#6b3c18] space-y-2">
                <h4 className="font-western text-amber-300 text-sm">Aturan Menang: Pay Anywhere (6+ Match)</h4>
                <p className="text-xs text-stone-300 leading-relaxed">
                  Grid permainan berbentuk <span className="font-bold text-amber-400">Perisai 6 Kolom [3, 4, 5, 5, 4, 3] = 24 ubin</span>.
                  Simbol membayar jika muncul <span className="font-bold text-amber-300">6 atau lebih simbol yang sama di mana saja</span> pada papan!
                </p>
                <ul className="text-xs text-stone-300 space-y-1.5 list-disc pl-4">
                  <li>Tidak perlu bersebelahan atau membentuk pola garis.</li>
                  <li><span className="text-yellow-400 font-semibold">WILD (Cowgirl):</span> Menggantikan simbol biasa (bukan Scatter) dan otomatis dihitung ke simbol biasa dengan jumlah terbanyak. WILD dapat muncul di semua kolom!</li>
                  <li><span className="text-yellow-400 font-semibold">Animasi Jatuh:</span> Mode Normal simbol jatuh berurutan dari kiri ke kanan (jeda 0.1s antar kolom). Mode Turbo simbol jatuh serentak (0.2s).</li>
                  <li><span className="text-yellow-400 font-semibold">Tumble & Multiplier:</span> Simbol menang membesar lalu pecah bersamaan. Simbol di atasnya jatuh mengisi kekosongan, dan simbol baru turun dari atas. Setiap tumble berturut-turut melipatgandakan multiplier gantung!</li>
                </ul>
              </div>
            </div>
          )}

          {tab === 'SCATTER_LEVELS' && (
            <div className="space-y-4">
              <div className="p-3.5 rounded-xl bg-gradient-to-r from-amber-950/60 to-[#221208] border border-amber-600/40">
                <div className="text-xs font-bold text-amber-300 uppercase tracking-wide mb-1 flex items-center gap-1.5">
                  <Flame className="w-4 h-4 text-red-500" />
                  Aturan Scatter (Emas Batangan) & Free Spins:
                </div>
                <div className="text-xs text-stone-200 leading-relaxed space-y-1.5">
                  <div>
                    🔥 <span className="text-amber-400 font-bold">Minimal 3 SCATTER (Emas Batangan) = 10 Free Spins!</span>
                  </div>
                  <div>
                    ✨ Setiap Scatter tambahan di atas 3 memberikan <span className="text-amber-300 font-bold">+2 Free Spins</span> (4 Scatter = 12 FS, 5 Scatter = 14 FS, dst).
                  </div>
                  <div>
                    🔄 <span className="text-amber-400 font-bold">Retrigger saat Free Spins:</span> 3 atau lebih Scatter menambah tepat <span className="text-amber-300 font-bold">5 Free Spins</span>!
                  </div>
                  <div>
                    ⚡ Di mode Free Spins, Multiplier gantung dimulai dari <span className="text-amber-300 font-bold">X8</span> dan berlipat ganda setiap tumble hingga <span className="text-amber-300 font-bold">X1024</span>!
                  </div>
                </div>
              </div>

              {/* Levels breakdown */}
              <div className="space-y-2.5">
                {LEVEL_CONFIGS.map((cfg) => {
                  const isCurrent = currentLevel === cfg.level;
                  return (
                    <div
                      key={cfg.level}
                      className={`p-3 rounded-xl border flex items-center justify-between gap-3 ${
                        isCurrent
                          ? 'bg-amber-500/15 border-amber-500 shadow-md'
                          : 'bg-[#221208] border-[#4a2812]'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div
                          className="w-10 h-10 rounded-lg flex items-center justify-center font-bold text-sm shrink-0 border"
                          style={{
                            borderColor: cfg.color,
                            backgroundColor: `${cfg.color}15`,
                            color: cfg.color,
                          }}
                        >
                          L{cfg.level}
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="text-xs font-bold text-stone-100">{cfg.title}</span>
                            {isCurrent && (
                              <span className="text-[10px] px-1.5 py-0.2 rounded bg-amber-500 text-stone-950 font-bold">
                                ACTIVE
                              </span>
                            )}
                          </div>
                          <div className="text-[11px] text-stone-400">
                            Req Level Up: {cfg.reqScatters} Scatter{cfg.reqScatters > 1 ? 's' : ''} (3+ Scatters = 10 Free Spins)
                          </div>
                        </div>
                      </div>

                      <div className="text-right">
                        <span className="text-xs font-mono font-bold text-amber-400">
                          {cfg.level === 1 ? 'Base' : `Tier ${cfg.level}`}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {tab === 'PAYTABLE' && (
            <div className="space-y-3">
              {/* Win Tiers Box */}
              <div className="p-3 rounded-xl bg-gradient-to-r from-amber-950/40 via-stone-900/60 to-amber-950/40 border border-amber-600/30 text-xs">
                <div className="font-bold text-amber-300 mb-1">Tingkat Kemenangan (Total Bet Multiplier):</div>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5 text-[11px] font-mono">
                  <div className="p-1.5 rounded bg-stone-900 border border-stone-800 text-stone-300">
                    <span className="text-amber-400 font-bold">10x - 24x:</span> BIG WIN
                  </div>
                  <div className="p-1.5 rounded bg-stone-900 border border-stone-800 text-amber-300">
                    <span className="text-amber-400 font-bold">25x - 49x:</span> SUPER BIG
                  </div>
                  <div className="p-1.5 rounded bg-stone-900 border border-stone-800 text-yellow-300">
                    <span className="text-amber-400 font-bold">50x - 99x:</span> MEGA WIN
                  </div>
                  <div className="p-1.5 rounded bg-stone-900 border border-stone-800 text-red-300">
                    <span className="text-amber-400 font-bold">100x+:</span> EPIC WIN
                  </div>
                </div>
              </div>

              <div className="text-xs text-stone-400">
                Nilai bayaran dikalikan dengan total taruhan (Total Bet). Simbol membayar di posisi mana saja pada papan perisai 24 ubin.
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {Object.values(SYMBOLS).map((sym) => (
                  <div
                    key={sym.id}
                    className="p-3 rounded-xl bg-[#221208] border border-[#523015] flex items-center justify-between"
                  >
                    <div className="flex items-center gap-2.5">
                      <div
                        className="w-12 h-12 rounded-lg flex items-center justify-center p-1 shrink-0 overflow-visible"
                      >
                        <SlotSymbolGraphic symbolId={sym.id} />
                      </div>
                      <div>
                        <div className="text-xs font-bold text-stone-200">{sym.name}</div>
                        <div className="text-[10px] text-stone-500">
                          {sym.isWild
                            ? 'WILD: Mewakili simbol terbanyak'
                            : sym.isScatter
                            ? 'SCATTER: 3+ = 10 Free Spins'
                            : 'Pay Anywhere 6+'}
                        </div>
                      </div>
                    </div>

                    <div className="text-right text-[11px] font-mono text-amber-300">
                      {sym.isScatter ? (
                        <div className="text-red-400 font-bold">3+ = 10 Free Spins</div>
                      ) : sym.isWild ? (
                        <div className="text-yellow-400 font-bold">All Columns</div>
                      ) : (
                        <div>
                          6-7: <b>{sym.payouts[0]}x</b> · 8-9: <b>{sym.payouts[1]}x</b> · 10+: <b>{sym.payouts[2]}x</b>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
