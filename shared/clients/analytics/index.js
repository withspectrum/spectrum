// @flow
import { events } from '../../analytics';
import { createTrack } from './track';
import { createSetUser } from './setUser';
import { createUnsetUser } from './unsetUser';
import * as transformations from './transformations';
require('./raven');

export type AmplitudeClient = 'web' | 'desktop' | 'mobile';

export type Amplitude = {
  // NOTE(@mxstbr): The web client has a .getInstance() method you have to call each time,
  // but the mobile client doesn't, so we just manually add that on mobile
  getInstance: () => {
    setUserId: (userId: ?string) => Promise<void>,
    logEvent: (eventType: string, eventParams: Object) => Promise<void>,
  },
};

type CreateAmplitudeHelpersInput = {
  amplitude: Object,
  client: AmplitudeClient,
};

export const createAmplitudeHelpers = (input: CreateAmplitudeHelpersInput) => {
  const { amplitude, client } = input;
  const track = createTrack(amplitude, client);
  const setUser = createSetUser(amplitude);
  const unsetUser = createUnsetUser(amplitude);

  return { events, track, setUser, unsetUser, transformations };
};
