// @flow
const debug = require('debug')('vulcan:queue:edited');
import initIndex from 'shared/algolia';
import Raven from 'shared/raven';
import type { Job, SearchIndexJobData } from 'shared/bull/types';
import { getQueueFromType } from 'vulcan/utils/get-queue-from-type';

export const edited = async (job: Job<SearchIndexJobData>) => {
  const { id, type, event } = job.data;
  debug(`Search index event '${event}' for ${type} ${id}`);

  const queue = getQueueFromType(type);

  if (!queue) {
    throw new Error(`No valid queue type found for '${type}'`);
  }

  const record = await queue.get(id);
  const index = initIndex(queue.index);

  if (!record) {
    debug(`Error in search index event '${event}' for ${type} ${id}`);
    debug(`Object ${id} not found in ${type} database`);
    throw new Error(
      `Could not index ${type} ${id}: ${type} not found in database`
    );
  }

  if (queue.allowProcessing && !queue.allowProcessing(record)) {
    debug(`Allow processing failed for ${type} ${event} ${id}`);
    return;
  }

  const searchable = await queue.transform(record);

  return index
    .partialUpdateObject({
      objectID: record.id,
      ...searchable,
    })
    .then(() =>
      debug(`Successful search index event '${event}' for ${type} ${id}`)
    );
};
