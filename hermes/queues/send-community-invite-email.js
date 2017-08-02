// @flow
const debug = require('debug')('hermes:queue:send-new-message-email');
import sendEmail from '../send-email';
import { COMMUNITY_INVITE_TEMPLATE } from './constants';

type SendCommunityInviteJobData = {
  to: string,
  sender: Object,
  recipient: {
    firstName: string,
    lastName: string,
    email: string,
  },
  community: Object,
  customMessage: string,
};

type SendCommunityInviteEmailJob = {
  data: SendCommunityInviteJobData,
  id: string,
};

export default (job: SendCommunityInviteEmailJob) => {
  debug(`\nnew job: ${job.id}`);
  debug(`\nsending community invite to: ${job.data.to}`);
  const subject = `${job.data.sender.name} has invited you to join the ${job
    .data.community.name} community on Spectrum`;

  try {
    return sendEmail({
      TemplateId: COMMUNITY_INVITE_TEMPLATE,
      To: job.data.to,
      TemplateModel: {
        subject,
        sender: job.data.sender,
        recipient: job.data.recipient,
        community: job.data.community,
        customMessage: job.data.customMessage,
      },
    });
  } catch (err) {
    console.log(err);
  }
};
