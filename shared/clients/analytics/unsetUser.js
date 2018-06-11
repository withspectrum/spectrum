// @flow
import type { Amplitude } from './';

export const createUnsetUser = (amplitude: Amplitude) => () => {
  if (!amplitude) {
    console.warn('No amplitude function attached to window');
    return;
  }

  const AMPLITUDE_API_KEY =
    process.env.NODE_ENV === 'production'
      ? process.env.AMPLITUDE_API_KEY
      : process.env.AMPLITUDE_API_KEY_DEVELOPMENT;

  if (!AMPLITUDE_API_KEY) {
    // console.warn(`[Amplitude Dev] Unset user`);
    return;
  }

  const amplitudePromise = () => {
    // console.warn('[Amplitude] Unset user');
    return amplitude.getInstance().setUserId(null);
  };

  return Promise.all([amplitudePromise()]);
};
