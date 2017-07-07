// @flow
const debug = require('debug')('hermes:queue:send-new-message-email');
import sendEmail from '../send-email';
import processQueue from '../../shared/bull/process-queue';
import {
  SEND_COMMUNITY_INVITE_EMAIL,
  COMMUNITY_INVITE_TEMPLATE,
} from './constants';

type SendCommunityInviteJobData = {
  to: string,
  sender: Object,
  recipient: {
    firstName: string,
    lastName: string,
    email: string,
  },
  community: Object,
};

type SendCommunityInviteEmailJob = {
  data: SendCommunityInviteJobData,
  id: string,
};

export default () =>
  processQueue(
    SEND_COMMUNITY_INVITE_EMAIL,
    (job: SendCommunityInviteEmailJob) => {
      debug(`\nnew job: ${job.id}`);
      debug(`\nsending community invite to: ${job.data.to}`);

      const sender = JSON.parse(job.data.sender.payload);
      const subject = `${sender.name} has invited you to join the ${job.data.community.name} community on Spectrum`;

      try {
        return sendEmail({
          TemplateId: COMMUNITY_INVITE_TEMPLATE,
          To: job.data.to,
          TemplateModel: {
            subject,
            sender,
            recipient: job.data.recipient,
            community: job.data.community,
          },
        });
      } catch (err) {
        console.log(err);
      }
    }
  );
