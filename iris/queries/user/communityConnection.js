// @flow
import type { DBUser } from 'shared/types';
import { getCommunitiesByUser } from '../../models/community';

export default (user: DBUser) => ({
  // Don't paginate communities and channels of a user
  pageInfo: {
    hasNextPage: false,
  },
  edges: getCommunitiesByUser(user.id).then(communities =>
    communities.map(community => ({
      node: {
        ...community,
      },
    }))
  ),
});
