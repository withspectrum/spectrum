// @flow
import { __createUserLoader, __createUserThreadCountLoader } from './user';
import { __createThreadLoader } from './thread';
import { __createNotificationLoader } from './notification';
import { __createChannelLoader } from './channel';
import {
  __createCommunityLoader,
  __createCommunityBySlugLoader,
} from './community';

// Create all the necessary loaders to be attached to the GraphQL context for each request
const createLoaders = () => ({
  user: __createUserLoader(),
  userThreadCount: __createUserThreadCountLoader(),
  thread: __createThreadLoader(),
  notification: __createNotificationLoader(),
  channel: __createChannelLoader(),
  community: __createCommunityLoader(),
  communityBySlug: __createCommunityBySlugLoader(),
});

export default createLoaders;
