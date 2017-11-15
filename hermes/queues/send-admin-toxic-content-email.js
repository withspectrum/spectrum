// @flow
const debug = require('debug')('hermes:queue:send-admin-toxic-content-email');
import sendEmail from '../send-email';
import { ADMIN_TOXIC_MESSAGE_TEMPLATE } from './constants';

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
  } else if (spectrumPercent && !perspectivePercent) {
    avgPercent = spectrumPercent;
  } else if (!spectrumPercent && perspectivePercent) {
    avgPercent = perspectivePercent;
  } else {
    avgPercent = 0;
  }

  const subject = `Toxic alert (${avgPercent.toString()}%): ${text}`;

  try {
    return sendEmail({
      TemplateId: ADMIN_TOXIC_MESSAGE_TEMPLATE,
      To: 'brian@spectrum.chat, bryn@spectrum.chat, max@spectrum.chat',
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
