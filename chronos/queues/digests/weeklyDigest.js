// @flow
const debug = require('debug')('chronos:queue:weekly-digest');
import processDigest from './processDigest';
export default () => {
  debug('Init weekly digest');
  return processDigest('weekly');
};
