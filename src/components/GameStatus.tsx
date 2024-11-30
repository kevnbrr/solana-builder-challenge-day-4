import React from 'react';
import { Trophy, ChevronsUp, HandshakeIcon } from 'lucide-react';

interface GameStatusProps {
  winner: 'player' | 'dealer' | 'push' | null;
  balance: number;
  currentBet: number;
}

export const GameStatus: React.FC<GameStatusProps> = ({ winner, balance, currentBet }) => {
  const getWinnerDisplay = () => {
    if (!winner) return null;
    
    const config = {
      player: { icon: <Trophy className="w-8 h-8 text-yellow-500" />, text: 'You Win!' },
      dealer: { icon: <ChevronsUp className="w-8 h-8 text-red-500" />, text: 'Dealer Wins' },
      push: { icon: <HandshakeIcon className="w-8 h-8 text-blue-500" />, text: 'Push - It\'s a Tie!' },
    };

    const display = config[winner];
    
    return (
      <div className="flex items-center gap-3 justify-center animate-fade-in">
        {display.icon}
        <h2 className="text-2xl font-bold">{display.text}</h2>
      </div>
    );
  };

  return (
    <div className="text-center space-y-4">
      {getWinnerDisplay()}
      <div className="space-y-2">
        <p className="text-xl font-medium">
          Balance: <span className="text-emerald-400">${balance}</span>
        </p>
        {currentBet > 0 && (
          <p className="text-lg text-slate-300">
            Current Bet: <span className="text-emerald-400">${currentBet}</span>
          </p>
        )}
      </div>
    </div>
  );
};