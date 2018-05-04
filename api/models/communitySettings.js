// @flow
const { db } = require('./db');
import type { DBCommunitySettings, DBCommunity } from 'shared/types';
import { getCommunityById } from './community';
import axios from 'axios';
import { decrypt } from 'shared/encryption';

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
};

export const getCommunitySettings = (
  id: string
): Promise<DBCommunitySettings> => {
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

export const getCommunitiesSettings = (
  communityIds: Array<string>
): Promise<?DBCommunitySettings> => {
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

export const createCommunitySettings = (id: string): Promise<DBCommunity> => {
  return db
    .table('communitySettings')
    .insert({
      communityId: id,
      brandedLogin: {
        isEnabled: false,
        message: null,
      },
      slackSettings: {
        connectedAt: null,
        connectedBy: null,
        invitesSentAt: null,
        teamName: null,
        teamId: null,
        invitesMemberCount: null,
        invitesCustomMessage: null,
        scope: null,
        token: null,
      },
    })
    .run()
    .then(async () => await getCommunityById(id));
};

export const enableCommunityBrandedLogin = (
  id: string
): Promise<DBCommunity> => {
  return db
    .table('communitySettings')
    .getAll(id, { index: 'communityId' })
    .update({
      brandedLogin: {
        isEnabled: true,
      },
    })
    .run()
    .then(async () => await getCommunityById(id));
};

export const disableCommunityBrandedLogin = (
  id: string
): Promise<DBCommunity> => {
  return db
    .table('communitySettings')
    .getAll(id, { index: 'communityId' })
    .update({
      brandedLogin: {
        isEnabled: false,
      },
    })
    .run()
    .then(async () => await getCommunityById(id));
};

export const updateCommunityBrandedLoginMessage = (
  id: string,
  message: ?string
): Promise<DBCommunity> => {
  return db
    .table('communitySettings')
    .getAll(id, { index: 'communityId' })
    .update({
      brandedLogin: {
        message: message,
      },
    })
    .run()
    .then(async () => await getCommunityById(id));
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
  input: UpdateSlackSettingsInput
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
      .then(async () => await getCommunityById(communityId));
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
    .then(async () => await getCommunityById(communityId));
};

export const markInitialSlackInvitationsSent = async (
  communityId: string,
  inviteCustomMessage: ?string
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
    .then(async () => await getCommunityById(communityId));
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

export const getSlackPublicChannelList = (
  communityId: string,
  token: string
) => {
  if (!token) return [];
  const decryptedToken = decrypt(token);
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

export const getSlackPrivateChannelList = (
  communityId: string,
  token: ?string
) => {
  if (!token) return [];
  const decryptedToken = decrypt(token);
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

const handleSlackChannelResponse = async (
  data: Object,
  communityId: string
) => {
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
    return resetSlackSettings(communityId);
  }

  return [];
};
