// @flow
const debug = require('debug')('chronos:queue:daily-digest');
import Raven from 'shared/raven';
import processDigest from './processDigest';

export default () => {
  try {
    debug('Init daily digest');
    return processDigest('daily');
  } catch (err) {
    console.error('❌ Error in job:\n');
    console.error(err);
    Raven.captureException(err);
  }
};
