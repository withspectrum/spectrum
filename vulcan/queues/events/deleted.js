// @flow
const debug = require('debug')('vulcan:queue:deleted');
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

  const index = initIndex(queue.index);
  return index
    .deleteObject(id)
    .then(() =>
      debug(`Successful search index event '${event}' for ${type} ${id}`)
    );
};
