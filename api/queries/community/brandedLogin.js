// @flow
import type { DBCommunity } from 'shared/types';
import type { GraphQLContext } from '../../';

export default async (
  { id }: DBCommunity,
  _: any,
  { loaders }: GraphQLContext
) => {
  return await loaders.communitySettings.load(id).then(() => {
    return { isEnabled: null, message: null };
  });
};
