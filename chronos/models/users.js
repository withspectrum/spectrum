// @flow
const { db } = require('./db');

export const getUserWhoIsNotContributorByGithubProviderId = async (
  githubUserId: string
) => {
  return await db
    .table('users')
    .getAll(githubUserId, { index: 'githubProviderId' })
    .filter(user => user('isContributor').eq(false))
    .run()
    .then(results => (results.length > 0 ? results[0] : null));
};

export const updateUserContributionInfo = async (
  userId: string,
  isContributor: boolean
) => {
  return await db
    .table('users')
    .get(userId)
    .update({
      isContributor,
    })
    .run();
};
