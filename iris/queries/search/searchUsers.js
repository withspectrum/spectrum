// @flow
import type { GraphQLContext } from '../../';
import initIndex from 'shared/algolia';
const usersSearchIndex = initIndex('users');
import type { Args } from './types';

export default (args: Args, { loaders }: GraphQLContext) => {
  const { queryString } = args;
  return usersSearchIndex
    .search({ query: queryString })
    .then(content => {
      if (!content.hits || content.hits.length === 0) return [];
      const userIds = content.hits.map(o => o.objectID);
      return loaders.user.loadMany(userIds);
    })
    .then(data => data.filter(Boolean))
    .catch(err => {
      console.log('err', err);
    });
};
