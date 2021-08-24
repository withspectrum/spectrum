// @flow
import { getChannels, getChannelsThreadCounts } from '../models/channel';
import { getChannelsSettings } from '../models/channelSettings';
import createLoader from './create-loader';

export const __createChannelLoader = createLoader(channels =>
  getChannels(channels)
);

export const __createChannelThreadCountLoader = createLoader(
  channels => getChannelsThreadCounts(channels),
  'group'
);

export const __createChannelSettingsLoader = createLoader(
  channelIds => getChannelsSettings(channelIds),
  key => key.channelId
);

export default () => {
  throw new Error(
    '⚠️ Do not import loaders directly, get them from the GraphQL context instead! ⚠️'
  );
};
