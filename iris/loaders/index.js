// @flow
import {
  __createUserLoader,
  __createUserByUsernameLoader,
  __createUserThreadCountLoader,
  __createUserRecurringPaymentsLoader,
  __createUserPermissionsInCommunityLoader,
  __createUserTotalReputationLoader,
  __createUserPermissionsInChannelLoader,
  __createUserThreadNotificationStatusLoader,
} from './user';
import {
  __createThreadLoader,
  __createThreadParticipantsLoader,
  __createThreadMessageCountLoader,
} from './thread';
import { __createNotificationLoader } from './notification';
import {
  __createChannelLoader,
  __createChannelMemberCountLoader,
  __createChannelThreadCountLoader,
  __createChannelPendingMembersLoader,
} from './channel';
import {
  __createCommunityLoader,
  __createCommunityBySlugLoader,
  __createCommunityRecurringPaymentsLoader,
  __createCommunityMemberCountLoader,
  __createCommunityChannelCountLoader,
} from './community';
import {
  __createDirectMessageThreadLoader,
  __createDirectMessageParticipantsLoader,
  __createDirectMessageSnippetLoader,
} from './directMessageThread';
import { __createReactionLoader } from './reaction';
import type { DataLoaderOptions } from './types';

// Create all the necessary loaders to be attached to the GraphQL context for each request
const createLoaders = (options?: DataLoaderOptions) => ({
  user: __createUserLoader(options),
  userByUsername: __createUserByUsernameLoader(options),
  userThreadCount: __createUserThreadCountLoader(options),
  userRecurringPayments: __createUserRecurringPaymentsLoader(options),
  userPermissionsInCommunity: __createUserPermissionsInCommunityLoader(options),
  userPermissionsInChannel: __createUserPermissionsInChannelLoader(options),
  userTotalReputation: __createUserTotalReputationLoader(options),
  userThreadNotificationStatus: __createUserThreadNotificationStatusLoader(
    options
  ),
  thread: __createThreadLoader(options),
  threadParticipants: __createThreadParticipantsLoader(options),
  threadMessageCount: __createThreadMessageCountLoader(options),
  notification: __createNotificationLoader(options),
  channel: __createChannelLoader(options),
  channelMemberCount: __createChannelMemberCountLoader(options),
  channelThreadCount: __createChannelThreadCountLoader(options),
  channelPendingUsers: __createChannelPendingMembersLoader(options),
  community: __createCommunityLoader(options),
  communityBySlug: __createCommunityBySlugLoader(options),
  communityRecurringPayments: __createCommunityRecurringPaymentsLoader(options),
  communityChannelCount: __createCommunityChannelCountLoader(options),
  communityMemberCount: __createCommunityMemberCountLoader(options),
  directMessageThread: __createDirectMessageThreadLoader(options),
  directMessageParticipants: __createDirectMessageParticipantsLoader(options),
  directMessageSnippet: __createDirectMessageSnippetLoader(options),
  messageReaction: __createReactionLoader(options),
});

export default createLoaders;
