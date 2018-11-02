// @flow
import created from '../events/created';
import edited from '../events/edited';
import deleted from '../events/deleted';
import { getUserById } from 'shared/db/queries/user';
import { dbUserToSearchUser } from '../../utils';
import type { Job, SearchIndexJobData } from 'shared/bull/types';
import type { DBUser } from 'shared/types';

export default {
  created,
  edited,
  deleted,
  moved: (job: Job<SearchIndexJobData>) => {},
  get: getUserById,
  transform: dbUserToSearchUser,
  index: 'users',
  allowProcessing: (user: DBUser) => !!user.username,
};
