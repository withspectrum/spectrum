// @flow
import type { DBCommunitySettings } from 'shared/types';
import type { GraphQLContext } from '../../';
import { decrypt } from 'shared/encryption';

export default async (
  { slackSettings }: DBCommunitySettings,
  _: any,
  { loaders }: GraphQLContext
) => {
  return slackSettings && slackSettings.teamName
    ? decrypt(slackSettings.teamName)
    : null;
};
