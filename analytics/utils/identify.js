// @flow
const debug = require('debug')('analytics:identify');
import Raven from 'shared/raven';
import { amplitude } from './amplitude';

export const identify = (userId: string, userProperties: Object) => {
  const amplitudePromise = () => {
    debug(`[Amplitude] Identify ${userId}`);
    return amplitude.identify({
      userId,
      userProperties,
    });
  };

  return Promise.all([amplitudePromise()]).catch(err => {
    console.error('Error Identifying event: ', err);
    Raven.captureException(err);
  });
};
