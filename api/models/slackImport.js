// @flow
require('now-env');
import axios from 'axios';
const querystring = require('querystring');
const { db } = require('shared/db');

let SLACK_SECRET = process.env.SLACK_SECRET;
if (!SLACK_SECRET) {
  SLACK_SECRET = process.env.SLACK_SECRET_DEVELOPMENT || 'asdf123';
}

type SlackData = {
  access_token: string,
  team_id: string,
  team_name: string,
  scope: string,
};

// prettier-ignore
export const generateOAuthToken = (code: string, redirect_uri: string): Promise<?SlackData> => {
  return axios
    .post(
      'https://slack.com/api/oauth.access',
      querystring.stringify({
        code: code,
        scope:
          'users:read.email,users:read,chat:write,bot,chat:write:bot,channels:read,groups:read',
        client_id: '201769987287.271382863153',
        client_secret: SLACK_SECRET,
        redirect_uri,
      })
    )
    .then(response => {
      // if the response is valid
      if (response.data && response.data.ok) {
        return {
          access_token: response.data.access_token,
          team_id: response.data.team_id,
          team_name: response.data.team_name,
          scope: response.data.scope,
        };
      }
    })
    .catch(error => {
      console.error('\n\nerror', error);
      return null;
    });
};

type CreateSlackImportType = {
  token: string,
  teamName: string,
  teamId: string,
  senderId: string,
  communityId: string,
};
export const createSlackImportRecord = (input: CreateSlackImportType) => {
  return db
    .table('slackImports')
    .getAll(input.communityId, { index: 'communityId' })
    .filter({ userId: input.senderId })
    .run()
    .then(result => {
      // if a record already exists, return out
      if (result && result.length > 0) return;

      // if no result is found, we can create a new record
      return db
        .table('slackImports')
        .insert(
          {
            ...input,
            members: null,
          },
          { returnChanges: true }
        )
        .run()
        .then(result => {
          // kick off a queue worker to get the member data from slack
          const data = result.changes[0].new_val;
          return data;
        });
    });
};

export const getSlackImport = (communityId: string) => {
  return db
    .table('slackImports')
    .getAll(communityId, { index: 'communityId' })
    .run()
    .then(results => {
      if (!results || results.length === 0) return null;
      return results[0];
    });
};
