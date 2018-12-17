// @flow
const debug = require('debug')('hermes:queue:send-community-invite-email');
import Raven from 'shared/raven';
import sendEmail from '../send-email';
import {
  COMMUNITY_INVITE_TEMPLATE,
  SEND_COMMUNITY_INVITE_EMAIL,
} from './constants';

type SendCommunityInviteJobData = {
  to: string,
  sender: Object,
  recipient: {
    firstName: string,
    lastName: string,
    email: string,
    userId?: string,
  },
  community: Object,
  communitySettings: Object,
  customMessage: string,
};

type SendCommunityInviteEmailJob = {
  data: SendCommunityInviteJobData,
  id: string,
};

export default (job: SendCommunityInviteEmailJob): Promise<void> => {
  debug(`\nnew job: ${job.id}`);
  debug(`\nsending community invite to: ${job.data.to}`);

  const {
    sender,
    recipient,
    community,
    communitySettings,
    customMessage,
    to,
  } = job.data;

  const subject = `${job.data.sender.name} has invited you to join the ${
    job.data.community.name
  } community on Spectrum`;

  const preheader = `Come join the conversation with ${sender.name}!`;
  const joinPath = communitySettings
    ? community.isPrivate &&
      communitySettings.joinSettings &&
      communitySettings.joinSettings.token
      ? `${community.slug}/join/${communitySettings.joinSettings.token}`
      : `${community.slug}`
    : `${community.slug}`;

  try {
    return sendEmail({
      templateId: COMMUNITY_INVITE_TEMPLATE,
      to: [{ email: to }],
      dynamic_template_data: {
        subject,
        preheader,
        sender,
        recipient,
        community,
        customMessage,
        joinPath,
      },
      userId: recipient.userId,
    });
  } catch (err) {
    console.error('❌ Error in job:\n');
    console.error(err);
    return Raven.captureException(err);
  }
};
