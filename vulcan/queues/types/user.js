// @flow
import { created } from 'vulcan/queues/events/created';
import { edited } from 'vulcan/queues/events/edited';
import { deleted } from 'vulcan/queues/events/deleted';
import { getUserById } from 'shared/db/queries/user';
import { dbUserToSearchUser } from 'vulcan/utils';
import type { Job, SearchIndexJobData } from 'shared/bull/types';
import type { DBUser } from 'shared/types';

export const userType = {
  created,
  edited,
  deleted,
  moved: (job: Job<SearchIndexJobData>) => {},
  get: getUserById,
  transform: dbUserToSearchUser,
  index: 'users',
  allowProcessing: (user: DBUser) => !!user.username,
};
