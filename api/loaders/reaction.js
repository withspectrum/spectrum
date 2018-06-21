// @flow
import {
  getReactions,
  getThreadReactions,
  getReactionsByIds,
} from '../models/reaction';
import createLoader from './create-loader';

export const __createReactionLoader = createLoader(
  messageIds => getReactions(messageIds),
  'group'
);

export const __createThreadReactionLoader = createLoader(
  threadIds => getThreadReactions(threadIds),
  'group'
);

export const __createSingleReactionLoader = createLoader(reactionIds =>
  getReactionsByIds(reactionIds)
);

export default () => {
  throw new Error(
    '⚠️ Do not import loaders directly, get them from the GraphQL context instead! ⚠️'
  );
};
