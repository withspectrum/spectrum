// @flow
const debug = require('debug')('iris:mutations:message');
import UserError from '../utils/UserError';
import {
  storeMessage,
  getMessage,
  deleteMessage,
  userHasMessagesInThread,
} from '../models/message';
import { setDirectMessageThreadLastActive } from '../models/directMessageThread';
import {
  createParticipantInThread,
  deleteParticipantInThread,
  createParticipantWithoutNotificationsInThread,
} from '../models/usersThreads';
import { setUserLastSeenInDirectMessageThread } from '../models/usersDirectMessageThreads';
import { getThread } from '../models/thread';
import { getUserPermissionsInCommunity } from '../models/usersCommunities';
import { getUserPermissionsInChannel } from '../models/usersChannels';
import { uploadImage } from '../utils/s3';
import type { Message } from '../models/message';
import type { GraphQLContext } from '../';

import addMessage from './addMessage';
import deleteMessage from './deleteMessage';

module.exports = {
  Mutation: {
    addMessage,
    deleteMessage,
  },
};
