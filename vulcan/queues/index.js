// @flow
const debug = require('debug')('vulcan:queue:search-index');
import Raven from 'shared/raven';
import user from './types/user';
import community from './types/community';
import message from './types/message';
import thread from './types/thread';
import type { Job, SearchIndexJobData } from 'shared/bull/types';

const types = {
  user,
  community,
  message,
  thread,
};

export default (job: Job<SearchIndexJobData>) => {
  try {
    const { type, event } = job.data;
    return types[type][event](job);
  } catch (err) {
    debug('❌ Error in job:\n');
    debug(err);
    Raven.captureException(err);
  }
};
