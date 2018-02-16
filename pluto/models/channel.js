// @flow
import { db } from 'iris/models/db';

export const archiveAllCommunityPrivateChannels = (communityId: string) => {
  return db
    .table('channels')
    .getAll(communityId, { index: 'communityId' })
    .filter({ isPrivate: true })
    .update({ isArchived: true });
};
