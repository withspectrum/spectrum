// @flow
import { resetCommunitySlackSettings } from '../../models/communitySettings';

// prettier-ignore
export const handleSlackChannelResponse = async (data: Object, communityId: string) => {
  const errorsToTriggerRest = [
    'token_revoked',
    'not_authed',
    'invalid_auth',
    'account_inactive',
    'no_permission',
  ];

  if (data.error && errorsToTriggerRest.indexOf(data.error) >= 0) {
    return await resetCommunitySlackSettings(communityId);
  }

  return null;
};
