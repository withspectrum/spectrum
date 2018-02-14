// @flow
const debug = require('debug')('pluto:changefeeds:analytics');
import { listenToChangedFieldIn } from 'shared/changefeed-utils';
import type { DBCommunity } from 'shared/types';
import { db } from '../models/db';
import {
  stripeCommunityAnalyticsAddedQueue,
  stripeCommunityAnalyticsRemovedQueue,
} from 'shared/bull/queues';

export const analyticsChanged = () =>
  listenToChangedFieldIn(db, 'hasAnalytics')(
    'communities',
    (community: DBCommunity) => {
      if (community.hasAnalytics) {
        debug(`Community ${community.name} has added analytics`);
        return stripeCommunityAnalyticsAddedQueue.add({
          communityId: community.id,
        });
      } else {
        debug(`Community ${community.name} has removed analytics`);
        return stripeCommunityAnalyticsRemovedQueue.add({
          communityId: community.id,
        });
      }
    }
  );
