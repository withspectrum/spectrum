// @flow
import { getReactions } from '../models/reaction';
import createLoader from './create-loader';

export const __createReactionLoader = createLoader(
  messageIds => getReactions(messageIds),
  { indexField: 'group' }
);

export default () => {
  throw new Error(
    '⚠️ Do not import loaders directly, get them from the GraphQL context instead! ⚠️'
  );
};
