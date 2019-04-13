// @flow
import type { DBChannelSettings } from 'shared/types';
import type { GraphQLContext } from '../../';

export default async (
  { slackSettings }: DBChannelSettings,
  _: any,
  { loaders }: GraphQLContext
) => {
  return slackSettings ? slackSettings.botLinks : null;
};
