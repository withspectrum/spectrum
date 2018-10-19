// @flow
const { db } = require('./db');
import type { DBCommunitySettings, DBCommunity } from 'shared/types';
import { getCommunityById } from './community';
import shortid from 'shortid';
import axios from 'axios';
import { decryptString } from 'shared/encryption';
import { trackQueue } from 'shared/bull/queues';
import { events } from 'shared/analytics';

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

// prettier-ignore
export const createCommunitySettings = (communityId: string): Promise<DBCommunity> => {
  return db
    .table('communitySettings')
    .insert({
      communityId,
      ...defaultSettings
    })
    .run()
    .then(async () => await getCommunityById(communityId));
};

// prettier-ignore
export const enableCommunityBrandedLogin = (communityId: string, userId: string): Promise<DBCommunity> => {
  return db
    .table('communitySettings')
    .getAll(communityId, { index: 'communityId' })
    .update({
      brandedLogin: {
        isEnabled: true,
      },
    })
    .run()
    .then(async () => {
      trackQueue.add({
        userId,
        event: events.COMMUNITY_BRANDED_LOGIN_ENABLED,
        context: { communityId }
      })
      return await getCommunityById(communityId)
    });
};

// prettier-ignore
export const disableCommunityBrandedLogin = (communityId: string, userId: string): Promise<DBCommunity> => {
  return db
    .table('communitySettings')
    .getAll(communityId, { index: 'communityId' })
    .update({
      brandedLogin: {
        isEnabled: false,
      },
    })
    .run()
    .then(async () => {
      trackQueue.add({
        userId,
        event: events.COMMUNITY_BRANDED_LOGIN_DISABLED,
        context: { communityId }
      })
      return await getCommunityById(communityId)
    });
};

// prettier-ignore
export const updateCommunityBrandedLoginMessage = (communityId: string, message: ?string, userId: string): Promise<DBCommunity> => {
  return db
    .table('communitySettings')
    .getAll(communityId, { index: 'communityId' })
    .update({
      brandedLogin: {
        message: message,
      },
    })
    .run()
    .then(async () => {
      trackQueue.add({
        userId,
        event: events.COMMUNITY_BRANDED_LOGIN_SETTINGS_SAVED,
        context: { communityId }
      })
      return await getCommunityById(communityId)
    });
};

type UpdateSlackSettingsInput = {
  token: string,
  teamName: string,
  teamId: string,
  connectedBy: string,
  scope: string,
};
export const updateSlackSettingsAfterConnection = async (
  communityId: string,
  input: UpdateSlackSettingsInput,
  userId: string
): Promise<DBCommunity> => {
  const settings = await db
    .table('communitySettings')
    .getAll(communityId, { index: 'communityId' })
    .run();

  if (!settings || settings.length === 0) {
    return await createCommunitySettings(communityId)
      .then(() => {
        return db
          .table('communitySettings')
          .getAll(communityId, { index: 'communityId' })
          .update({
            slackSettings: {
              ...defaultSettings.slackSettings,
              ...input,
              connectedAt: new Date(),
            },
          })
          .run();
      })
      .then(async () => {
        trackQueue.add({
          userId,
          event: events.COMMUNITY_SLACK_TEAM_CONNECTED,
          context: { communityId },
        });

        return await getCommunityById(communityId);
      });
  }

  return await db
    .table('communitySettings')
    .getAll(communityId, { index: 'communityId' })
    .update({
      slackSettings: {
        ...defaultSettings.slackSettings,
        ...input,
        connectedAt: new Date(),
      },
    })
    .run()
    .then(async () => {
      trackQueue.add({
        userId,
        event: events.COMMUNITY_SLACK_TEAM_CONNECTED,
        context: { communityId },
      });

      return await getCommunityById(communityId);
    });
};

