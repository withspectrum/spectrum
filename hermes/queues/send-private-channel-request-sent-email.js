// @flow
const debug = require('debug')(
  'hermes:queue:send-request-join-private-channel'
);
import Raven from 'shared/raven';
import sendEmail from '../send-email';
import {
  PRIVATE_CHANNEL_REQUEST_SENT_TEMPLATE,
  SEND_PRIVATE_CHANNEL_REQUEST_SENT_EMAIL,
} from './constants';
import type {
  Job,
  SendPrivateChannelRequestEmailJobData,
} from 'shared/bull/types';

export default (
  job: Job<SendPrivateChannelRequestEmailJobData>
): Promise<void> => {
  debug(`\nnew job: ${job.id}`);
  const { user, recipient, channel, community } = job.data;
  debug(`\nsending notification to private channel owner: ${recipient.email}`);

  const subject = `${user.name} has requested to join the ${
    channel.name
  } channel in the ${community.name} community`;
  const preheader =
    'View your channel settings to approve or block this request';

  try {
    return sendEmail({
      templateId: PRIVATE_CHANNEL_REQUEST_SENT_TEMPLATE,
      to: [{ email: recipient.email }],
      dynamic_template_data: {
        subject,
        preheader,
        data: {
          user,
          recipient,
          channel,
          community,
        },
      },
    });
  } catch (err) {
    console.error('❌ Error in job:\n');
    console.error(err);
    return Raven.captureException(err);
  }
};
