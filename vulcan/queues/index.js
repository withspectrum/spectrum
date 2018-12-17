// @flow
const debug = require('debug')('vulcan:queue:search-index');
import Raven from 'shared/raven';
import type { Job, SearchIndexJobData } from 'shared/bull/types';
import { getQueueFromType } from 'vulcan/utils/get-queue-from-type';

export default (job: Job<SearchIndexJobData>) => {
  try {
    const { type, event, id } = job.data;
    debug(`Search index event '${event}' for ${type} ${id}`);

    const queue = getQueueFromType(type);

    if (!queue) {
      throw new Error(`No valid queue type found for '${type}'`);
    }

    if (!queue[event]) {
      throw new Error(`No event for '${event}' found on queue ${type}`);
    }

    return queue[event](job);
  } catch (err) {
    console.error('❌ Error in job:\n');
    console.error(err);
    Raven.captureException(err);
  }
};
