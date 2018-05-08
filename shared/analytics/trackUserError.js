// @flow
const debug = require('debug')('api:analytics:trackUserError');
import Raven from 'shared/raven';
import { amplitude } from './amplitude';
import { getEventTypeFromErrorType } from 'shared/errors';

export const trackUserError = (
  userId: string,
  errorType: string,
  eventProperties: Object
) => {
  const eventType = getEventTypeFromErrorType(errorType);

  const amplitudePromise = () => {
    debug(`[Amplitude] Tracking error ${eventType}`);
    return amplitude.track({
      userId,
      eventType,
      eventProperties: {
        ...eventProperties,
        reason: errorType,
        client: 'api',
      },
    });
  };

  return Promise.all([amplitudePromise()]).catch(err => {
    console.error('Error tracking UserError: ', err);
    Raven.captureException(err);
  });
};
