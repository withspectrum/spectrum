// @flow
import { __createUserLoader, __createUserStoryCountLoader } from './user';

// Create all the necessary loaders to be attached to the GraphQL context for each request
const createLoaders = () => ({
  user: __createUserLoader(),
  userStoryCount: __createUserStoryCountLoader(),
});

export default createLoaders;
