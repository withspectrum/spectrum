// @flow
import { Amplitude } from 'expo';
import { createAmplitudeHelpers } from '../../shared/clients/analytics';

const AMPLITUDE_API_KEY =
  process.env.NODE_ENV === 'production'
    ? process.env.AMPLITUDE_API_KEY
    : process.env.AMPLITUDE_API_KEY_DEVELOPMENT;

if (AMPLITUDE_API_KEY) {
  Amplitude.initialize(AMPLITUDE_API_KEY);
} else {
  console.warn(
    '[Analytics] No Amplitude API key provided, not tracking events.'
  );
}

const {
  events,
  track,
  setUser,
  unsetUser,
  transformations,
} = createAmplitudeHelpers({
  amplitude: { getInstance: () => Amplitude },
  client: 'mobile',
});

export { events, track, setUser, unsetUser, transformations };
