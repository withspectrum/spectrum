// @flow
/*

    DEPRECATED 2/1/2018 by @brian

*/
import type { GraphQLContext } from '../../';
import initIndex from 'shared/algolia';
const usersSearchIndex = initIndex('users');

export default (
  _: any,
  { string }: { string: string },
  { loaders }: GraphQLContext
) => {
  return usersSearchIndex
    .search({ query: string })
    .then(content => {
      if (!content.hits || content.hits.length === 0) return [];
      const userIds = content.hits.map(o => o.objectID);
      return loaders.user.loadMany(userIds);
    })
    .catch(err => {
      console.error('err', err);
    });
};
