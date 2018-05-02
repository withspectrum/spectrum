// @flow
import type { DBCommunity } from 'shared/types';
import type { GraphQLContext } from '../../';
import UserError from '../../utils/UserError';
import { canModerateCommunity } from '../../utils/permissions';

export default async (
  { id }: DBCommunity,
  _: any,
  { user, loaders }: GraphQLContext
) => {
  if (!await canModerateCommunity(user.id, id, loaders)) {
    return new UserError('You don’t have permission to manage this channel');
  }

  return await loaders.communitySettings.load(id);
};
