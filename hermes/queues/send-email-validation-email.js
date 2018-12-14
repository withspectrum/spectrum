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

export default async (job: SendEmailValidationJob): Promise<void> => {
  debug(`\nnew job: ${job.id}`);
  debug(`\nsending email validation email to: ${job.data.email}`);

  const { email, userId } = job.data;
  if (!email || !userId) {
    debug('\nno email or userId found for this request, returning');
    return Promise.resolve();
  }

  const validateToken = await generateEmailValidationToken(userId, email);

  if (!validateToken) return Promise.resolve();
  try {
    return sendEmail({
      templateId: EMAIL_VALIDATION_TEMPLATE,
      to: [{ email }],
      dynamic_template_data: {
        subject: 'Confirm your email address on Spectrum',
        validateToken,
      },
    });
  } catch (err) {
    console.error('❌ Error in job:\n');
    console.error(err);
    return Raven.captureException(err);
  }
};
