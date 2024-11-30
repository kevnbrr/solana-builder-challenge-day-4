export interface Card {
  suit: 'hearts' | 'diamonds' | 'clubs' | 'spades';
  value: number;
  face?: string;
}

export interface Player {
  hand: Card[];
  balance: number;
  bet: number;
  score: number;
  busted: boolean;
}

export interface GameState {
  deck: Card[];
  player: Player;
  dealer: Player;
  gameStatus: 'betting' | 'playing' | 'dealerTurn' | 'gameOver';
  winner: 'player' | 'dealer' | 'push' | null;
}