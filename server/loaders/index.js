// @flow
import { __createUserLoader, __createUserStoryCountLoader } from './user';
import { __createStoryLoader } from './story';
import { __createNotificationLoader } from './notification';
import { __createFrequencyLoader } from './frequency';
import {
  __createCommunityLoader,
  __createCommunityBySlugLoader,
} from './community';

// Create all the necessary loaders to be attached to the GraphQL context for each request
const createLoaders = () => ({
  user: __createUserLoader(),
  userStoryCount: __createUserStoryCountLoader(),
  story: __createStoryLoader(),
  notification: __createNotificationLoader(),
  frequency: __createFrequencyLoader(),
  community: __createCommunityLoader(),
  communityBySlug: __createCommunityBySlugLoader(),
});

export default createLoaders;
