// @flow
import { db } from 'api/models/db';

export const archiveAllCommunityPrivateChannels = (communityId: string) => {
  return db
    .table('channels')
    .getAll(communityId, { index: 'communityId' })
    .filter({ isPrivate: true })
    .update({ archivedAt: new Date() });
};
