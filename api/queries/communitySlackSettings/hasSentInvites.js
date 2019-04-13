// @flow
import type { DBCommunitySettings } from 'shared/types';
import type { GraphQLContext } from '../../';

export default async (
  { slackSettings }: DBCommunitySettings,
  _: any,
  { loaders }: GraphQLContext
) => {
  return slackSettings ? (slackSettings.invitesSentAt ? true : false) : false;
};
