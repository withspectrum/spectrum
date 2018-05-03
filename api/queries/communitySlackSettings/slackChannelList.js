// @flow
import type { DBCommunitySettings } from 'shared/types';
import type { GraphQLContext } from '../../';
import {
  getSlackPublicChannelList,
  getSlackPrivateChannelList,
} from '../../models/communitySettings';

export default async (
  { slackSettings, communityId }: DBCommunitySettings,
  _: any,
  { loaders }: GraphQLContext
) => {
  if (!slackSettings || !slackSettings.token) return [];

  const [publicChannelList, privateChannelList] = await Promise.all([
    getSlackPublicChannelList(communityId, slackSettings.token),
    getSlackPrivateChannelList(communityId, slackSettings.token),
  ]);

  return [...publicChannelList, ...privateChannelList];
};
