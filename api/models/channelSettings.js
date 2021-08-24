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
