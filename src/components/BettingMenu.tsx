import React from 'react';
import { DollarSign, Sparkles, Crown, Star, Zap } from 'lucide-react';
import { BETTING_TIERS, SOL_USD_PRICE } from '../config/constants';
import { formatSol } from '../utils/format';

interface BettingMenuProps {
  onBet: (amount: number) => void;
  balance: number;
}

export const BettingMenu: React.FC<BettingMenuProps> = ({ onBet, balance }) => {
  const formatUSD = (sol: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(sol * SOL_USD_PRICE);
  };

  const renderTier = (
    title: string,
    amounts: readonly number[],
    icon: React.ReactNode,
    description: string
  ) => (
    <div className="bg-slate-800/50 rounded-xl p-6 space-y-4">
      <div className="flex items-center gap-2">
        {icon}
        <h3 className="text-lg font-semibold">{title}</h3>
      </div>
      <p className="text-sm text-slate-400">{description}</p>
      <div className="grid grid-cols-3 gap-2">
        {amounts.map((amount) => (
          <button
            key={amount}
            onClick={() => onBet(amount)}
            disabled={balance < amount}
            className="btn-primary py-2 px-3 text-sm flex flex-col items-center gap-1"
          >
            <span className="font-medium">{formatSol(amount * 1e9)} SOL</span>
            <span className="text-xs text-slate-300">{formatUSD(amount)}</span>
          </button>
        ))}
      </div>
    </div>
  );

  return (
    <div className="space-y-6 animate-fade-in">
      <h2 className="text-2xl font-bold text-center mb-8">Select Your Bet</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {renderTier(
          'Micro Stakes',
          BETTING_TIERS.micro,
          <Zap className="w-5 h-5 text-blue-400" />,
          'Perfect for beginners and casual players'
        )}
        {renderTier(
          'Standard',
          BETTING_TIERS.standard,
          <Star className="w-5 h-5 text-green-400" />,
          'Most popular betting range'
        )}
        {renderTier(
          'Premium',
          BETTING_TIERS.premium,
          <Sparkles className="w-5 h-5 text-yellow-400" />,
          'For experienced players seeking bigger wins'
        )}
        {renderTier(
          'High Roller',
          BETTING_TIERS.highRoller,
          <Crown className="w-5 h-5 text-purple-400" />,
          'Exclusive high-stakes betting experience'
        )}
      </div>
    </div>
  );
}