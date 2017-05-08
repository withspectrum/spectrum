// @flow
import { __createUserLoader } from './user';

// Create all the necessary loaders to be attached to the GraphQL context for each request
const createLoaders = () => ({
  user: __createUserLoader(),
});

export default createLoaders;
