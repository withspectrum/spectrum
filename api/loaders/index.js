// @flow
import {
  __createUserLoader,
  __createUserByUsernameLoader,
  __createUserThreadCountLoader,
  __createUserPermissionsInCommunityLoader,
  __createUserPermissionsInChannelLoader,
} from './user';
import {
  __createThreadLoader,
  __createThreadParticipantsLoader,
} from './thread';
import {
  __createChannelLoader,
  __createChannelThreadCountLoader,
  __createChannelSettingsLoader,
} from './channel';
import {
  __createCommunityLoader,
  __createCommunityBySlugLoader,
  __createCommunityChannelCountLoader,
  __createCommunitySettingsLoader,
  __createCommunityMemberCountLoader,
} from './community';
import {
  __createDirectMessageThreadLoader,
  __createDirectMessageParticipantsLoader,
  __createDirectMessageSnippetLoader,
} from './directMessageThread';
import {
  __createReactionLoader,
  __createSingleReactionLoader,
} from './reaction';
import { __createThreadReactionLoader } from './threadReaction';
import { __createMessageLoader } from './message';
import type { DataLoaderOptions } from './types';

// Create all the necessary loaders to be attached to the GraphQL context for each request
const createLoaders = (options?: DataLoaderOptions) => ({
  user: __createUserLoader(options),
  userByUsername: __createUserByUsernameLoader(options),
  userThreadCount: __createUserThreadCountLoader(options),
  userPermissionsInCommunity: __createUserPermissionsInCommunityLoader(options),
  userPermissionsInChannel: __createUserPermissionsInChannelLoader(options),
  thread: __createThreadLoader(options),
  threadParticipants: __createThreadParticipantsLoader(options),
  channel: __createChannelLoader(options),
  channelThreadCount: __createChannelThreadCountLoader(options),
  channelSettings: __createChannelSettingsLoader(options),
  community: __createCommunityLoader(options),
  communityBySlug: __createCommunityBySlugLoader(options),
  communityChannelCount: __createCommunityChannelCountLoader(options),
  communityMemberCount: __createCommunityMemberCountLoader(options),
  communitySettings: __createCommunitySettingsLoader(options),
  directMessageThread: __createDirectMessageThreadLoader(options),
  directMessageParticipants: __createDirectMessageParticipantsLoader(options),
  directMessageSnippet: __createDirectMessageSnippetLoader(options),
  message: __createMessageLoader(options),
  messageReaction: __createReactionLoader(options),
  threadReaction: __createThreadReactionLoader(options),
  reaction: __createSingleReactionLoader(options),
});

export default createLoaders;
