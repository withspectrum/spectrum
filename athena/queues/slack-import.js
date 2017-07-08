// @flow
const debug = require('debug')('athena:queue:slack-import');
import processQueue from '../../shared/bull/process-queue';
import createQueue from '../../shared/bull/create-queue';
import { SLACK_IMPORT } from './constants';
import {
  getSlackUserListData,
  saveSlackImportData,
} from '../models/slackImports';

/*
  Receives a token from Iris which will be used to fetch the user list from a slack team.
  That list will then get filtered to remove bots, banned users, etc. and result in writing
  a members array back to the slackInvite record in the db
*/
export default () =>
  processQueue(SLACK_IMPORT, job => {
    const token = job.data.token;
    const importId = job.data.importId;

    debug(`new job for a slack import`);

    // Send an API request to Slack using the generated token to return an array of members
    return getSlackUserListData(token)
      .then(results => {
        debug(`got data from Slack`);

        const members = results
          // filter out any restricted members
          .filter(
            member => !member.is_restricted || !member.is_ultra_restricted
          )
          // filter out bots
          .filter(member => !member.is_bot)
          // filter out deleted members
          .filter(member => !member.deleted)
          .map(member => {
            return {
              firstName: member.profile.first_name,
              lastName: member.profile.last_name,
              email: member.profile.email,
            };
          });

        // save the members back to the slackImport record in the db
        return saveSlackImportData(importId, members);
      })
      .then(() => job.remove())
      .catch(err => {
        throw new Error(err);
      });
  });
