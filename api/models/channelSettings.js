// @flow
const { db } = require('./db');
import type { DBChannelSettings, DBChannel } from 'shared/types';
import { getChannelById } from './channel';
import shortid from 'shortid';

const defaultSettings = {
  joinSettings: {
    tokenJoinEnabled: false,
    message: null,
  },
  slackSettings: {
    botConnection: {
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

type UpdateInput = {
  channelId: string,
  slackChannelId: ?string,
  eventType: 'threadCreated',
};

// prettier-ignore
export const updateChannelSlackBotConnection = async ({ channelId, slackChannelId, eventType }: UpdateInput): Promise<DBChannel> => {
  const settings: DBChannelSettings = await getOrCreateChannelSettings(
    channelId
  );

  let newSettings;
  if (!settings.slackSettings) {
    settings.slackSettings = {
      botConnection: {
        [eventType]:
          slackChannelId && slackChannelId.length > 0 ? slackChannelId : null,
      },
    };
    newSettings = Object.assign({}, settings);
  } else {
    newSettings = Object.assign({}, settings, {
      slackSettings: {
        botConnection: {
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
    .then(() => getChannelById(channelId));
};
