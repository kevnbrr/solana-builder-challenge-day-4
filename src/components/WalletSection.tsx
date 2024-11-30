import React from 'react';
import { useWallet } from '@solana/wallet-adapter-react';
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui';
import { Wallet, History, Loader, AlertCircle } from 'lucide-react';
import { formatSol } from '../utils/format';

interface WalletSectionProps {
  onDeposit: (amount: number) => Promise<boolean>;
  transactions: Array<{
    type: 'deposit' | 'win' | 'loss';
    amount: number;
    timestamp: Date;
    signature?: string;
  }>;
}

export const WalletSection: React.FC<WalletSectionProps> = ({ onDeposit, transactions }) => {
  const { publicKey, connected } = useWallet();
  const [depositAmount, setDepositAmount] = React.useState<string>('');
  const [error, setError] = React.useState<string | null>(null);
  const [isProcessing, setIsProcessing] = React.useState(false);

  const handleDeposit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    
    if (!connected) {
      setError('Please connect your wallet first');
      return;
    }

    const amount = parseFloat(depositAmount);
    if (isNaN(amount) || amount <= 0) {
      setError('Please enter a valid amount');
      return;
    }

    try {
      setIsProcessing(true);
      const success = await onDeposit(amount);
      if (success) {
        setDepositAmount('');
      } else {
        setError('Transaction failed. Please try again.');
      }
    } catch (err: any) {
      let errorMessage = 'Failed to process deposit. Please try again.';
      
      if (err.message?.includes('insufficient balance')) {
        errorMessage = 'Insufficient balance in your wallet.';
      } else if (err.message?.includes('User rejected')) {
        errorMessage = 'Transaction was cancelled.';
      }
      
      setError(errorMessage);
      console.error('Deposit error:', err);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="bg-slate-800/50 rounded-xl p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold flex items-center gap-2">
          <Wallet className="w-5 h-5" />
          Wallet
        </h2>
        <WalletMultiButton className="!bg-blue-600 hover:!bg-blue-700" />
      </div>

      {connected && publicKey ? (
        <>
          <form onSubmit={handleDeposit} className="space-y-4">
            <div>
              <label htmlFor="deposit" className="block text-sm font-medium text-slate-300">
                Deposit Amount (SOL)
              </label>
              <div className="mt-1 relative rounded-md shadow-sm">
                <input
                  type="number"
                  id="deposit"
                  step="0.01"
                  min="0"
                  value={depositAmount}
                  onChange={(e) => {
                    setError(null);
                    setDepositAmount(e.target.value);
                  }}
                  disabled={isProcessing}
                  className="block w-full rounded-md bg-slate-700 border-slate-600 text-white shadow-sm focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
                  placeholder="0.00"
                />
              </div>
            </div>
            {error && (
              <div className="flex items-center gap-2 text-red-400 text-sm bg-red-400/10 p-2 rounded">
                <AlertCircle className="w-4 h-4" />
                <p>{error}</p>
              </div>
            )}
            <button
              type="submit"
              className="w-full btn-primary flex items-center justify-center gap-2"
              disabled={isProcessing || !depositAmount || parseFloat(depositAmount) <= 0}
            >
              {isProcessing ? (
                <>
                  <Loader className="w-4 h-4 animate-spin" />
                  Processing...
                </>
              ) : (
                'Deposit'
              )}
            </button>
          </form>

          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <History className="w-5 h-5" />
              <h3 className="text-lg font-medium">Recent Transactions</h3>
            </div>
            <div className="space-y-2 max-h-40 overflow-y-auto">
              {transactions.length > 0 ? (
                transactions.map((tx, index) => (
                  <div
                    key={index}
                    className="flex justify-between items-center p-2 rounded bg-slate-700/50 hover:bg-slate-700/70 transition-colors"
                  >
                    <span className="capitalize">{tx.type}</span>
                    <span className={tx.type === 'win' ? 'text-green-400' : tx.type === 'loss' ? 'text-red-400' : 'text-blue-400'}>
                      {tx.type === 'loss' ? '-' : '+'}{formatSol(tx.amount)} SOL
                    </span>
                  </div>
                ))
              ) : (
                <p className="text-slate-400 text-center py-2">No transactions yet</p>
              )}
            </div>
          </div>
        </>
      ) : (
        <div className="text-center py-8 text-slate-300">
          <p>Connect your wallet to start playing</p>
        </div>
      )}
    </div>
  );
};