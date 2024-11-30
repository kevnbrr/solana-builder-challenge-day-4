import React from 'react';
import { WalletContextProvider } from './context/WalletContextProvider';
import { useBlackjack } from './hooks/useBlackjack';
import { useSolanaGame } from './hooks/useSolanaGame';
import { GameTable } from './components/GameTable';
import { WalletSection } from './components/WalletSection';
import { Spade } from 'lucide-react';

function App() {
  const { gameState, placeBet, hit, stand, startNewGame } = useBlackjack();
  const { deposit, recordGameResult, transactions } = useSolanaGame();
  const { player, dealer, gameStatus, winner } = gameState;

  const handleDeposit = async (amount: number) => {
    const success = await deposit(amount);
    if (success) {
      // Update game balance
      // This would need to be implemented in useBlackjack
    }
  };

  return (
    <WalletContextProvider>
      <div className="min-h-screen py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <div className="flex items-center justify-center gap-3 mb-4">
              <Spade className="w-8 h-8 text-emerald-500" />
              <h1 className="text-4xl font-bold text-white">Solana Blackjack</h1>
              <Spade className="w-8 h-8 text-emerald-500" />
            </div>
            <p className="text-slate-400 text-lg">Play Blackjack with SOL</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <GameTable
                dealer={dealer}
                player={player}
                gameStatus={gameStatus}
                winner={winner}
                onHit={hit}
                onStand={stand}
                onBet={placeBet}
                onNewGame={startNewGame}
              />
            </div>
            <div>
              <WalletSection
                onDeposit={handleDeposit}
                transactions={transactions}
              />
            </div>
          </div>
        </div>
      </div>
    </WalletContextProvider>
  );
}

export default App;