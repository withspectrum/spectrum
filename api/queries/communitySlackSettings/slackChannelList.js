// @flow
import type { DBCommunitySettings } from 'shared/types';
import type { GraphQLContext } from '../../';
import { getSlackChannelList } from '../../models/communitySettings';

export default async (
  { slackSettings, communityId }: DBCommunitySettings,
  _: any,
  { loaders }: GraphQLContext
) => {
  return slackSettings && slackSettings.token
    ? await getSlackChannelList(communityId, slackSettings.token)
    : [];
};
