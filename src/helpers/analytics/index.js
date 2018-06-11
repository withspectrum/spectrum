// @flow
import { createAmplitudeHelpers } from 'shared/clients/analytics';
import { isDesktopApp } from 'src/helpers/is-desktop-app';

const {
  events,
  track,
  setUser,
  unsetUser,
  transformations,
} = createAmplitudeHelpers({
  amplitude: window.amplitude,
  client: isDesktopApp() ? 'desktop' : 'web',
});

export { events, track, setUser, unsetUser, transformations };
