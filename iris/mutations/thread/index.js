// @flow
import UserError from '../utils/UserError';
import { getChannels } from '../models/channel';
import { getUserPermissionsInChannel } from '../models/usersChannels';
import { getUserPermissionsInCommunity } from '../models/usersCommunities';
import { getCommunityRecurringPayments } from '../models/recurringPayment';
import {
  createParticipantInThread,
  createNotifiedUserInThread,
  getThreadNotificationStatusForUser,
  updateThreadNotificationStatusForUser,
} from '../models/usersThreads';
const {
  getThread,
  getThreads,
  publishThread,
  deleteThread,
  setThreadLock,
  editThread,
  moveThread,
} = require('../models/thread');
const { uploadImage } = require('../utils/s3');
import { addQueue } from '../utils/workerQueue';

import publishThread from './publishThread';
import editThread from './editThread';
import deleteThread from './deleteThread';
import setThreadLock from './setThreadLock';
import toggleThreadNotifications from './toggleThreadNotifications';
import moveThread from './moveThread';

module.exports = {
  Mutation: {
    publishThread,
    editThread,
    deleteThread,
    setThreadLock,
    toggleThreadNotifications,
    moveThread,
  },
};
