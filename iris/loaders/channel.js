// @flow
import {
  getChannels,
  getChannelsThreadCounts,
  getChannelsMemberCounts,
} from '../models/channel';
import createLoader from './create-loader';
import { getPendingUsersInChannels } from '../models/usersChannels';
import type { Loader } from './types';

export const __createChannelLoader = createLoader(channels =>
  getChannels(channels)
);

export const __createChannelThreadCountLoader = createLoader(
  channels => getChannelsThreadCounts(channels),
  { indexField: 'group' }
);

export const __createChannelMemberCountLoader = createLoader(
  channels => getChannelsMemberCounts(channels),
  { indexField: 'group' }
);

export const __createChannelPendingMembersLoader = createLoader(
  channels => getPendingUsersInChannels(channels),
  { indexField: 'group' }
);

export default () => {
  throw new Error(
    '⚠️ Do not import loaders directly, get them from the GraphQL context instead! ⚠️'
  );
};
