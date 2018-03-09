// @flow
import type { DBCommunity } from 'shared/types';
import { getCommunitySettings } from '../../models/communitySettings';

export default async ({ id }: DBCommunity) => {
  const defaultSettings = {
    isEnabled: false,
    customMessage: null,
  };

  return await getCommunitySettings(id).then(res => {
    if (!res || res.length === 0) {
      return defaultSettings;
    }

    const settings = res[0];
    if (!settings.brandedLogin) return defaultSettings;

    return settings.brandedLogin;
  });
};
