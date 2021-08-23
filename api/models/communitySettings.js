// @flow
const { db } = require('shared/db');
import type { DBCommunitySettings } from 'shared/types';

const defaultSettings = {
  brandedLogin: {
    isEnabled: false,
    message: null,
  },
  slackSettings: {
    connectedAt: null,
    connectedBy: null,
    teamName: null,
    teamId: null,
    scope: null,
    token: null,
    invitesSentAt: null,
    invitesMemberCount: null,
    invitesCustomMessage: null,
  },
  joinSettings: {
    tokenJoinEnabled: false,
    token: null,
  },
};

// prettier-ignore
export const getOrCreateCommunitySettings = async (communityId: string): Promise<DBCommunitySettings> => {
  const settings = await db
    .table('communitySettings')
    .getAll(communityId, { index: 'communityId' })
    .run();

  if (!settings || settings.length === 0) {
    return await db
      .table('communitySettings')
      .insert(
        {
          ...defaultSettings,
          communityId,
        },
        { returnChanges: true }
      )
      .run()
      .then(results => results.changes[0].new_val);
  }

  return settings[0];
};

// prettier-ignore
export const getCommunitySettings = (id: string): Promise<DBCommunitySettings> => {
  return db
    .table('communitySettings')
    .getAll(id, { index: 'communityId' })
    .run()
    .then(data => {
      if (!data || data.length === 0) {
        return defaultSettings;
      }
      return data[0];
    });
};

// prettier-ignore
export const getCommunitiesSettings = (communityIds: Array<string>): Promise<?DBCommunitySettings> => {
  return db
    .table('communitySettings')
    .getAll(...communityIds, { index: 'communityId' })
    .run()
    .then(data => {
      if (!data || data.length === 0) {
        return Array.from({ length: communityIds.length }, (_, index) => ({
          ...defaultSettings,
          communityId: communityIds[index],
        }));
      }

      if (data.length === communityIds.length) {
        return data.map(
          (rec, index) =>
            rec
              ? rec
              : {
                  ...defaultSettings,
                  communityId: communityIds[index],
                }
        );
      }

      if (data.length < communityIds.length) {
        return communityIds.map(communityId => {
          const record = data.find(o => o.communityId === communityId);
          if (record) return record;
          return {
            ...defaultSettings,
            communityId,
          };
        });
      }

      if (data.length > communityIds.length) {
        return communityIds.map(communityId => {
          const record = data.find(o => o.communityId === communityId);
          if (record) return record;
          return {
            ...defaultSettings,
            communityId,
          };
        });
      }
    });
};
