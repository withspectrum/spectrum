// @flow
import type { DBCommunity } from 'shared/types';
import type { GraphQLContext } from '../../';
import UserError from '../../utils/UserError';
import { getSlackImport } from '../../models/slackImport';

export default async (
  { id }: DBCommunity,
  _: any,
  { user, loaders }: GraphQLContext
) => {
  const currentUser = user;
  if (!currentUser)
    return new UserError('You must be logged in to view community settings.');

  // only community owners should be able to query for their slack team
  const { isOwner } = await loaders.userPermissionsInCommunity.load([
    currentUser.id,
    id,
  ]);
  if (!isOwner) return null;

  return getSlackImport(id).then(data => {
    if (!data) return null;
    return {
      teamName: data.teamName,
      members: data.members ? JSON.stringify(data.members) : null,
      sent: data.sent || null,
    };
  });
};
