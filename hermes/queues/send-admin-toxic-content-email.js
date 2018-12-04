// @flow
const debug = require('debug')('hermes:queue:send-admin-toxic-content-email');
import Raven from 'shared/raven';
import sendEmail from '../send-email';
import {
  ADMIN_TOXIC_MESSAGE_TEMPLATE,
  SEND_ADMIN_TOXIC_MESSAGE_EMAIL,
} from './constants';

// $FlowFixMe
export default job => {
  debug(`\nnew job: ${job.id}`);
  const {
    type,
    text,
    user,
    thread,
    community,
    channel,
    toxicityConfidence: { perspectiveScore },
  } = job.data;

  const toPercent = (num: number) => Math.round(num * 100);

  const perspectivePercent = perspectiveScore.toPercent(perspectiveScore);

  const subject = `Toxic alert (${perspectivePercent.toString()}%): ${text}`;

  try {
    return sendEmail({
      TemplateId: ADMIN_TOXIC_MESSAGE_TEMPLATE,
      To: 'brian@spectrum.chat, bryn@spectrum.chat, max@spectrum.chat',
      Tag: SEND_ADMIN_TOXIC_MESSAGE_EMAIL,
      TemplateModel: {
        subject,
        preheader: text,
        data: {
          type,
          text,
          user,
          thread,
          community,
          channel,
          toxicityConfidence: {
            perspectivePercent,
          },
        },
      },
    });
  } catch (err) {
    debug('❌ Error in job:\n');
    debug(err);
    Raven.captureException(err);
  }
};
