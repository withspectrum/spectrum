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
  if (!userId) {
    console.error('Undefined received as userId in tracking queue: ', {
      userId,
      eventType,
      eventProperties,
    });
    return;
  }

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
    console.error('❌ Error in job:\n');
    console.error(err);
    Raven.captureException(err);
  });
};
