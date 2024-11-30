import { useState, useCallback } from 'react';
import { GameState, Card, Player } from '../types/game';
import { createDeck, calculateHandValue } from '../utils/deck';
import { INITIAL_BALANCE, DEALER_MIN_SCORE } from '../config/constants';

const createInitialState = (): GameState => ({
  deck: createDeck(),
  player: {
    hand: [],
    balance: INITIAL_BALANCE,
    bet: 0,
    score: 0,
    busted: false
  },
  dealer: {
    hand: [],
    balance: 0,
    bet: 0,
    score: 0,
    busted: false
  },
  gameStatus: 'betting',
  winner: null
});

export const useBlackjack = () => {
  const [gameState, setGameState] = useState<GameState>(createInitialState());

  const dealInitialCards = useCallback(() => {
    const deck = [...gameState.deck];
    const playerHand = [deck.pop()!, deck.pop()!];
    const dealerHand = [deck.pop()!, deck.pop()!];

    setGameState(prev => ({
      ...prev,
      deck,
      player: {
        ...prev.player,
        hand: playerHand,
        score: calculateHandValue(playerHand),
        busted: false
      },
      dealer: {
        ...prev.dealer,
        hand: dealerHand,
        score: calculateHandValue(dealerHand),
        busted: false
      },
      gameStatus: 'playing',
      winner: null
    }));
  }, [gameState.deck]);

  const placeBet = useCallback((amount: number) => {
    if (amount <= gameState.player.balance) {
      setGameState(prev => ({
        ...prev,
        player: {
          ...prev.player,
          balance: prev.player.balance - amount,
          bet: amount
        }
      }));
      dealInitialCards();
    }
  }, [gameState.player.balance, dealInitialCards]);

  const hit = useCallback(() => {
    const deck = [...gameState.deck];
    const card = deck.pop()!;
    const newHand = [...gameState.player.hand, card];
    const score = calculateHandValue(newHand);
    const busted = score > 21;

    setGameState(prev => ({
      ...prev,
      deck,
      player: {
        ...prev.player,
        hand: newHand,
        score,
        busted
      },
      gameStatus: busted ? 'gameOver' : 'playing',
      winner: busted ? 'dealer' : null
    }));
  }, [gameState.deck, gameState.player.hand]);

  const dealerPlay = useCallback(() => {
    let currentDeck = [...gameState.deck];
    let currentHand = [...gameState.dealer.hand];
    let currentScore = calculateHandValue(currentHand);

    while (currentScore < DEALER_MIN_SCORE) {
      const card = currentDeck.pop()!;
      currentHand.push(card);
      currentScore = calculateHandValue(currentHand);
    }

    const dealerBusted = currentScore > 21;
    const playerScore = gameState.player.score;
    let winner: GameState['winner'] = null;

    if (dealerBusted) {
      winner = 'player';
    } else if (currentScore > playerScore) {
      winner = 'dealer';
    } else if (currentScore < playerScore) {
      winner = 'player';
    } else {
      winner = 'push';
    }

    setGameState(prev => ({
      ...prev,
      deck: currentDeck,
      dealer: {
        ...prev.dealer,
        hand: currentHand,
        score: currentScore,
        busted: dealerBusted
      },
      gameStatus: 'gameOver',
      winner
    }));

    // Update balance based on game outcome
    setGameState(prev => ({
      ...prev,
      player: {
        ...prev.player,
        balance: prev.player.balance + (
          winner === 'player' ? prev.player.bet * 2 :
          winner === 'push' ? prev.player.bet :
          0
        )
      }
    }));
  }, [gameState.deck, gameState.dealer.hand, gameState.player.score]);

  const stand = useCallback(() => {
    setGameState(prev => ({
      ...prev,
      gameStatus: 'dealerTurn'
    }));
    dealerPlay();
  }, [dealerPlay]);

  const startNewGame = useCallback(() => {
    setGameState(prev => ({
      ...createInitialState(),
      player: {
        ...createInitialState().player,
        balance: prev.player.balance
      }
    }));
  }, []);

  return {
    gameState,
    placeBet,
    hit,
    stand,
    startNewGame
  };
};