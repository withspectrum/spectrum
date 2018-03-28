// @flow
import type { DBCommunity } from 'shared/types';
import { getCommunitySettings } from '../../models/communitySettings';
import type { GraphQLContext } from '../../';

export default async (
  { id }: DBCommunity,
  _: any,
  { loaders }: GraphQLContext
) => {
  return await loaders.communitySettings.load(id).then(settings => {
    return settings.brandedLogin;
  });
};
