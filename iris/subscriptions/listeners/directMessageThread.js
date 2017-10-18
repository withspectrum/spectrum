// @flow
const {
  listenToUpdatedDirectMessageThreads,
} = require('../../models/directMessageThread');
import asyncify from '../../utils/asyncify';

module.exports = asyncify(listenToUpdatedDirectMessageThreads, err => {
  throw new Error(err);
});
