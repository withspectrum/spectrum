// @flow
import type { DBCommunity } from 'shared/types';
import { getChannelsByCommunity } from '../../models/channel';

export default ({ id }: DBCommunity) => ({
  pageInfo: {
    hasNextPage: false,
  },
  edges: getChannelsByCommunity(id).then(channels =>
    channels.map(channel => ({
      node: channel,
    }))
  ),
});
