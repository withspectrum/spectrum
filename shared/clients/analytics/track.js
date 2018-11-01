// @flow
import type { AmplitudeClient, Amplitude } from './';

export const createTrack = (amplitude: Amplitude, client: AmplitudeClient) => (
  eventType: string,
  eventProperties?: Object = {}
) => {
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
    return amplitude.getInstance().logEvent(eventType, {
      ...eventProperties,
      client,
    });
  };

  return Promise.all([amplitudePromise()]);
};
