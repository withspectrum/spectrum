// @flow

/*

Deprecated. We now send slack invitations directly by dispatching a job to 
athena 'sendSlackInvites' in mutation

*/

import type { GraphQLContext } from '../../';
import UserError from '../../utils/UserError';
import { slackImportQueue } from 'shared/bull/queues';
import { getSlackImport } from '../../models/slackImport';

type ImportSlackMemberInput = {
  input: {
    id: string,
  },
};

export default async (
  _: any,
  { input: { id } }: ImportSlackMemberInput,
  { user, loaders }: GraphQLContext
) => {
  const currentUser = user;
  if (!currentUser) {
    return new UserError(
      'You must be signed in to pin a thread in this community.'
    );
  }

  const permissions = await loaders.userPermissionsInCommunity.load([
    currentUser.id,
    id,
  ]);

  if (!permissions.isOwner && !permissions.isModerator) {
    return new UserError("You don't have permission to do this.");
  }

  const slackImport = await getSlackImport(id);

  if (!slackImport)
    return new UserError('No Slack team connected, cannot import members.');

  slackImportQueue.add({ token: slackImport.token, importId: slackImport.id });

  return true;
};
