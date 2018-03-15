// @flow
import { removeAllCommunityModerators } from '../models/usersCommunities';
import { archiveAllCommunityPrivateChannels } from '../models/channel';
import { setCommunityAnalytics, setPrioritySupport } from '../models/community';

export default async (communityId: string) => {
  if (!communityId) return;

  return await Promise.all([
    removeAllCommunityModerators(communityId),
    archiveAllCommunityPrivateChannels(communityId),
    setCommunityAnalytics(communityId, false),
    setPrioritySupport(communityId, false),
  ]);
};
