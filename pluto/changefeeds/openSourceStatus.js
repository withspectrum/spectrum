// @flow
const debug = require('debug')('pluto:changefeeds:community');
import {
  listenToChangedFieldIn,
  listenToNewFieldIn,
} from 'shared/changefeed-utils';
import type { DBCommunity } from 'shared/types';
import { db } from 'iris/models/db';
import {
  stripeCommunityOpenSourceStatusEnabledQueue,
  stripeCommunityOpenSourceStatusDisabledQueue,
  stripeCommunityOpenSourceStatusActivatedQueue,
} from 'shared/bull/queues';

export const openSourceStatusChanged = () =>
  listenToChangedFieldIn(db, 'ossVerified')(
    'communities',
    (community: DBCommunity) => {
      debug('Open source status changed');

      if (community.ossVerified === true) {
        return stripeCommunityOpenSourceStatusEnabledQueue.add({
          communityId: community.id,
        });
      } else {
        return stripeCommunityOpenSourceStatusDisabledQueue.add({
          communityId: community.id,
        });
      }
    }
  );

export const openSourceStatusActivated = () =>
  listenToNewFieldIn(db, 'ossVerified')(
    'communities',
    (community: DBCommunity) => {
      debug('Open source status activated');
      if (community.ossVerified === true) {
        return stripeCommunityOpenSourceStatusActivatedQueue.add({
          communityId: community.id,
        });
      }
      return;
    }
  );
