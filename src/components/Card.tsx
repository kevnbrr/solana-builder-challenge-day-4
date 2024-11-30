import React from 'react';
import { Card as CardType } from '../types/game';
import { Heart, Diamond, Club, Spade } from 'lucide-react';

interface CardProps {
  card: CardType;
  hidden?: boolean;
}

const getSuitIcon = (suit: CardType['suit']) => {
  const iconProps = { size: 20, strokeWidth: 2.5 };
  
  switch (suit) {
    case 'hearts': return <Heart {...iconProps} className="text-red-500" />;
    case 'diamonds': return <Diamond {...iconProps} className="text-red-500" />;
    case 'clubs': return <Club {...iconProps} className="text-slate-900" />;
    case 'spades': return <Spade {...iconProps} className="text-slate-900" />;
  }
};

export const Card: React.FC<CardProps> = ({ card, hidden = false }) => {
  if (hidden) {
    return (
      <div className="w-24 h-36 bg-gradient-to-br from-blue-600 to-blue-800 rounded-xl shadow-xl border-2 border-blue-400/30 flex items-center justify-center transform transition-all duration-300 hover:shadow-2xl">
        <div className="w-16 h-24 bg-blue-500/20 rounded-lg border border-blue-400/30"></div>
      </div>
    );
  }

  return (
    <div className="w-24 h-36 bg-white rounded-xl shadow-xl border border-slate-200/50 flex flex-col items-center justify-between p-3 transform transition-all duration-300 hover:shadow-2xl">
      <div className="self-start">{getSuitIcon(card.suit)}</div>
      <div className={`text-2xl font-bold ${card.suit === 'hearts' || card.suit === 'diamonds' ? 'text-red-500' : 'text-slate-900'}`}>
        {card.face || card.value}
      </div>
      <div className="self-end transform rotate-180">
        {getSuitIcon(card.suit)}
      </div>
    </div>
  );
};