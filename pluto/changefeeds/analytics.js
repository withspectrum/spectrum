// @flow
const debug = require('debug')('pluto:changefeeds:analytics');
import { listenToChangedFieldIn } from 'shared/changefeed-utils';
import type { DBCommunity } from 'shared/types';
import { db } from 'api/models/db';
import {
  stripeCommunityAnalyticsAddedQueue,
  stripeCommunityAnalyticsRemovedQueue,
} from 'shared/bull/queues';

export const analyticsChanged = () =>
  listenToChangedFieldIn(db, 'analyticsEnabled')(
    'communities',
    (community: DBCommunity) => {
      if (community.analyticsEnabled) {
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
