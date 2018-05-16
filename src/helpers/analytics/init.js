// @flow
import { buffer } from './buffer';

export const init = buffer(() => {
  const AMPLITUDE_API_KEY =
    process.env.NODE_ENV === 'production'
      ? process.env.AMPLITUDE_API_KEY
      : process.env.AMPLITUDE_API_KEY_DEVELOPMENT;

  if (AMPLITUDE_API_KEY) {
    try {
      window.amplitude.getInstance().init(AMPLITUDE_API_KEY);
      window.amplitude.getInstance().setOptOut(false);
    } catch (err) {
      console.error('Unable to start tracking.', err.message);
    }
  } else {
    console.warn('No amplitude api key, not tracking analytics.');
  }
});
