// @flow
import { isDesktopApp } from 'src/helpers/is-desktop-app';
import type { AmplitudeClient, Amplitude } from './';

export const createTrack = (amplitude: Amplitude, client: AmplitudeClient) => (
  eventType: string,
  eventProperties?: Object = {}
) => {
  if (!amplitude) {
    console.warn('No amplitude function attached to window');
    return;
  }

  const AMPLITUDE_API_KEY =
    process.env.NODE_ENV === 'production'
      ? process.env.AMPLITUDE_API_KEY
      : process.env.AMPLITUDE_API_KEY_DEVELOPMENT;

  if (!AMPLITUDE_API_KEY) {
    // console.warn(`[Amplitude Dev] Tracking ${eventType}`);
    return;
  }

  const amplitudePromise = () => {
    // console.warn(`[Amplitude] Tracking ${eventType}`);
    return amplitude.getInstance().logEvent(eventType, {
      ...eventProperties,
      // TODO(@mxstbr): Pass this in dynamically
      client: isDesktopApp() ? 'desktop' : 'web',
    });
  };

  return Promise.all([amplitudePromise()]);
};
