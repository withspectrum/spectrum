// @flow
const debug = require('debug')(
  'hermes:queue:send-request-join-private-channel'
);
import sendEmail from '../send-email';
import {
  PRIVATE_CHANNEL_REQUEST_SENT_TEMPLATE,
  SEND_PRIVATE_CHANNEL_REQUEST_SENT_EMAIL,
} from './constants';

type JobData = {
  recipient: {
    email: string,
  },
  user: {
    username: string,
    name: string,
  },
  channel: {
    name: string,
    slug: string,
  },
  community: {
    name: string,
    slug: string,
  },
};

type SendRequestPrivateChannelEmail = {
  data: JobData,
  id: string,
};

export default (job: SendRequestPrivateChannelEmail) => {
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
      TemplateId: PRIVATE_CHANNEL_REQUEST_SENT_TEMPLATE,
      To: recipient.email,
      Tag: SEND_PRIVATE_CHANNEL_REQUEST_SENT_EMAIL,
      TemplateModel: {
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
    console.log(err);
  }
};
