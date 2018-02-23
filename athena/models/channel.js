// @flow
const { db } = require('./db');
import { listenToNewDocumentsIn } from 'shared/changefeed-utils';
import { sendChannelNotificationQueue } from 'shared/bull/queues';
import type { DBChannel } from 'shared/types';

export const getChannelById = (id: string): Promise<DBChannel> => {
  return db
    .table('channels')
    .get(id)
    .run();
};

export const newChannelCreated = () =>
  listenToNewDocumentsIn(db, 'channels', (channel: DBChannel) => {
    if (channel.isPrivate) return;
    return sendChannelNotificationQueue.add({ channel });
  });
