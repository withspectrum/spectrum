// @flow
const { db } = require('./db');
import { listenToNewDocumentsIn } from 'shared/changefeed-utils';
import { athena as queues } from 'shared/bull/queues';
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
    return queues.sendChannelNotificationQueue.add({ channel });
  });
