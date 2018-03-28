// @flow
import type { DBReaction } from 'shared/types';
import type { GraphQLContext } from '../../';

export default ({ userId }: DBReaction, _: any, { loaders }: GraphQLContext) =>
  loaders.user.load(userId);
