// @flow
const debug = require('debug')('athena:queue:slack-import');
import Raven from '../../shared/raven';
import { isEmail } from 'validator';
import {
  getCommunitySettings,
  getSlackUserListData,
  resetCommunitySlackSettings,
  updateSlackInvitesMemberCount,
} from '../models/communitySettings';
import { getUserById } from 'shared/db/queries/user';
import { getCommunityById } from '../models/community';
import {
  sendCommunityInviteNotificationQueue,
  _adminProcessSlackImportQueue,
} from 'shared/bull/queues';
import type { Job, SendSlackInvitationsJobData } from 'shared/bull/types';

const processJob = async (job: Job<SendSlackInvitationsJobData>) => {
  const { communityId, userId } = job.data;

  debug(`sending slack invitations for ${communityId}`);

  const [settings, owner, community] = await Promise.all([
    getCommunitySettings(communityId),
    getUserById(userId),
    getCommunityById(communityId),
  ]);

  if (!settings || !settings.slackSettings) {
    debug('No settings or no slack settings found for community');
    return resetCommunitySlackSettings(communityId);
  }

  const {
    token,
    scope,
    connectedBy,
    invitesCustomMessage,
    teamName,
  } = settings.slackSettings;

  if (!token) {
    debug('No token saved for Slack import');
    return resetCommunitySlackSettings(communityId);
  }

  // Send an API request to Slack using the generated token to return an array of members
  const members = await getSlackUserListData(token, scope);

  if (!members) {
    debug('found no members in slack team');
    return resetCommunitySlackSettings(communityId);
  }

  debug('got members in slack team');
  const filteredMembers = members
    // filter out any restricted members
    .filter(member => !member.is_restricted || !member.is_ultra_restricted)
    // filter out bots
    .filter(member => !member.is_bot)
    // filter out deleted members
    .filter(member => !member.deleted)
    // only save members with valid email
    .filter(
      member =>
        member &&
        member.profile &&
        member.profile.email &&
        isEmail(member.profile.email)
    )
    // format output data
    .map(member => ({
      firstName: member.profile.first_name,
      lastName: member.profile.last_name,
      email: member.profile.email,
    }));

  if (!filteredMembers || filteredMembers.length === 0) {
    debug(`no available members to handle notifications`);
    return resetCommunitySlackSettings(communityId);
  }

  const membersCount = filteredMembers.length;

  const invitePromises = filteredMembers.map(member =>
    sendCommunityInviteNotificationQueue.add({
      recipient: {
        email: member.email,
        firstName: member.firstName ? member.firstName : null,
        lastName: member.lastName ? member.lastName : null,
      },
      communityId: communityId,
      senderId: connectedBy,
      customMessage: invitesCustomMessage,
    })
  );

  return await Promise.all([
    ...invitePromises,
    updateSlackInvitesMemberCount(communityId, membersCount),
    _adminProcessSlackImportQueue.add({
      user: owner,
      community,
      invitedCount: membersCount,
      teamName,
    }),
  ]);
};

export default async (job: Job<SendSlackInvitationsJobData>) => {
  try {
    await processJob(job);
  } catch (err) {
    console.error('❌ Error in job:\n');
    console.error(err);
    Raven.captureException(err);
  }
};
