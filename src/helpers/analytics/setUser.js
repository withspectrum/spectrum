// @flow
import { buffer } from './buffer';

export const setUser = buffer((userId: string) => {
  const AMPLITUDE_API_KEY =
    process.env.NODE_ENV === 'production'
      ? process.env.AMPLITUDE_API_KEY
      : process.env.AMPLITUDE_API_KEY_DEVELOPMENT;

  if (!AMPLITUDE_API_KEY) {
    console.warn(`[Amplitude Dev] Set user ${userId}`);
    return;
  }

  console.warn(`[Amplitude] Set user ${userId}`);
  return window.amplitude.getInstance().setUserId(userId);
});
