// @flow
const debug = require('debug')(
  'hermes:queue:send-request-join-private-channel'
);
import sendEmail from '../send-email';
import {
  SEND_PRIVATE_CHANNEL_REQUEST_APPROVED_EMAIL,
  PRIVATE_CHANNEL_REQUEST_APPROVED_TEMPLATE,
} from './constants';
import type {
  Job,
  SendPrivateChannelRequestApprovedEmailJobData,
} from 'shared/bull/types';

export default (job: Job<SendPrivateChannelRequestApprovedEmailJobData>) => {
  debug(`\nnew job: ${job.id}`);
  const { recipient, channel, community } = job.data;
  debug(`\nsending notification to user: ${recipient.email}`);

  const subject = `Your request to join the ${channel.name} channel in the ${
    community.name
  } community was approved!`;
  const preheader = `You can now join the conversations happening in the ${
    channel.name
  } channel!`;

  try {
    return sendEmail({
      TemplateId: PRIVATE_CHANNEL_REQUEST_APPROVED_TEMPLATE,
      To: recipient.email,
      Tag: SEND_PRIVATE_CHANNEL_REQUEST_APPROVED_EMAIL,
      TemplateModel: {
        subject,
        preheader,
        data: {
          recipient,
          channel,
          community,
        },
      },
    });
  } catch (err) {
    console.log(err);
  }
};
