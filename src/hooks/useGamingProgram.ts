import { useConnection, useWallet } from '@solana/wallet-adapter-react';
import { Program, AnchorProvider, web3 } from '@project-serum/anchor';
import { useCallback, useMemo } from 'react';
import { HOUSE_WALLET_ADDRESS } from '../config/constants';
import { IDL } from '../idl/solana_gaming';

const PROGRAM_ID = new web3.PublicKey('Gaming11111111111111111111111111111111111111');

export const useGamingProgram = () => {
  const { connection } = useConnection();
  const { publicKey, signTransaction, signAllTransactions } = useWallet();

  const provider = useMemo(() => {
    if (!publicKey || !signTransaction || !signAllTransactions) return null;
    return new AnchorProvider(
      connection,
      {
        publicKey,
        signTransaction,
        signAllTransactions,
      },
      { commitment: 'confirmed' }
    );
  }, [connection, publicKey, signTransaction, signAllTransactions]);

  const program = useMemo(() => {
    if (!provider) return null;
    return new Program(IDL, PROGRAM_ID, provider);
  }, [provider]);

  const deposit = useCallback(async (amount: number) => {
    if (!program || !publicKey) throw new Error('Program not initialized');

    const [playerPDA] = web3.PublicKey.findProgramAddressSync(
      [Buffer.from('player'), publicKey.toBuffer()],
      program.programId
    );

    const tx = await program.methods
      .deposit(new web3.BN(amount))
      .accounts({
        house: new web3.PublicKey(HOUSE_WALLET_ADDRESS),
        player: publicKey,
        playerState: playerPDA,
        systemProgram: web3.SystemProgram.programId,
      })
      .transaction();

    const signature = await provider!.sendAndConfirm(tx);
    return signature;
  }, [program, publicKey, provider]);

  const withdraw = useCallback(async (amount: number) => {
    if (!program || !publicKey) throw new Error('Program not initialized');

    const [playerPDA] = web3.PublicKey.findProgramAddressSync(
      [Buffer.from('player'), publicKey.toBuffer()],
      program.programId
    );

    const tx = await program.methods
      .withdraw(new web3.BN(amount))
      .accounts({
        house: new web3.PublicKey(HOUSE_WALLET_ADDRESS),
        player: publicKey,
        playerState: playerPDA,
        systemProgram: web3.SystemProgram.programId,
      })
      .transaction();

    const signature = await provider!.sendAndConfirm(tx);
    return signature;
  }, [program, publicKey, provider]);

  const playBlackjack = useCallback(async (betAmount: number) => {
    if (!program || !publicKey) throw new Error('Program not initialized');

    const [playerPDA] = web3.PublicKey.findProgramAddressSync(
      [Buffer.from('player'), publicKey.toBuffer()],
      program.programId
    );

    const tx = await program.methods
      .playBlackjack(new web3.BN(betAmount))
      .accounts({
        house: new web3.PublicKey(HOUSE_WALLET_ADDRESS),
        player: publicKey,
        playerState: playerPDA,
      })
      .transaction();

    const signature = await provider!.sendAndConfirm(tx);
    return signature;
  }, [program, publicKey, provider]);

  return {
    program,
    deposit,
    withdraw,
    playBlackjack,
  };
};