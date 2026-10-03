import React from 'react';
import { SymbolId } from '../types/slot';
import { SYMBOLS } from '../utils/slotEngine';

interface SlotSymbolGraphicProps {
  symbolId: SymbolId;
  className?: string;
}

export const SlotSymbolGraphic: React.FC<SlotSymbolGraphicProps> = ({
  symbolId,
  className = 'w-full h-full',
}) => {
  const sym = SYMBOLS[symbolId];
  if (!sym?.image) return null;

  return (
    <img
      src={sym.image}
      alt={sym.name || symbolId}
      className={`${className} object-contain pointer-events-none drop-shadow-[0_4px_8px_rgba(0,0,0,0.7)]`}
      draggable={false}
      loading="eager"
    />
  );
};
