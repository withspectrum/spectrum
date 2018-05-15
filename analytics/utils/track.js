// @flow
const debug = require('debug')('analytics:track');
import Raven from 'shared/raven';
import { amplitude } from './amplitude';
import { hash } from './';

export const track = (
  userId: string,
  eventType: string,
  eventProperties: Object = {}
) => {
  const amplitudePromise = () => {
    debug(`[Amplitude] Tracking ${eventType}`);

    return amplitude.track({
      userId: hash(userId),
      eventType,
      eventProperties: {
        ...eventProperties,
        client: 'api',
      },
    });
  };

  return Promise.all([amplitudePromise()]).catch(err => {
    console.error('Error tracking event: ', err.message);
    Raven.captureException(err);
  });
};
