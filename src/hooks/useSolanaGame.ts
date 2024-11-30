import { useState, useCallback, useEffect } from 'react';
import { useConnection, useWallet } from '@solana/wallet-adapter-react';
import { Transaction, PublicKey, SystemProgram, LAMPORTS_PER_SOL } from '@solana/web3.js';
import { HOUSE_WALLET_ADDRESS } from '../config/constants';

interface GameTransaction {
  type: 'deposit' | 'win' | 'loss';
  amount: number;
  timestamp: Date;
  signature?: string;
}

export const useSolanaGame = () => {
  const { connection } = useConnection();
  const { publicKey, sendTransaction, connected } = useWallet();
  const [transactions, setTransactions] = useState<GameTransaction[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);

  const deposit = useCallback(async (amount: number): Promise<boolean> => {
    if (!publicKey || !connected) {
      throw new Error('Wallet not connected');
    }

    try {
      setIsProcessing(true);
      const lamports = amount * LAMPORTS_PER_SOL;

      // Create transaction
      const transaction = new Transaction().add(
        SystemProgram.transfer({
          fromPubkey: publicKey,
          toPubkey: new PublicKey(HOUSE_WALLET_ADDRESS),
          lamports,
        })
      );

      // Get latest blockhash
      const { blockhash } = await connection.getLatestBlockhash();
      transaction.recentBlockhash = blockhash;
      transaction.feePayer = publicKey;

      // Send transaction - this will trigger the wallet popup
      const signature = await sendTransaction(transaction, connection);

      // Wait for confirmation
      const confirmation = await connection.confirmTransaction(signature);
      
      if (confirmation.value.err) {
        throw new Error('Transaction failed');
      }

      // Record successful transaction
      setTransactions(prev => [{
        type: 'deposit',
        amount: lamports,
        timestamp: new Date(),
        signature,
      }, ...prev]);

      return true;
    } catch (error) {
      console.error('Deposit error:', error);
      throw error;
    } finally {
      setIsProcessing(false);
    }
  }, [publicKey, connected, connection, sendTransaction]);

  const recordGameResult = useCallback((type: 'win' | 'loss', amount: number) => {
    setTransactions(prev => [{
      type,
      amount: amount * LAMPORTS_PER_SOL,
      timestamp: new Date(),
    }, ...prev]);
  }, []);

  return {
    deposit,
    recordGameResult,
    transactions,
    isProcessing
  };
};