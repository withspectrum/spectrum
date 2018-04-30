// @flow
import type { DBCommunity } from 'shared/types';
import type { GraphQLContext } from '../../';
import UserError from '../../utils/UserError';

export default async (
  { id }: DBCommunity,
  _: any,
  { user, loaders }: GraphQLContext
) => {
  if (!await user.canModerateCommunity(id)) {
    return new UserError('You don’t have permission to manage this channel');
  }

  return await loaders.communitySettings.load(id);
};
