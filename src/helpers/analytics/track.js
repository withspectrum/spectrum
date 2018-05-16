// @flow
import { buffer } from './buffer';

export const track = buffer(
  (eventType: string, eventProperties?: Object = {}): Promise<any> => {
    const AMPLITUDE_API_KEY =
      process.env.NODE_ENV === 'production'
        ? process.env.AMPLITUDE_API_KEY
        : process.env.AMPLITUDE_API_KEY_DEVELOPMENT;

    if (!AMPLITUDE_API_KEY) {
      console.warn(`[Amplitude Dev] Tracking ${eventType}`);
      return Promise.resolve();
    }

    console.warn(`[Amplitude] Tracking ${eventType}`);
    return window.amplitude.getInstance().logEvent(eventType, {
      ...eventProperties,
      client: 'web',
    });
  }
);
