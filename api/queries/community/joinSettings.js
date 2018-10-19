// @flow
import type { DBCommunity } from 'shared/types';
import type { GraphQLContext } from '../../';
import { canModerateCommunity } from '../../utils/permissions';

export default async ({ id }: DBCommunity, _: any, ctx: GraphQLContext) => {
  const { user: currentUser, loaders } = ctx;

  if (!currentUser) return null;

  if (!(await canModerateCommunity(currentUser.id, id, loaders))) {
    return null;
  }

  return loaders.communitySettings.load(id).then(settings => {
    return settings.joinSettings;
  });
};
