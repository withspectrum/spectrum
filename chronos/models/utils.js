// @flow
import type { Timeframe } from 'chronos/types';

export const getRangeFromTimeframe = (timeframe: Timeframe): number => {
  if (timeframe === 'daily') return 60 * 60 * 24;
  if (timeframe === 'weekly') return 60 * 60 * 24 * 7;
  if (timeframe === 'monthly') return 60 * 60 * 24 * 30;
  if (timeframe === 'quarterly') return 60 * 60 * 24 * 90;
  // default 30
  return 60 * 60 * 24 * 7;
};
