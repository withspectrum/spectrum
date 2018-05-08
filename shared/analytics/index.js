// @flow
const debug = require('debug')('api:analytics');
import { amplitude } from './amplitude';
import { getEventTypeFromErrorType } from 'shared/errors';

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

  return Promise.all([amplitudePromise()]);
};

export const identify = (userId: string, userProperties: Object) => {
  const amplitudePromise = () => {
    debug(`[Amplitude] Identify ${userId}`);
    return amplitude.identify({
      userId,
      userProperties,
    });
  };

  return Promise.all([amplitudePromise()]);
};
