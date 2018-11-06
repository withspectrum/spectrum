// @flow
const debug = require('debug')('vulcan:queue:thread-moved');
import initIndex from 'shared/algolia';
const index = initIndex('threads_and_messages');
import Raven from 'shared/raven';
import type { Job, SearchIndexJobData } from 'shared/bull/types';
import { getThreadById } from 'shared/db/queries/thread';
import type { DBThread } from 'shared/types';

export const moved = async (job: Job<SearchIndexJobData>) => {
  const { id, type, event } = job.data;
  debug(`Search index event '${event}' for ${type} ${id}`);

  const record = await getThreadById(id);

  if (!record) {
    debug(`Error in search index event '${event}' for ${type} ${id}`);
    debug(`Object ${id} not found in ${type} database`);
    throw new Error(
      `Could not index ${type} ${id}: ${type} not found in database`
    );
  }

  const getAllRecordsForThreadId = (record: DBThread) => {
    return new Promise((resolve, reject) => {
      return index
        .browse({
          query: '',
          filters: `threadId:'${record.id}'`,
        })
        .then(content => {
          resolve(content.hits);
          return content.hits;
        });
    });
  };

  const hits = await getAllRecordsForThreadId(record);

  if (!hits || hits.length === 0) return;

  const allRecords = hits.map(r => ({
    channelId: record.channelId,
    objectID: r.objectID,
  }));

  return index
    .partialUpdateObjects(allRecords)
    .then(() =>
      debug(`Successful search index event '${event}' for ${type} ${id}`)
    );
};
