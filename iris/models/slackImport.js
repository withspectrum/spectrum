// @flow
// $FlowFixMe
import axios from 'axios';
const querystring = require('querystring');
const { db } = require('./db');
// $FlowFixMe
const createQueue = require('../../shared/bull/create-queue');
const slackImportQueue = createQueue('slack import');
const env = require('node-env-file');
const IS_PROD = process.env.NODE_ENV === 'production';
const path = require('path');
if (!IS_PROD) {
  env(path.resolve(__dirname, '../.env'), { raise: false });
}

let SLACK_SECRET = process.env.SLACK_SECRET;
if (!IS_PROD) {
  SLACK_SECRET = SLACK_SECRET || 'asdf123';
}

export const generateOAuthToken = (code, redirect_uri) => {
  return axios
    .post(
      'https://slack.com/api/oauth.access',
      querystring.stringify({
        code: code,
        scope: 'users:read.email,users:read,admin',
        client_id: '201769987287.200380534417',
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
        };
      }
    })
    .catch(error => {
      console.log('\n\nerror', error);
      return null;
    });
};

export const createSlackImportRecord = input => {
  return db
    .table('slackImports')
    .getAll(input.communityId, { index: 'communityId' })
    .filter({ userId: input.userId })
    .run()
    .then(result => {
      // if a record already exists, return out - TODO: Figure out how we want to handle people who trigger this import flow twice, as we want to make sure we're not spamming invites
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
          const token = data.token;
          const importId = data.id;

          slackImportQueue.add({
            token,
            importId,
          });

          return data;
        });
    });
};

export const getSlackImport = communityId => {
  return db
    .table('slackImports')
    .getAll(communityId, { index: 'communityId' })
    .run()
    .then(results => {
      if (!results || results.length === 0) return null;
      return results[0];
    });
};

export const markSlackImportAsSent = communityId => {
  return db
    .table('slackImports')
    .getAll(communityId, { index: 'communityId' })
    .update(
      {
        sent: new Date(),
      },
      { returnChanges: true }
    )
    .run()
    .then(results => {
      return results.changes[0].new_val;
    });
};
