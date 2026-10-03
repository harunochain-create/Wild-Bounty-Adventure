import React, { useEffect } from 'react';
import { SlotSymbolGraphic } from './SlotSymbolGraphic';

interface ScatterCongratsModalProps {
  freeSpinsAwarded: number;
  onClose: () => void;
}

export const ScatterCongratsModal: React.FC<ScatterCongratsModalProps> = ({
  freeSpinsAwarded,
  onClose,
}) => {
  useEffect(() => {
    // Auto close after 2.5s
    const timer = setTimeout(() => {
      onClose();
    }, 2500);

    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <div
      onClick={onClose}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-in fade-in duration-200 cursor-pointer select-none"
      title="Ketuk untuk lewati"
    >
      {/* 85% Width Carved Gold-Wood Card */}
      <div className="relative w-[85%] max-w-sm rounded-3xl bg-gradient-to-b from-[#3a1d0d] via-[#241107] to-[#120703] border-[3px] border-[#e0a64e] p-6 text-center shadow-[0_12px_40px_rgba(0,0,0,0.9),inset_0_2px_10px_rgba(245,197,66,0.4)] animate-in zoom-in-95 duration-200">
        {/* Gold Bars Scatter Icon */}
        <div className="relative mx-auto w-24 h-24 mb-3 flex items-center justify-center animate-bounce">
          <SlotSymbolGraphic symbolId="SCATTER" className="w-24 h-24 drop-shadow-[0_4px_12px_rgba(245,197,66,0.8)]" />
        </div>

        {/* Title: SELAMAT! & CONGRATULATIONS! */}
        <div className="text-xs font-bold uppercase tracking-widest text-amber-400 mb-0.5">
          ★ SELAMAT! ★
        </div>
        <div className="text-[10px] font-bold uppercase tracking-widest text-amber-300 mb-2">
          CONGRATULATIONS!
        </div>

        <h3 className="font-western text-2xl sm:text-3xl text-gold-gradient tracking-wide mb-2 drop-shadow-[0_2px_6px_rgba(0,0,0,0.9)]">
          PUTARAN GRATIS!
        </h3>

        {/* Amount Awarded (e.g. 10 FREE SPINS / 5 FREE SPINS) */}
        <div className="p-3 my-2 rounded-xl bg-gradient-to-r from-amber-950/80 via-stone-900/90 to-amber-950/80 border border-amber-500/50">
          <div className="text-xs text-stone-300">Anda Memperoleh</div>
          <div className="text-3xl sm:text-4xl font-western font-black text-amber-300 drop-shadow-[0_2px_10px_rgba(245,197,66,0.8)] my-0.5">
            {freeSpinsAwarded} FREE SPINS
          </div>
          <div className="text-[10px] text-amber-400/90 font-medium">
            Multiplier Berkelipatan Dimulai dari X8!
          </div>
        </div>

        <div className="text-[10px] text-stone-400 mt-3 animate-pulse">
          Ketuk di mana saja untuk langsung mulai putaran gratis...
        </div>
      </div>
    </div>
  );
};
