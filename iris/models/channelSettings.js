// @flow
const { db } = require('./db');
import type { DBChannelSettings } from 'shared/types';
import { getChannelById } from './channel';
import shortid from 'shortid';

const defaultSettings = {
  joinSettings: {
    tokenJoinEnabled: false,
    message: null,
  },
};

export const getChannelSettings = (id: string) => {
  return db
    .table('channelSettings')
    .getAll(id, { index: 'channelId' })
    .run()
    .then(data => {
      if (!data || data.length === 0) {
        return defaultSettings;
      }
      return data[0];
    });
};

export const getChannelsSettings = (
  channelIds: Array<string>
): Promise<?DBChannelSettings> => {
  return db
    .table('channelSettings')
    .getAll(...channelIds, { index: 'channelId' })
    .group('channelId')
    .run();
};

export const createChannelSettings = (id: string) => {
  return db
    .table('channelSettings')
    .insert({
      channelId: id,
      joinSettings: {
        token: null,
        tokenJoinEnabled: false,
      },
    })
    .run()
    .then(async () => await getChannelById(id));
};

export const enableChannelTokenJoin = (id: string) => {
  return db
    .table('channelSettings')
    .getAll(id, { index: 'channelId' })
    .update({
      joinSettings: {
        tokenJoinEnabled: true,
        token: shortid.generate(),
      },
    })
    .run()
    .then(async () => await getChannelById(id));
};

export const disableChannelTokenJoin = (id: string) => {
  return db
    .table('channelSettings')
    .getAll(id, { index: 'channelId' })
    .update({
      joinSettings: {
        tokenJoinEnabled: false,
        token: null,
      },
    })
    .run()
    .then(async () => await getChannelById(id));
};

export const resetChannelJoinToken = (id: string) => {
  return db
    .table('channelSettings')
    .getAll(id, { index: 'channelId' })
    .update({
      joinSettings: {
        token: shortid.generate(),
      },
    })
    .run()
    .then(async () => await getChannelById(id));
};
