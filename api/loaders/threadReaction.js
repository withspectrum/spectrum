// @flow
import { getThreadReactions } from '../models/threadReaction';
import createLoader from './create-loader';

export const __createThreadReactionLoader = createLoader(
  threadIds => getThreadReactions(threadIds),
  'group'
);

export default () => {
  throw new Error(
    '⚠️ Do not import loaders directly, get them from the GraphQL context instead! ⚠️'
  );
};
