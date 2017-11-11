const debug = require('debug')('hermes:queue:send-admin-toxic-content-email');
import sendEmail from '../send-email';
import { ADMIN_TOXIC_MESSAGE_TEMPLATE } from './constants';

export default job => {
  debug(`\nnew job: ${job.id}`);
  const {
    type,
    text,
    user,
    thread,
    community,
    channel,
    toxicityConfidence,
  } = job.data;

  const percent = Math.round(toxicityConfidence * 100);
  const subject = `Toxic alert (${percent}%): ${text}`;

  try {
    return sendEmail({
      TemplateId: ADMIN_TOXIC_MESSAGE_TEMPLATE,
      To: 'briandlovin@gmail.com',
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
          toxicityConfidence: percent,
        },
      },
    });
  } catch (err) {
    console.log(err);
  }
};
