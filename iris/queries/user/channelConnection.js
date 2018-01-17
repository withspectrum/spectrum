// @flow
import type { DBUser } from 'shared/types';
import { getChannelsByUser } from '../../models/channel';

export default (user: DBUser) => ({
  pageInfo: {
    hasNextPage: false,
  },
  edges: getChannelsByUser(user.id).then(channels =>
    channels.map(channel => ({
      node: channel,
    }))
  ),
});
