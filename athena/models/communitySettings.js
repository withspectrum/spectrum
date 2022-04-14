// @flow
const { db } = require('shared/db');
import axios from 'axios';
const querystring = require('querystring');
import { decryptString } from 'shared/encryption';

const defaultSlackSettings = {
  connectedAt: null,
  connectedBy: null,
  teamName: null,
  teamId: null,
  scope: null,
  token: null,
  invitesSentAt: null,
  invitesMemberCount: null,
  invitesCustomMessage: null,
};

export const getCommunitySettings = (id: string) => {
  return db
    .table('communitySettings')
    .getAll(id, { index: 'communityId' })
    .run()
    .then(data => {
      if (!data || data.length === 0) return null;
      return data[0];
    });
};

export const resetCommunitySlackSettings = (id: string) => {
  return db
    .table('communitySettings')
    .getAll(id, { index: 'communityId' })
    .update({
      slackSettings: {
        ...defaultSlackSettings,
      },
    })
    .run();
};

export const updateSlackInvitesMemberCount = (id: string, count: number) => {
  return db
    .table('communitySettings')
    .getAll(id, { index: 'communityId' })
    .update({
      slackSettings: {
        invitesMemberCount: count,
      },
    })
    .run();
};

export const getSlackUserListData = (token: string, scope: string) => {
  const decryptedToken = decryptString(token);

  return axios
    .post(
      'https://slack.com/api/users.list',
      querystring.stringify({
        token: decryptedToken,
        scope: scope,
      })
    )
    .then(response => {
      // if the response is valid
      if (response.data && response.data.ok) {
        return response.data.members;
      }

      return null;
    });
};
