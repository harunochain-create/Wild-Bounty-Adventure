import React, { useState } from 'react';
import { HelpCircle, Star, Sparkles, X, Flame, Shield, Award } from 'lucide-react';
import { LEVEL_CONFIGS, SYMBOLS } from '../utils/slotEngine';

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
  const [tab, setTab] = useState<'3600_WAYS' | 'SCATTER_LEVELS' | 'PAYTABLE'>('3600_WAYS');

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl bg-[#1c0e07] border-2 border-[#824c20] rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#523015] bg-[#120804]">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-lg bg-amber-500/10 text-amber-400">
              <HelpCircle className="w-5 h-5 text-amber-400" />
            </div>
            <div>
              <div className="text-sm font-bold text-stone-100 flex items-center gap-2">
                <span>Rules & 3600 Ways Paytable</span>
                <span className="text-[10px] px-2 py-0.5 rounded bg-amber-950 text-amber-400 border border-amber-800 font-mono">
                  WILD BOUNTY
                </span>
              </div>
              <div className="text-xs text-stone-400">
                3600 Ways to Win, Falling Cascades & 10 Free Spins
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

        {/* Tab switcher */}
        <div className="flex border-b border-[#523015] bg-[#140b05]">
          <button
            onClick={() => setTab('3600_WAYS')}
            className={`flex-1 py-3 text-xs font-semibold transition-colors ${
              tab === '3600_WAYS'
                ? 'text-amber-400 border-b-2 border-amber-400 bg-amber-500/5'
                : 'text-stone-400 hover:text-stone-200'
            }`}
          >
            💥 3600 Ways & Cascades
          </button>
          <button
            onClick={() => setTab('SCATTER_LEVELS')}
            className={`flex-1 py-3 text-xs font-semibold transition-colors ${
              tab === 'SCATTER_LEVELS'
                ? 'text-amber-400 border-b-2 border-amber-400 bg-amber-500/5'
                : 'text-stone-400 hover:text-stone-200'
            }`}
          >
            ⭐ Scatter & 10 Free Spins
          </button>
          <button
            onClick={() => setTab('PAYTABLE')}
            className={`flex-1 py-3 text-xs font-semibold transition-colors ${
              tab === 'PAYTABLE'
                ? 'text-amber-400 border-b-2 border-amber-400 bg-amber-500/5'
                : 'text-stone-400 hover:text-stone-200'
            }`}
          >
            💰 Symbol Payouts
          </button>
        </div>

        {/* Body */}
        <div className="p-6 overflow-y-auto space-y-4">
          {tab === '3600_WAYS' && (
            <div className="space-y-4">
              <div className="p-4 rounded-xl bg-[#2a160c] border border-[#6b3c18] space-y-2">
                <h4 className="font-western text-amber-300 text-sm">Bagaimana Cara Kerja 3600 Ways & Simbol Turun?</h4>
                <p className="text-xs text-stone-300 leading-relaxed">
                  Grid permainan terdiri dari 6 kolom dengan formasi baris <span className="font-bold text-amber-400">3 - 4 - 5 - 5 - 4 - 3</span>.
                  Total cara menang dihitung dari perkalian simbol yang sama pada kolom bersebelahan:
                  <span className="font-mono text-amber-300 block my-1 font-bold">3 × 4 × 5 × 5 × 4 × 3 = 3.600 CARA MENANG (WAYS)!</span>
                </p>
                <p className="text-xs text-stone-300 leading-relaxed">
                  <span className="text-yellow-400 font-semibold">Simbol Turun (Cascade / Tumble):</span> Simbol yang menang akan meledak dan lenyap,
                  kemudian simbol-simbol di atasnya akan jatuh turun ke bawah dan simbol baru meluncur dari atas.
                  Setiap kali terjadi kemenangan beruntun, <span className="text-amber-400 font-bold">Multiplier Berganda (x1 → x2 → x4 → x8 → x16 ... x1024)</span> pada papan kayu gantung!
                </p>
              </div>
            </div>
          )}

          {tab === 'SCATTER_LEVELS' && (
            <div className="space-y-4">
              <div className="p-3.5 rounded-xl bg-gradient-to-r from-amber-950/60 to-[#221208] border border-amber-600/40">
                <div className="text-xs font-bold text-amber-300 uppercase tracking-wide mb-1 flex items-center gap-1.5">
                  <Flame className="w-4 h-4 text-red-500" />
                  Aturan Scatter & 10 Free Spins:
                </div>
                <div className="text-xs text-stone-200 leading-relaxed space-y-1">
                  <div>
                    🔥 <span className="text-amber-400 font-bold">Dapat Scatter = Otomatis Mendapatkan 10 FREE SPINS!</span>
                  </div>
                  <div>
                    ⭐ <span className="text-amber-400 font-bold">Aturan Naik Level:</span>
                    Level 1 butuh 1 Scatter untuk naik ke Level 2. Di Level 2 butuh 2 Scatter untuk ke Level 3, dst.
                  </div>
                  <div>
                    ⚡ Di mode Free Spins, Multiplier gantung dimulai dari angka tinggi <span className="text-amber-300 font-bold">x8</span> dan terus berlipat ganda hingga <span className="text-amber-300 font-bold">x1024</span>!
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
                            Req: {cfg.reqScatters} Scatter{cfg.reqScatters > 1 ? 's' : ''} → Hadiah 10 Free Spins!
                          </div>
                        </div>
                      </div>

                      <div className="text-right">
                        <span className="text-xs font-mono font-bold text-amber-400">
                          {cfg.level === 1 ? 'Base' : `Tier ${cfg.level} Multipliers`}
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
              <div className="text-xs text-stone-400">
                Kemenangan dihitung dari simbol bersebelahan dari Reel 1 paling kiri ke kanan (3, 4, 5, 6 reels berturut-turut).
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {Object.values(SYMBOLS).map((sym) => (
                  <div
                    key={sym.id}
                    className="p-3 rounded-xl bg-[#221208] border border-[#523015] flex items-center justify-between"
                  >
                    <div className="flex items-center gap-2.5">
                      <div
                        className="w-10 h-10 rounded-lg flex items-center justify-center border overflow-hidden shrink-0"
                        style={{ borderColor: sym.color }}
                      >
                        {sym.image ? (
                          <img src={sym.image} alt={sym.name} className="w-full h-full object-cover" />
                        ) : (
                          <span className="font-western font-bold text-sm" style={{ color: sym.color }}>
                            {sym.id}
                          </span>
                        )}
                      </div>
                      <div>
                        <div className="text-xs font-bold text-stone-200">{sym.name}</div>
                        <div className="text-[10px] text-stone-500">
                          {sym.isWild
                            ? 'Wild: Pengganti semua simbol'
                            : sym.isScatter
                            ? 'Scatter: 10 Free Spins & Level Up'
                            : 'Simbol 3600 Ways'}
                        </div>
                      </div>
                    </div>

                    <div className="text-right text-[11px] font-mono text-amber-300">
                      {sym.isScatter || sym.isWild ? (
                        <div className="text-amber-400 font-bold">Special Symbol</div>
                      ) : (
                        <div>
                          3x: <b>{sym.payouts[0]}</b> · 4x: <b>{sym.payouts[1]}</b> · 5x: <b>{sym.payouts[2]}</b> · 6x: <b>{sym.payouts[3]}</b>
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
