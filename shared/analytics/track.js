// @flow
const debug = require('debug')('api:analytics:track');
import Raven from 'shared/raven';
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

  return Promise.all([amplitudePromise()]).catch(err => {
    console.error('Error tracking event: ', err);
    Raven.captureException(err);
  });
};
