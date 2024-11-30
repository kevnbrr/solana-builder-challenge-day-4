import React from 'react';
import { BettingMenu } from './BettingMenu';

interface GameControlsProps {
  onHit: () => void;
  onStand: () => void;
  onBet: (amount: number) => void;
  onNewGame: () => void;
  gameStatus: 'betting' | 'playing' | 'dealerTurn' | 'gameOver';
  balance: number;
}

export const GameControls: React.FC<GameControlsProps> = ({
  onHit,
  onStand,
  onBet,
  onNewGame,
  gameStatus,
  balance
}) => {
  if (gameStatus === 'betting') {
    return <BettingMenu onBet={onBet} balance={balance} />;
  }

  if (gameStatus === 'playing') {
    return (
      <div className="flex gap-4 animate-fade-in">
        <button onClick={onHit} className="btn-secondary">
          Hit
        </button>
        <button onClick={onStand} className="btn-danger">
          Stand
        </button>
      </div>
    );
  }

  if (gameStatus === 'gameOver') {
    return (
      <button onClick={onNewGame} className="btn-primary animate-fade-in">
        New Game
      </button>
    );
  }

  return null;
}