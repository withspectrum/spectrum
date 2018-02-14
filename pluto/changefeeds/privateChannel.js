// @flow
const debug = require('debug')('pluto:changefeeds:private-channel');
import {
  listenToNewDocumentsIn,
  listenToChangedFieldIn,
  listenToDeletedDocumentsIn,
} from 'shared/changefeed-utils';
import type { DBChannel } from 'shared/types';
import { db } from '../models/db';
import {
  stripeCommunityPrivateChannelAddedQueue,
  stripeCommunityPrivateChannelRemovedQueue,
} from 'shared/bull/queues';

export const privateChannelCreated = () =>
  listenToNewDocumentsIn(db, 'channels', (channel: DBChannel) => {
    if (channel.isPrivate) {
      debug(`Private channel ${channel.name} created`);
      return stripeCommunityPrivateChannelAddedQueue.add({
        communityId: channel.communityId,
      });
    }

    return;
  });

export const privateChannelDeleted = () =>
  listenToDeletedDocumentsIn(db, 'channels', (channel: DBChannel) => {
    if (channel.isPrivate) {
      debug(`Private channel ${channel.name} deleted`);
      return stripeCommunityPrivateChannelRemovedQueue.add({
        communityId: channel.communityId,
      });
    }

    return;
  });

export const privateChannelArchived = () =>
  listenToChangedFieldIn(db, 'archivedAt')('channels', (channel: DBChannel) => {
    // a private channel was archived
    if (channel.isPrivate && channel.archivedAt) {
      debug(`Private channel ${channel.name} archived`);
      return stripeCommunityPrivateChannelRemovedQueue.add({
        communityId: channel.communityId,
      });
    }

    // a private channel was archived
    if (channel.isPrivate && !channel.archivedAt) {
      debug(`Private channel ${channel.name} unarchived`);
      return stripeCommunityPrivateChannelAddedQueue.add({
        communityId: channel.communityId,
      });
    }

    return;
  });

export const channelPrivacyChanged = () =>
  listenToChangedFieldIn(db, 'isPrivate')('channels', (channel: DBChannel) => {
    // an existing channel went from public to private
    if (channel.isPrivate) {
      debug(`Channel ${channel.name} went from public to private`);
      return stripeCommunityPrivateChannelAddedQueue.add({
        communityId: channel.communityId,
      });
    } else {
      debug(`Channel ${channel.name} went from private to public`);
      // an existing channel went from private to public
      return stripeCommunityPrivateChannelRemovedQueue.add({
        communityId: channel.communityId,
      });
    }
  });
