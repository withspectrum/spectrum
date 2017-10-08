// @flow
import {
  __createUserLoader,
  __createUserThreadCountLoader,
  __createUserRecurringPaymentsLoader,
} from './user';
import { __createThreadLoader } from './thread';
import { __createNotificationLoader } from './notification';
import { __createChannelLoader } from './channel';
import {
  __createCommunityLoader,
  __createCommunityBySlugLoader,
  __createCommunityRecurringPaymentsLoader,
} from './community';

// Create all the necessary loaders to be attached to the GraphQL context for each request
const createLoaders = () => ({
  user: __createUserLoader(),
  userThreadCount: __createUserThreadCountLoader(),
  userRecurringPayments: __createUserRecurringPaymentsLoader(),
  thread: __createThreadLoader(),
  notification: __createNotificationLoader(),
  channel: __createChannelLoader(),
  community: __createCommunityLoader(),
  communityBySlug: __createCommunityBySlugLoader(),
  communityRecurringPayments: __createCommunityRecurringPaymentsLoader(),
});

export default createLoaders;
