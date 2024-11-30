import { Decimal } from 'decimal.js';

export const formatSol = (lamports: number): string => {
  const sol = new Decimal(lamports).dividedBy(1e9);
  return sol.toFixed(4);
};