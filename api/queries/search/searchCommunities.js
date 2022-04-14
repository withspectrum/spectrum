// @flow
import type { GraphQLContext } from '../../';
import initIndex from 'shared/algolia';
const communitySearchIndex = initIndex('communities');
import type { Args } from './types';

export default (args: Args, { loaders }: GraphQLContext) => {
  const { queryString } = args;

  return communitySearchIndex
    .search({ query: queryString })
    .then(content => {
      if (!content.hits || content.hits.length === 0) return [];
      const communityIds = content.hits.map(o => o.objectID);
      return loaders.community.loadMany(communityIds);
    })
    .then(data => data.filter(Boolean))
    .then(data => data.filter(community => !community.isPrivate))
    .catch(err => {
      console.error('err', err);
    });
};
