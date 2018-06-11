// @flow
import { createAmplitudeHelpers } from 'shared/clients/analytics';

const {
  events,
  track,
  setUser,
  unsetUser,
  transformations,
} = createAmplitudeHelpers(window.amplitude);

export { events, track, setUser, unsetUser, transformations };
