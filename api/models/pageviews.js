// @flow
const { db } = require('./db');

export const addCommunityPageView = (
  communityId: string,
  referrerDomain: string
) => {
  return db
    .table('pageviews')
    .insert({
      createdAt: new Date(),
      refType: 'community',
      refId: communityId,
      referrerDomain,
    })
    .run();
};
