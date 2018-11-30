// @flow
const debug = require('debug')('chronos:queue:daily-digest');
import Raven from 'shared/raven';
import processDigest from './processDigest';

export default () => {
  try {
    debug('Init daily digest');
    return processDigest('daily');
  } catch (err) {
    debug('❌ Error in job:\n');
    debug(err);
    Raven.captureException(err);
  }
};
