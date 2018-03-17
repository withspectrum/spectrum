// @flow
import { getChannelSettings } from '../../models/channelSettings';
import type { DBChannel } from 'shared/types';
import type { GraphQLContext } from '../../';

export default async ({ id }: DBChannel, _: any) => {
  return getChannelSettings(id).then(settings => {
    return settings.joinSettings;
  });
};
