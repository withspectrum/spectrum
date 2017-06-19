// @flow
const debug = require('debug')('hermes:queue:send-new-message-email');
import processQueue from '../process-queue';
import { SEND_NEW_MESSAGE_EMAIL } from './constants';

export default () =>
  processQueue(SEND_NEW_MESSAGE_EMAIL, job => {
    debug('new job');
  });
