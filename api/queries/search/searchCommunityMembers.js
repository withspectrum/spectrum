// @flow
import type { GraphQLContext } from '../../';
import initIndex from 'shared/algolia';
const usersSearchIndex = initIndex('users');
import type { Args } from './types';
import { trackQueue } from 'shared/bull/queues';
import { events } from 'shared/analytics';

export default (args: Args, { loaders, user }: GraphQLContext) => {
  const { queryString, filter } = args;
  const searchFilter = filter;

  // if we are searching for community members, find *everyone*
  const hitsPerPage = searchFilter && searchFilter.communityId ? 100000 : 20;

  return usersSearchIndex
    .search({ query: queryString, hitsPerPage })
    .then(content => {
      if (user && user.id) {
        trackQueue.add({
          userId: user.id,
          event: events.SEARCHED_COMMUNITY_MEMBERS,
          properties: {
            queryString,
            hitsCount: content.hits ? content.hits.length : 0,
          },
        });
      }

      if (!content.hits || content.hits.length === 0) return [];
      // if no search filter was passed, there's no way to be searching for
      // community members
      if (searchFilter && !searchFilter.communityId) return [];
      const userIds = content.hits.map(o => o.objectID);
      const input = userIds.map(userId => {
        if (!searchFilter || !searchFilter.communityId) return;
        return [userId, searchFilter.communityId];
      });
      return loaders.userPermissionsInCommunity.loadMany(input);
    })
    .then(results =>
      results.filter(
        user => (user && user.isMember) || (user && user.isBlocked)
      )
    )
    .then(data => data.filter(Boolean))
    .catch(err => {
      console.error('err', err);
    });
};
