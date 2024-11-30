import { Connection, Transaction, PublicKey, sendAndConfirmTransaction, LAMPORTS_PER_SOL } from '@solana/web3.js';
import { LAMPORTS_PER_SOL as LAMPORTS_CONSTANT } from '../config/constants';

export const confirmTransaction = async (
  connection: Connection,
  signature: string,
  commitment: 'processed' | 'confirmed' | 'finalized' = 'confirmed',
  maxRetries = 3
): Promise<boolean> => {
  try {
    let retries = 0;
    while (retries < maxRetries) {
      try {
        const result = await connection.confirmTransaction(signature, commitment);
        if (!result.value.err) {
          return true;
        }
        retries++;
        await new Promise(resolve => setTimeout(resolve, 1000)); // Wait 1 second between retries
      } catch (error) {
        retries++;
        if (retries === maxRetries) throw error;
        await new Promise(resolve => setTimeout(resolve, 1000));
      }
    }
    return false;
  } catch (error) {
    console.error('Transaction confirmation failed:', error);
    return false;
  }
};

export const validateTransaction = (transaction: Transaction): boolean => {
  try {
    if (!transaction.recentBlockhash) {
      throw new Error('Transaction missing recent blockhash');
    }
    if (!transaction.feePayer) {
      throw new Error('Transaction missing fee payer');
    }
    if (transaction.instructions.length === 0) {
      throw new Error('Transaction has no instructions');
    }
    return transaction.verify();
  } catch (error) {
    console.error('Transaction validation failed:', error);
    return false;
  }
};

export const solToLamports = (sol: number): number => {
  return Math.floor(sol * LAMPORTS_CONSTANT);
};

export const lamportsToSol = (lamports: number): number => {
  return lamports / LAMPORTS_CONSTANT;
};

export const getBalance = async (connection: Connection, publicKey: PublicKey): Promise<number> => {
  try {
    const balance = await connection.getBalance(publicKey);
    return balance;
  } catch (error) {
    console.error('Failed to get balance:', error);
    throw new Error('Failed to fetch wallet balance');
  }
};

export const hasEnoughBalance = async (
  connection: Connection,
  publicKey: PublicKey,
  amount: number,
  includesFee = true
): Promise<boolean> => {
  try {
    const balance = await getBalance(connection, publicKey);
    const requiredAmount = includesFee ? amount + 5000 : amount; // Add 5000 lamports for fee
    return balance >= requiredAmount;
  } catch (error) {
    console.error('Balance check failed:', error);
    return false;
  }
};

export const estimateTransactionFee = async (
  connection: Connection,
  transaction: Transaction
): Promise<number> => {
  try {
    const { value } = await connection.getFeeForMessage(
      transaction.compileMessage(),
      'confirmed'
    );
    return value ?? 5000; // Default to 5000 lamports if estimation fails
  } catch (error) {
    console.error('Fee estimation failed:', error);
    return 5000; // Default fee
  }
};