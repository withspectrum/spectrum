// @flow
import { getStories } from '../models/story';
import createLoader from './create-loader';
import type { Loader } from './types';

export const __createStoryLoader = () =>
  createLoader(stories => getStories(stories));

export default () => {
  throw new Error(
    '⚠️ Do not import loaders directly, get them from the GraphQL context instead! ⚠️'
  );
};
