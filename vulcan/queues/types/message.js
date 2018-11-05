// @flow
import { created } from 'vulcan/queues/events/created';
import { edited } from 'vulcan/queues/events/edited';
import { deleted } from 'vulcan/queues/events/deleted';
import { getMessageById } from 'shared/db/queries/message';
import { dbMessageToSearchThread } from 'vulcan/utils';
import type { Job, SearchIndexJobData } from 'shared/bull/types';

export const messageType = {
  created,
  edited,
  deleted,
  moved: (job: Job<SearchIndexJobData>) => {},
  get: getMessageById,
  transform: dbMessageToSearchThread,
  index: 'threads_and_messages',
};
