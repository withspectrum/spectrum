// @flow
import { getReactions } from '../models/reaction';
import createLoader from './create-loader';

const FIVE_MINUTES = 180000;

export const __createReactionLoader = createLoader(
  messageIds => getReactions(messageIds),
  { getKeyFromResult: 'group', cacheExpiryTime: FIVE_MINUTES }
);

export default () => {
  throw new Error(
    '⚠️ Do not import loaders directly, get them from the GraphQL context instead! ⚠️'
  );
};
