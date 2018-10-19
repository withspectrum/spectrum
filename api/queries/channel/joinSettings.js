// @flow
import type { DBChannel } from 'shared/types';
import type { GraphQLContext } from '../../';
import { canModerateChannel } from '../../utils/permissions';

export default async ({ id }: DBChannel, _: any, ctx: GraphQLContext) => {
  const { user: currentUser, loaders } = ctx;

  if (!currentUser) return null;

  if (!(await canModerateChannel(currentUser.id, id, loaders))) {
    return null;
  }

  return loaders.channelSettings.load(id).then(settings => {
    return settings.joinSettings;
  });
};
