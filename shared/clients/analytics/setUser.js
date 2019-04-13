// @flow
import type { Amplitude } from './';

export const createSetUser = (amplitude: Amplitude) => (userId: string) => {
  if (!amplitude) {
    return;
  }

  const AMPLITUDE_API_KEY =
    process.env.NODE_ENV === 'production'
      ? process.env.AMPLITUDE_API_KEY
      : process.env.AMPLITUDE_API_KEY_DEVELOPMENT;

  if (!AMPLITUDE_API_KEY) {
    return;
  }

  const amplitudePromise = () => {
    return amplitude.getInstance().setUserId(userId);
  };

  return Promise.all([amplitudePromise()]);
};
