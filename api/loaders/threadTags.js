// @flow
import { getThreadTags } from '../models/threadTags';
import createLoader from './create-loader';

export const __createThreadTagsLoader = createLoader(
  (threadTags: Array<string>) => getThreadTags(threadTags)
);
