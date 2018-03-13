// @flow
import type { DBCommunity } from 'shared/types';
import { getCommunitySettings } from '../../models/communitySettings';

export default async ({ id }: DBCommunity) => {
  return await getCommunitySettings(id).then(settings => {
    return settings.brandedLogin;
  });
};
