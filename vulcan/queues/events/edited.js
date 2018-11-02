// @flow
const debug = require('debug')('vulcan:queue:edited');
import initIndex from 'shared/algolia';
import Raven from 'shared/raven';
import type { Job, SearchIndexJobData } from 'shared/bull/types';
import community from '../types/community';
import user from '../types/user';
import thread from '../types/thread';
import message from '../types/message';

const types = {
  community,
  user,
  thread,
  message,
};

export default async (job: Job<SearchIndexJobData>) => {
  const { id, type, event } = job.data;
  debug(`Search index event '${event}' for ${type} ${id}`);

  const queue = types[type];
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

  const searchable = queue.transform(record);

  return index
    .partialUpdateObject({
      objectID: record.id,
      ...searchable,
    })
    .then(() =>
      debug(`Successful search index event '${event}' for ${type} ${id}`)
    );
};
