// @flow
const debug = require('debug')('hermes:queue:send-admin-toxic-content-email');
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
    toxicityConfidence: { spectrumScore, perspectiveScore },
  } = job.data;

  const toPercent = (num: number) => Math.round(num * 100);
  const spectrumPercent = spectrumScore ? toPercent(spectrumScore) : null;
  const perspectivePercent = perspectiveScore
    ? toPercent(perspectiveScore)
    : null;
  let avgPercent;
  if (spectrumPercent && perspectivePercent) {
    avgPercent = (spectrumPercent + perspectivePercent) / 2;
  } else {
    avgPercent = spectrumPercent || perspectivePercent || 0;
  }

  const subject = `Toxic alert (${avgPercent.toString()}%): ${text}`;

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
            spectrumPercent,
            perspectivePercent,
          },
        },
      },
    });
  } catch (err) {
    console.log(err);
  }
};
