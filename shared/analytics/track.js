// @flow
const debug = require('debug')('api:analytics:track');
import { amplitude } from './amplitude';

export const track = (
  userId: string,
  eventType: string,
  eventProperties: Object = {}
) => {
  const amplitudePromise = () => {
    debug(`[Amplitude] Tracking ${eventType}`);
    return amplitude.track({
      userId,
      eventType,
      eventProperties: {
        ...eventProperties,
        client: 'api',
      },
    });
  };

  return Promise.all([amplitudePromise()]);
};
