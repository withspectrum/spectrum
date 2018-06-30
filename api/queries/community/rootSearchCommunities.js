// @flow
/*

    DEPRECATED 2/1/2018 by @brian

*/

import type { GraphQLContext } from '../../';
import initIndex from 'shared/algolia';
const communitySearchIndex = initIndex('communities');

export default (
  _: any,
  { string }: { string: string },
  { loaders }: GraphQLContext
) => {
  return communitySearchIndex
    .search({ query: string })
    .then(content => {
      if (!content.hits || content.hits.length === 0) return [];
      const communityIds = content.hits.map(o => o.objectID);
      return loaders.community.loadMany(communityIds);
    })
    .catch(err => {
      console.error('err', err);
    });
};
