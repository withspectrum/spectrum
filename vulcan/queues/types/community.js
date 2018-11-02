// @flow
import created from '../events/created';
import edited from '../events/edited';
import deleted from '../events/deleted';
import { getCommunityById } from 'shared/db/queries/community';
import { dbCommunityToSearchCommunity } from '../../utils';
import type { Job, SearchIndexJobData } from 'shared/bull/types';

export default {
  created,
  edited,
  deleted,
  moved: (job: Job<SearchIndexJobData>) => {},
  get: getCommunityById,
  transform: dbCommunityToSearchCommunity,
  index: 'communities',
};
