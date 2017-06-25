// @flow
const debug = require('debug')('athena:queue:slack-import');
import processQueue from '../process-queue';
import { SLACK_IMPORT } from './constants';
import {
  getSlackUserListData,
  saveSlackImportData,
} from '../models/slackImports';

export default () =>
  processQueue(SLACK_IMPORT, job => {
    const token = job.data.token;
    const importId = job.data.importId;

    debug(`new job for a slack import`);

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

        return saveSlackImportData(importId, members);
      })
      .then(() => job.remove())
      .catch(err => {
        throw new Error(err);
      });
  });
