// @flow
import created from '../events/created';
import edited from '../events/edited';
import deleted from '../events/deleted';
import { getMessageById } from 'shared/db/queries/message';
import { dbMessageToSearchThread } from '../../utils';
import type { Job, SearchIndexJobData } from 'shared/bull/types';

export default {
  created,
  edited,
  deleted,
  moved: (job: Job<SearchIndexJobData>) => {},
  get: getMessageById,
  transform: dbMessageToSearchThread,
  index: 'threads_and_messages',
};
