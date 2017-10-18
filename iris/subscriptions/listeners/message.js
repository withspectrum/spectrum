// @flow
const { listenToNewMessages } = require('../../models/message');
import asyncify from '../../utils/asyncify';

module.exports = asyncify(listenToNewMessages, err => {
  throw new Error(err);
});
