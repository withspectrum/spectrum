// @flow
const debug = require('debug')('hermes:queue:send-email-validation-email');
import Raven from 'shared/raven';
import sendEmail from '../send-email';
import {
  EMAIL_VALIDATION_TEMPLATE,
  SEND_EMAIL_VALIDATION_EMAIL,
} from './constants';
import { generateEmailValidationToken } from '../utils/generate-jwt';

type SendEmailValidationJob = {
  data: {
    email: string,
    userId: string,
  },
  id: string,
};

export default async (job: SendEmailValidationJob) => {
  debug(`\nnew job: ${job.id}`);
  debug(`\nsending email validation email to: ${job.data.email}`);

  const { email, userId } = job.data;
  if (!email || !userId) {
    debug('\nno email or userId found for this request, returning');
    return;
  }

  const validateToken = await generateEmailValidationToken(userId, email);

  if (!validateToken) {
    return;
  } else {
    try {
      return sendEmail({
        TemplateId: EMAIL_VALIDATION_TEMPLATE,
        To: email,
        Tag: SEND_EMAIL_VALIDATION_EMAIL,
        TemplateModel: {
          validateToken,
        },
      });
    } catch (err) {
      debug('❌ Error in job:\n');
      debug(err);
      Raven.captureException(err);
    }
  }
};
