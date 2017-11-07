// @flow
const { db } = require('./db');
import axios from 'axios';
const querystring = require('querystring');

export const getSlackUserListData = (token: string) => {
  return axios
    .post(
      'https://slack.com/api/users.list',
      querystring.stringify({
        token: token,
        scope: 'users:read.email,users:read, admin',
      })
    )
    .then(response => {
      // if the response is valid
      if (response.data && response.data.ok) {
        return response.data.members;
      }

      return;
    })
    .catch(error => {
      console.log('\n\nerror', error);
      return null;
    });
};

export const saveSlackImportData = (
  importId: string,
  members: Array<Object>
): Promise<Array<string>> => {
  return db
    .table('slackImports')
    .get(importId)
    .update({ members })
    .run();
};
