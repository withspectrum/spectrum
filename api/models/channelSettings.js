// @flow
const { db } = require('shared/db');
import type { DBChannelSettings, DBChannel } from 'shared/types';
import { getChannelById } from './channel';
import uuidv4 from 'uuid/v4';

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

export const enableChannelTokenJoin = (channelId: string) => {
  return db
    .table('channelSettings')
    .getAll(channelId, { index: 'channelId' })
    .update({
      joinSettings: {
        tokenJoinEnabled: true,
        token: uuidv4(),
      },
    })
    .run()
    .then(async () => {
      return await getChannelById(channelId);
    });
};

export const disableChannelTokenJoin = (channelId: string) => {
  return db
    .table('channelSettings')
    .getAll(channelId, { index: 'channelId' })
    .update({
      joinSettings: {
        tokenJoinEnabled: false,
        token: null,
      },
    })
    .run()
    .then(async () => {
      return await getChannelById(channelId);
    });
};

export const resetChannelJoinToken = (channelId: string) => {
  return db
    .table('channelSettings')
    .getAll(channelId, { index: 'channelId' })
    .update({
      joinSettings: {
        token: uuidv4(),
      },
    })
    .run()
    .then(async () => {
      return await getChannelById(channelId);
    });
};

type UpdateInput = {
  channelId: string,
  slackChannelId: ?string,
  eventType: 'threadCreated',
};

// prettier-ignore
export const updateChannelSlackBotLinks = async ({ channelId, slackChannelId, eventType }: UpdateInput): Promise<DBChannel> => {
  const settings: DBChannelSettings = await getOrCreateChannelSettings(
    channelId
  );

  let newSettings;
  if (!settings.slackSettings) {
    settings.slackSettings = {
      botLinks: {
        [eventType]:
          slackChannelId && slackChannelId.length > 0 ? slackChannelId : null,
      },
    };
    newSettings = Object.assign({}, settings);
  } else {
    newSettings = Object.assign({}, settings, {
      slackSettings: {
        botLinks: {
          [eventType]:
            slackChannelId && slackChannelId.length > 0 ? slackChannelId : null,
        },
      },
    });
  }

  return db
    .table('channelSettings')
    .getAll(channelId, { index: 'channelId' })
    .update({
      ...newSettings,
    })
    .run()
    .then(async () => {
      return await getChannelById(channelId)
    });
};
