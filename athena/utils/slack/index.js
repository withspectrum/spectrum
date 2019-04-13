// @flow
import { resetCommunitySlackSettings } from '../../models/communitySettings';
import { trackQueue } from 'shared/bull/queues';
import { events } from 'shared/analytics';

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
    trackQueue.add({
      userId: 'ADMIN',
      event: events.COMMUNITY_SLACK_TEAM_RESET,
      context: { communityId },
      properties: {
        error: data.error
      }
    })

    return await resetCommunitySlackSettings(communityId);
  }

  return null;
};
