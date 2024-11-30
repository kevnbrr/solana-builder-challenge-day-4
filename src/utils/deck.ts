import { Card } from '../types/game';

export const createDeck = (): Card[] => {
  const suits = ['hearts', 'diamonds', 'clubs', 'spades'] as const;
  const deck: Card[] = [];

  suits.forEach(suit => {
    // Number cards
    for (let i = 2; i <= 10; i++) {
      deck.push({ suit, value: i });
    }
    // Face cards
    deck.push({ suit, value: 10, face: 'J' });
    deck.push({ suit, value: 10, face: 'Q' });
    deck.push({ suit, value: 10, face: 'K' });
    deck.push({ suit, value: 11, face: 'A' }); // Ace can be 1 or 11
  });

  return shuffleDeck(deck);
};

export const shuffleDeck = (deck: Card[]): Card[] => {
  const newDeck = [...deck];
  for (let i = newDeck.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [newDeck[i], newDeck[j]] = [newDeck[j], newDeck[i]];
  }
  return newDeck;
};

export const calculateHandValue = (hand: Card[]): number => {
  let value = 0;
  let aces = 0;

  hand.forEach(card => {
    if (card.face === 'A') {
      aces += 1;
    } else {
      value += card.value;
    }
  });

  // Add aces
  for (let i = 0; i < aces; i++) {
    if (value + 11 <= 21) {
      value += 11;
    } else {
      value += 1;
    }
  }

  return value;
};