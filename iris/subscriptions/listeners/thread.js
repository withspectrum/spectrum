// @flow
const { listenToUpdatedThreads } = require('../../models/thread');
import asyncify from '../../utils/asyncify';

module.exports = asyncify(listenToUpdatedThreads, err => {
  throw new Error(err);
});
