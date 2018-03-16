// @flow
import type { DBChannel } from 'shared/types';
import { getChannelSettings } from '../../models/channelSettings';

export default async ({ id }: DBChannel) => {
  return await getChannelSettings(id).then(settings => {
    return settings.joinSettings;
  });
};
