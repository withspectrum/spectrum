// @flow
const debug = require('debug')('pluto:changefeeds:moderator');
import { listenToChangedFieldIn } from 'shared/changefeed-utils';
import type { DBUsersCommunities } from 'shared/types';
import { db } from 'api/models/db';
import {
  stripeCommunityModeratorAddedQueue,
  stripeCommunityModeratorRemovedQueue,
} from 'shared/bull/queues';

export const moderatorChanged = () =>
  listenToChangedFieldIn(db, 'isModerator')(
    'usersCommunities',
    (usersCommunity: DBUsersCommunities) => {
      // a user was made moderator in a community
      if (usersCommunity.isModerator) {
        debug(`Moderator added in ${usersCommunity.communityId}`);
        return stripeCommunityModeratorAddedQueue.add({
          communityId: usersCommunity.communityId,
        });
      } else {
        // a user was removed as a moderator in a community
        debug(`Moderator removed in ${usersCommunity.communityId}`);
        return stripeCommunityModeratorRemovedQueue.add({
          communityId: usersCommunity.communityId,
        });
      }
    }
  );
