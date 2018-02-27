// @flow
import {
  getChannels,
  getChannelsThreadCounts,
  getChannelsMemberCounts,
} from '../models/channel';
import createLoader from './create-loader';
import { getPendingUsersInChannels } from '../models/usersChannels';
import type { Loader } from './types';

const THIRTY_MINUTES = 1800000;

export const __createChannelLoader = createLoader(channels =>
  getChannels(channels)
);

export const __createChannelThreadCountLoader = createLoader(
  channels => getChannelsThreadCounts(channels),
  { getKeyFromResult: 'group', cacheExpiryTime: THIRTY_MINUTES }
);

export const __createChannelMemberCountLoader = createLoader(
  channels => getChannelsMemberCounts(channels),
  { getKeyFromResult: 'group', cacheExpiryTime: THIRTY_MINUTES }
);

export const __createChannelPendingMembersLoader = createLoader(
  channels => getPendingUsersInChannels(channels),
  { getKeyFromResult: 'group' }
);

export default () => {
  throw new Error(
    '⚠️ Do not import loaders directly, get them from the GraphQL context instead! ⚠️'
  );
};
