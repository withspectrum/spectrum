// @flow
const debug = require('debug')('chronos:queue:process-daily-new-contributors');
import Raven from 'shared/raven';
import { getContributorStats } from 'shared/githubIntegration';
import {
  getUserWhoIsNotContributorByGithubProviderId,
  updateUserContributionInfo,
} from '../models/users';

/*
	Daily check if we have some spectrum.chat users who are also contributors to
	our repository. 
	If we do have - then we want to set their isContributor flag.
*/
export default async () => {
  debug('\nProcessing daily new contributors to Spectrum repository');
  try {
    // we just need an authors from response
    const contributorsInfo = await getContributorStats();
    const contributors = contributorsInfo.map(
      contributorInfo => contributorInfo.author
    );

    for (let i = 0; i < contributors.length; i++) {
      const contributor = contributors[i];
      const user = await getUserWhoIsNotContributorByGithubProviderId(
        `${contributor.id}`
      );
      if (user) {
        debug(
          `New contributor: ${user.username} with github user name ${
            user.githubUsername
          }`
        );
        await updateUserContributionInfo(user.id, true);
        Raven.captureMessage('New contributor', {
          level: 'info',
          extra: {
            username: user.username,
            githubUsername: user.githubUsername,
          },
        });
      }
    }
  } catch (err) {
    debug('❌ Error in processing daily new contributors job\n');
    debug(err);
    Raven.captureException(err);
  }
};
