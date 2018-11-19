// @flow
import type { DBUser } from 'shared/types';
import { getChannelsByUser } from '../../models/channel';

export default (user: DBUser) => ({
  pageInfo: {
    hasNextPage: false,
  },
  // $FlowFixMe
  edges: getChannelsByUser(user.id).then(channels =>
    // $FlowFixMe
    channels.map(channel => ({
      node: channel,
    }))
  ),
});