export const markInitialSlackInvitationsSent = async (
  communityId: string,
  inviteCustomMessage: ?string,
  userId: string
): Promise<DBCommunity> => {
  return db
    .table('communitySettings')
    .getAll(communityId, { index: 'communityId' })
    .update({
      slackSettings: {
        invitesSentAt: new Date(),
        invitesCustomMessage: inviteCustomMessage,
      },
    })
    .run()
    .then(async () => {
      trackQueue.add({
        userId,
        event: events.COMMUNITY_SLACK_TEAM_INVITES_SENT,
        context: { communityId },
      });

      return await getCommunityById(communityId);
    });
};

const resetSlackSettings = async (communityId: string) => {
  return db
    .table('communitySettings')
    .getAll(communityId, { index: 'communityId' })
    .update({
      slackSettings: {
        ...defaultSettings.slackSettings,
      },
    })
    .run()
    .then(() => []);
};

// prettier-ignore
export const getSlackPublicChannelList = (communityId: string, token: string) => {
  if (!token) return [];
  const decryptedToken = decryptString(token);

  return axios
    .get(
      `https://slack.com/api/channels.list?token=${decryptedToken}&exclude_archived=true&exclude_members=true`
    )
    .then(response => {
      return handleSlackChannelResponse(response.data, communityId);
    })
    .catch(error => {
      console.error('\n\nerror', error);
      return [];
    });
};

// prettier-ignore
export const getSlackPrivateChannelList = (communityId: string, token: ?string) => {
  if (!token) return [];
  const decryptedToken = decryptString(token);

  return axios
    .get(
      `https://slack.com/api/groups.list?token=${decryptedToken}&exclude_archived=true&exclude_members=true`
    )
    .then(response => {
      return handleSlackChannelResponse(response.data, communityId);
    })
    .catch(error => {
      console.error('\n\nerror', error);
      return [];
    });
};

// prettier-ignore
const handleSlackChannelResponse = async (data: Object, communityId: string) => {
  const mapData = (arr: Array<any>) =>
    arr &&
    arr.length > 0 &&
    arr.map(
      o =>
        o && {
          id: o.id,
          name: o.name,
        }
    );

  if (data && data.ok) {
    if (data.groups) {
      return mapData(data.groups) || [];
    }

    if (data.channels) {
      return mapData(data.channels) || [];
    }
  }

  const errorsToTriggerRest = [
    'token_revoked',
    'not_authed',
    'invalid_auth',
    'account_inactive',
    'no_permission',
  ];

  if (data.error && errorsToTriggerRest.indexOf(data.error) >= 0) {
    trackQueue.add({
      userId: 'ADMIN',
      event: events.COMMUNITY_SLACK_TEAM_RESET,
      context: { communityId },
      properties: {
        error: data.error
      }
    })
    
    return resetSlackSettings(communityId);
  }

  return [];
};

export const enableCommunityTokenJoin = (
  communityId: string,
  userId: string
) => {
  return db
    .table('communitySettings')
    .getAll(communityId, { index: 'communityId' })
    .update({
      joinSettings: {
        tokenJoinEnabled: true,
        token: shortid.generate(),
      },
    })
    .run()
    .then(async () => {
      trackQueue.add({
        userId,
        event: events.COMMUNITY_JOIN_TOKEN_ENABLED,
        context: { communityId },
      });

      return await getCommunityById(communityId);
    });
};

export const disableCommunityTokenJoin = (
  communityId: string,
  userId: string
) => {
  return db
    .table('communitySettings')
    .getAll(communityId, { index: 'communityId' })
    .update({
      joinSettings: {
        tokenJoinEnabled: false,
        token: null,
      },
    })
    .run()
    .then(async () => {
      trackQueue.add({
        userId,
        event: events.COMMUNITY_JOIN_TOKEN_DISABLED,
        context: { communityId },
      });

      return await getCommunityById(communityId);
    });
};

export const resetCommunityJoinToken = (
  communityId: string,
  userId: string
) => {
  return db
    .table('communitySettings')
    .getAll(communityId, { index: 'communityId' })
    .update({
      joinSettings: {
        token: shortid.generate(),
      },
    })
    .run()
    .then(async () => {
      trackQueue.add({
        userId,
        event: events.COMMUNITY_JOIN_TOKEN_RESET,
        context: { communityId },
      });

      return await getCommunityById(communityId);
    });
};
