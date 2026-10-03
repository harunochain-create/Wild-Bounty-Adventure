import React from 'react';
import { X, Play, Zap } from 'lucide-react';

interface AutoSpinModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectAutoSpins: (count: number) => void;
}

const AUTO_SPIN_OPTIONS = [10, 30, 50, 80, 800];

export const AutoSpinModal: React.FC<AutoSpinModalProps> = ({
  isOpen,
  onClose,
  onSelectAutoSpins,
}) => {
  if (!isOpen) return null;

  return (
    <div
      onClick={onClose}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200 select-none"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="relative w-full max-w-sm rounded-3xl bg-gradient-to-b from-[#3a1d0d] via-[#241107] to-[#120703] border-[3px] border-[#e0a64e] p-5 shadow-[0_12px_40px_rgba(0,0,0,0.9),inset_0_2px_10px_rgba(245,197,66,0.4)] animate-in zoom-in-95 duration-200"
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-3 right-3 p-1.5 rounded-full text-stone-400 hover:text-white hover:bg-stone-800/60 transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Title */}
        <div className="text-center mb-4">
          <div className="text-[10px] font-bold uppercase tracking-widest text-amber-400 mb-0.5">
            ★ PENGATURAN PUTARAN ★
          </div>
          <h3 className="font-western text-xl sm:text-2xl text-gold-gradient tracking-wide drop-shadow-[0_2px_6px_rgba(0,0,0,0.9)]">
            PUTARAN OTOMATIS
          </h3>
          <p className="text-[11px] text-stone-400 mt-1">
            Pilih jumlah putaran otomatis yang diinginkan:
          </p>
        </div>

        {/* 5 Options: 10, 30, 50, 80, 800 */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 mb-4">
          {AUTO_SPIN_OPTIONS.map((count, idx) => (
            <button
              key={count}
              onClick={() => {
                onSelectAutoSpins(count);
                onClose();
              }}
              className={`p-3 rounded-2xl bg-gradient-to-b from-[#4a2612] via-[#2a1308] to-[#1a0b04] border-2 border-[#b87834] hover:border-amber-400 hover:scale-105 active:scale-95 transition-all flex flex-col items-center justify-center cursor-pointer shadow-md group ${
                count === 800 ? 'col-span-2 sm:col-span-1' : ''
              }`}
            >
              <div className="flex items-center gap-1 text-amber-400 group-hover:text-yellow-300">
                <Play className="w-4 h-4 fill-current" />
                <span className="font-western text-xl sm:text-2xl font-black tabular-nums">
                  {count}
                </span>
              </div>
              <span className="text-[9px] font-bold uppercase tracking-wider text-stone-400 group-hover:text-amber-200 mt-0.5">
                PUTARAN
              </span>
            </button>
          ))}
        </div>

        {/* Cancel Button */}
        <button
          onClick={onClose}
          className="w-full py-2.5 rounded-xl bg-[#241107] border border-[#5a3014] text-stone-300 hover:text-white hover:bg-[#34180a] text-xs font-bold transition-all cursor-pointer shadow"
        >
          BATAL
        </button>
      </div>
    </div>
  );
};
