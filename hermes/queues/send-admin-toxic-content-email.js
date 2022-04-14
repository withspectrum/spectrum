// @flow
const debug = require('debug')('hermes:queue:send-admin-toxic-content-email');
import Raven from 'shared/raven';
import sendEmail from '../send-email';
import {
  ADMIN_TOXIC_MESSAGE_TEMPLATE,
  SEND_ADMIN_TOXIC_MESSAGE_EMAIL,
} from './constants';
import type { Job, AdminToxicContentEmailJobData } from 'shared/bull/types';

export default (job: Job<AdminToxicContentEmailJobData>): Promise<void> => {
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

  const toPercent = (num: number): number => Math.round(num * 100);
  const perspectivePercent = toPercent(perspectiveScore);
  const subject = `Toxic alert (${perspectivePercent.toString()}%): ${text}`;

  try {
    return sendEmail({
      templateId: ADMIN_TOXIC_MESSAGE_TEMPLATE,
      to: [{ email: 'brian@spectrum.chat ' }, { email: 'max@spectrum.chat ' }],
      dynamic_template_data: {
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
    console.error('❌ Error in job:\n');
    console.error(err);
    return Raven.captureException(err);
  }
};
