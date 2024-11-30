import React from 'react';
import { HandDisplay } from './HandDisplay';
import { GameStatus } from './GameStatus';
import { GameControls } from './GameControls';
import { Player } from '../types/game';

interface GameTableProps {
  dealer: Player;
  player: Player;
  gameStatus: 'betting' | 'playing' | 'dealerTurn' | 'gameOver';
  winner: 'player' | 'dealer' | 'push' | null;
  onHit: () => void;
  onStand: () => void;
  onBet: (amount: number) => void;
  onNewGame: () => void;
}

export const GameTable: React.FC<GameTableProps> = ({
  dealer,
  player,
  gameStatus,
  winner,
  onHit,
  onStand,
  onBet,
  onNewGame,
}) => {
  return (
    <div className="flex flex-col items-center gap-8 w-full max-w-4xl mx-auto">
      <div className="game-table w-full">
        <HandDisplay
          title="Dealer's Hand"
          cards={dealer.hand}
          score={dealer.score}
          showScore={gameStatus !== 'playing'}
          hideSecondCard={gameStatus === 'playing'}
        />
        
        <HandDisplay
          title="Your Hand"
          cards={player.hand}
          score={player.score}
          showScore={true}
        />
      </div>

      <GameStatus
        winner={winner}
        balance={player.balance}
        currentBet={player.bet}
      />

      <GameControls
        onHit={onHit}
        onStand={onStand}
        onBet={onBet}
        onNewGame={onNewGame}
        gameStatus={gameStatus}
        balance={player.balance}
      />
    </div>
  );
};