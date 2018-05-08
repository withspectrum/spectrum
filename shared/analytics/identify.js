// @flow
const debug = require('debug')('api:analytics:identify');
import { amplitude } from './amplitude';

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
