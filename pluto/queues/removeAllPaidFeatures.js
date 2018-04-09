// @flow
const debug = require('debug')('pluto:queues:remove-all-paid-features');
import { removeAllCommunityModerators } from '../models/usersCommunities';
import { archiveAllCommunityPrivateChannels } from '../models/channel';
import { setCommunityAnalytics, setPrioritySupport } from '../models/community';
import Raven from 'shared/raven';

export default async (communityId: string) => {
  if (!communityId) return;

  return await Promise.all([
    removeAllCommunityModerators(communityId),
    archiveAllCommunityPrivateChannels(communityId),
    setCommunityAnalytics(communityId, false),
    setPrioritySupport(communityId, false),
  ]).catch(err => {
    debug('❌ Error in job:\n');
    debug(err);
    Raven.captureException(err);
  });
};
