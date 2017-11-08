// @flow
import {
  __createUserLoader,
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

// Create all the necessary loaders to be attached to the GraphQL context for each request
const createLoaders = () => ({
  user: __createUserLoader(),
  userThreadCount: __createUserThreadCountLoader(),
  userRecurringPayments: __createUserRecurringPaymentsLoader(),
  userPermissionsInCommunity: __createUserPermissionsInCommunityLoader(),
  userPermissionsInChannel: __createUserPermissionsInChannelLoader(),
  userTotalReputation: __createUserTotalReputationLoader(),
  userThreadNotificationStatus: __createUserThreadNotificationStatusLoader(),
  thread: __createThreadLoader(),
  threadParticipants: __createThreadParticipantsLoader(),
  threadMessageCount: __createThreadMessageCountLoader(),
  notification: __createNotificationLoader(),
  channel: __createChannelLoader(),
  channelMemberCount: __createChannelMemberCountLoader(),
  channelThreadCount: __createChannelThreadCountLoader(),
  channelPendingUsers: __createChannelPendingMembersLoader(),
  community: __createCommunityLoader(),
  communityBySlug: __createCommunityBySlugLoader(),
  communityRecurringPayments: __createCommunityRecurringPaymentsLoader(),
  communityChannelCount: __createCommunityChannelCountLoader(),
  communityMemberCount: __createCommunityMemberCountLoader(),
  directMessageThread: __createDirectMessageThreadLoader(),
  directMessageParticipants: __createDirectMessageParticipantsLoader(),
  directMessageSnippet: __createDirectMessageSnippetLoader(),
  messageReaction: __createReactionLoader(),
});

export default createLoaders;
