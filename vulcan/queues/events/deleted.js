// @flow
const debug = require('debug')('vulcan:queue:deleted');
import initIndex from 'shared/algolia';
import Raven from 'shared/raven';
import type { Job, SearchIndexJobData } from 'shared/bull/types';
import { getQueueFromType } from 'vulcan/utils/get-queue-from-type';

export const deleted = async (job: Job<SearchIndexJobData>) => {
  const { id, type, event } = job.data;
  debug(`Search index event '${event}' for ${type} ${id}`);

  const queue = getQueueFromType(type);

  if (!queue) {
    throw new Error(`No valid queue type found for '${type}'`);
  }

  const index = initIndex(queue.index);

  return index
    .deleteObject(id)
    .then(() =>
      debug(`Successful search index event '${event}' for ${type} ${id}`)
    );
};
