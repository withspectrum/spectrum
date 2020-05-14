// @flow
import type { GraphQLContext } from '../../';
import initIndex from 'shared/algolia';
const usersSearchIndex = initIndex('users');
import type { Args } from './types';

export default (args: Args, { loaders }: GraphQLContext) => {
  const { queryString, filter } = args;
  const searchFilter = filter;

  // if we are searching for community members, find *everyone*
  const hitsPerPage = searchFilter && searchFilter.communityId ? 100000 : 20;

  return usersSearchIndex
    .search({ query: queryString, hitsPerPage })
    .then(content => {
      if (!content.hits || content.hits.length === 0) return [];

      const userIds = content.hits.map(o => o.objectID);
      return loaders.user.loadMany(userIds);
    })
    .then(data => data.filter(Boolean))
    .catch(err => {
      console.error('err', err);
    });
};
