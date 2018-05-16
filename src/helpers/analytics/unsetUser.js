// @flow
import { buffer } from './buffer';

export const unsetUser = buffer(() => {
  const AMPLITUDE_API_KEY =
    process.env.NODE_ENV === 'production'
      ? process.env.AMPLITUDE_API_KEY
      : process.env.AMPLITUDE_API_KEY_DEVELOPMENT;

  if (!AMPLITUDE_API_KEY) {
    console.warn(`[Amplitude Dev] Unset user`);
    return;
  }

  console.warn('[Amplitude] Unset user');
  return window.amplitude.getInstance().setUserId(null);
});
