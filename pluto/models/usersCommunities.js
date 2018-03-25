// @flow
import { db } from 'iris/models/db';

export const removeAllCommunityModerators = (communityId: string) => {
  return db
    .table('usersCommunities')
    .getAll(communityId, { index: 'communityId' })
    .filter({ isModerator: true })
    .update({ isModerator: false })
    .run();
};
