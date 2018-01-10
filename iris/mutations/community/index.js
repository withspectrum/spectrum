// @flow
import UserError from '../utils/UserError';
import {
  createCommunity,
  editCommunity,
  deleteCommunity,
  getCommunities,
  getCommunitiesBySlug,
  unsubscribeFromAllChannelsInCommunity,
  getCommunityById,
  setPinnedThreadInCommunity,
} from '../models/community';
import {
  createGeneralChannel,
  getChannelsByCommunity,
  getChannelsByUserAndCommunity,
  deleteChannel,
  getChannels,
} from '../models/channel';
import {
  createMemberInDefaultChannels,
  createOwnerInChannel,
  removeMemberInChannel,
  removeMembersInChannel,
} from '../models/usersChannels';
import {
  createOwnerInCommunity,
  createMemberInCommunity,
  removeMemberInCommunity,
  removeMembersInCommunity,
  getUserPermissionsInCommunity,
} from '../models/usersCommunities';
import type {
  CreateCommunityArguments,
  EditCommunityArguments,
} from '../models/community';
import { getUserById } from '../models/user';
import { getThreads } from '../models/thread';
import { getSlackImport, markSlackImportAsSent } from '../models/slackImport';
import { getThreadsByCommunity, deleteThread } from '../models/thread';
import { communitySlugIsBlacklisted } from '../utils/permissions';
import { addQueue } from '../utils/workerQueue';

import createCommunity from './createCommunity';
import deleteCommunity from './deleteCommunity';
import editCommunity from './editCommunity';
import toggleCommunityMembership from './toggleCommunityMembership';
import sendSlackInvites from './sendSlackInvites';
import sendEmailInvites from './sendEmailInvites';
import pinThread from './pinThread';

module.exports = {
  Mutation: {
    createCommunity,
    deleteCommunity,
    editCommunity,
    toggleCommunityMembership,
    sendSlackInvites,
    sendEmailInvites,
    pinThread,
  },
};
