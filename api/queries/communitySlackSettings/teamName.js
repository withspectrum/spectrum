// @flow
import type { DBCommunitySettings } from 'shared/types';
import type { GraphQLContext } from '../../';
import { decryptString } from 'shared/encryption';

export default async (
  { slackSettings }: DBCommunitySettings,
  _: any,
  { loaders }: GraphQLContext
) => {
  return slackSettings && slackSettings.teamName
    ? decryptString(slackSettings.teamName)
    : null;
};
