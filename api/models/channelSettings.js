// @flow
const { db } = require('shared/db');
import type { DBChannelSettings } from 'shared/types';

const defaultSettings = {
  joinSettings: {
    tokenJoinEnabled: false,
    token: null,
  },
  slackSettings: {
    botLinks: {
      threadCreated: null,
    },
  },
};

// prettier-ignore
export const getOrCreateChannelSettings = async (channelId: string): Promise<DBChannelSettings> => {
  const settings = await db
    .table('channelSettings')
    .getAll(channelId, { index: 'channelId' })
    .run();

  if (!settings || settings.length === 0) {
    return await db
      .table('channelSettings')
      .insert(
        {
          ...defaultSettings,
          channelId,
        },
        { returnChanges: true }
      )
      .run()
      .then(results => results.changes[0].new_val);
  }

  return settings[0];
};

// prettier-ignore
export const getChannelsSettings = (channelIds: Array<string>): Promise<?DBChannelSettings> => {
  return db
    .table('channelSettings')
    .getAll(...channelIds, { index: 'channelId' })
    .run()
    .then(data => {
      if (!data || data.length === 0)
        return Array.from({ length: channelIds.length }, (_, index) => ({
          ...defaultSettings,
          channelId: channelIds[index],
        }));

      return data.map(
        (rec, index) =>
          rec
            ? rec
            : {
                ...defaultSettings,
                channelId: channelIds[index],
              }
      );
    });
};
