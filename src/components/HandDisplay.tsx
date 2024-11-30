import React from 'react';
import { Card } from './Card';
import { Card as CardType } from '../types/game';

interface HandDisplayProps {
  title: string;
  cards: CardType[];
  score: number;
  showScore: boolean;
  hideSecondCard?: boolean;
}

export const HandDisplay: React.FC<HandDisplayProps> = ({
  title,
  cards,
  score,
  showScore,
  hideSecondCard = false,
}) => {
  return (
    <div className="mb-12">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold text-white">{title}</h2>
        {showScore && (
          <span className="text-lg font-medium text-emerald-400">
            Score: {score}
          </span>
        )}
      </div>
      <div className="flex gap-4 justify-center sm:justify-start">
        {cards.map((card, index) => (
          <div key={index} className="card-container">
            <Card
              card={card}
              hidden={hideSecondCard && index === 1}
            />
          </div>
        ))}
      </div>
    </div>
  );
};