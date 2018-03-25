// @flow
const debug = require('debug')('pluto:changefeeds:community');
import {
  listenToNewDocumentsIn,
  listenToChangedFieldIn,
  listenToNewFieldIn,
  listenToDeletedDocumentsIn,
} from 'shared/changefeed-utils';
import type { DBCommunity } from 'shared/types';
import { db } from 'iris/models/db';
import {
  stripeCommunityAdministratorEmailChangedQueue,
  stripeCommunityCreatedQueue,
  stripeCommunityDeletedQueue,
  stripeCommunityEditedQueue,
} from 'shared/bull/queues';

// when a community is created, generate a new customer for that community
// we do this pre-emptively
export const communityCreated = () =>
  listenToNewDocumentsIn(db, 'communities', (community: DBCommunity) => {
    // make sure we never duplicate customers
    debug('New community created');
    return stripeCommunityCreatedQueue.add({
      communityId: community.id,
    });
  });

// keep the name of the community in sync on stripe
export const communityEdited = () =>
  listenToChangedFieldIn(db, 'name')(
    'communities',
    (community: DBCommunity) => {
      return stripeCommunityEditedQueue.add({
        communityId: community.id,
      });
    }
  );

// if a community is deleted on spectrum, deleting the customer on stripe will automatically
// close out all active subscriptions
export const communityDeleted = () =>
  listenToDeletedDocumentsIn(db, 'communities', (community: DBCommunity) => {
    debug('Community deleted');
    return stripeCommunityDeletedQueue.add({
      communityId: community.id,
    });
  });

export const communityAdministratorEmailChanged = () =>
  listenToChangedFieldIn(db, 'administratorEmail')(
    'communities',
    (community: DBCommunity) => {
      debug('Changed administratorEmail field');

      return stripeCommunityAdministratorEmailChangedQueue.add({
        communityId: community.id,
      });
    }
  );

export const communityAdministratorEmailCreated = () =>
  listenToNewFieldIn(db, 'administratorEmail')(
    'communities',
    (community: DBCommunity) => {
      debug('New administratorEmail field');

      return stripeCommunityAdministratorEmailChangedQueue.add({
        communityId: community.id,
      });
    }
  );
