// @flow
import { created } from 'vulcan/queues/events/created';
import { edited } from 'vulcan/queues/events/edited';
import { deleted } from 'vulcan/queues/events/deleted';
import { getCommunityById } from 'shared/db/queries/community';
import { dbCommunityToSearchCommunity } from 'vulcan/utils';
import type { Job, SearchIndexJobData } from 'shared/bull/types';

export const communityType = {
  created,
  edited,
  deleted,
  moved: (job: Job<SearchIndexJobData>) => {},
  get: getCommunityById,
  transform: dbCommunityToSearchCommunity,
  index: 'communities',
};
