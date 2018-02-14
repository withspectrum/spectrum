// @flow
const debug = require('debug')('pluto:changefeeds:support');
import { listenToChangedFieldIn } from 'shared/changefeed-utils';
import type { DBCommunity } from 'shared/types';
import { db } from '../models/db';
import {
  stripeCommunityPrioritySupportAddedQueue,
  stripeCommunityPrioritySupportRemovedQueue,
} from 'shared/bull/queues';

export const supportChanged = () =>
  listenToChangedFieldIn(db, 'hasPrioritySupport')(
    'communities',
    (community: DBCommunity) => {
      debug('hasPrioritySupport field changed');
      if (community.hasPrioritySupport) {
        debug(`Community ${community.name} has added priority support`);
        return stripeCommunityPrioritySupportAddedQueue.add({
          communityId: community.id,
        });
      } else {
        debug(`Community ${community.name} has removed priority support`);
        return stripeCommunityPrioritySupportRemovedQueue.add({
          communityId: community.id,
        });
      }
    }
  );
