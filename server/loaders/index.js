// @flow
import { __createUserLoader, __createUserStoryCountLoader } from './user';
import { __createStoryLoader } from './story';
import { __createNotificationLoader } from './notification';

// Create all the necessary loaders to be attached to the GraphQL context for each request
const createLoaders = () => ({
  user: __createUserLoader(),
  userStoryCount: __createUserStoryCountLoader(),
  story: __createStoryLoader(),
  notification: __createNotificationLoader(),
});

export default createLoaders;
