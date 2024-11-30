export const HOUSE_WALLET_ADDRESS = '7sFxqhKxuHBhwWxGkqtxKk2a3tX3M5xk8B7RUL94ZKzF';
export const INITIAL_BALANCE = 1000;
export const LAMPORTS_PER_SOL = 1000000000;
export const DEALER_MIN_SCORE = 17;

// Betting tiers in SOL
export const BETTING_TIERS = {
  micro: [0.01, 0.05, 0.1],
  standard: [0.25, 0.5, 1],
  premium: [2, 5, 10],
  highRoller: [25, 50, 100]
} as const;

// Mock SOL price in USD for demo purposes
export const SOL_USD_PRICE = 150;