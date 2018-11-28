// @flow
const debug = require('debug')('chronos:queue:daily-digest');
import processDigest from './processDigest';
export default () => {
  debug('Init daily digest');
  return processDigest('daily');
};
