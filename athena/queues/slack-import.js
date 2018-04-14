// @flow
const debug = require('debug')('athena:queue:slack-import');
import Raven from '../../shared/raven';
import {
  getSlackUserListData,
  saveSlackImportData,
} from '../models/slackImports';

/*
	Receives a token from API which will be used to fetch the user list from a slack team.
	That list will then get filtered to remove bots, banned users, etc. and result in writing
	a members array back to the slackInvite record in the db
*/
type JobData = {
  data: {
    token: string,
    importId: string,
  },
};
export default (job: JobData) => {
  const { token, importId } = job.data;

  debug('new job for a slack import');

  // Send an API request to Slack using the generated token to return an array of members
  return getSlackUserListData(token)
    .then(results => {
      debug('got data from Slack');
      if (!results) return;

      const members = results
        // filter out any restricted members
        .filter(member => !member.is_restricted || !member.is_ultra_restricted)
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
    .catch(err => {
      debug('❌ Error in job:\n');
      debug(err);
      Raven.captureException(err);
    });
};
