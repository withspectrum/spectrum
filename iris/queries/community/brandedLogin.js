// @flow
import type { DBCommunity } from 'shared/types';
import type { GraphQLContext } from '../../';

export default ({ id }: DBCommunity, _: any, { loaders }: GraphQLContext) => {
  return loaders.communitySettings.load(id).then(res => {
    if (!res || res.length === 0) return null;
    const settings = res[0];
    if (!settings.brandedLogin) return null;
    return settings.brandedLogin;
  });
};
