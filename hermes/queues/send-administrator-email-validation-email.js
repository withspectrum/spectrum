// @flow
const debug = require('debug')(
  'hermes:queue:send-administrator-email-validation-email'
);
import Raven from 'shared/raven';
import sendEmail from '../send-email';
import {
  ADMINISTRATOR_EMAIL_VALIDATION_TEMPLATE,
  SEND_ADMINISTRATOR_EMAIL_VALIDATION_EMAIL,
} from './constants';
import { generateEmailValidationToken } from '../utils/generate-jwt';
import type {
  Job,
  AdministratorEmailValidationEmailJobData,
} from 'shared/bull/types';

export default async (
  job: Job<AdministratorEmailValidationEmailJobData>
): Promise<void> => {
  debug(`\nnew job: ${job.id}`);
  debug(`\nsending email validation email to: ${job.data.email}`);

  const { email, userId, communityId, community } = job.data;
  if (!email || !userId || !communityId) {
    debug(
      '\nno email or userId or communityId found for this request, returning'
    );
    return Promise.resolve();
  }

  const subject = `Confirm new administrator email for the ${
    community.name
  } community`;
  const preheader = 'Confirm the new administrator email below';

  const validateToken = await generateEmailValidationToken(
    userId,
    email,
    communityId
  );

  if (!validateToken) {
    return Promise.resolve();
  }

  try {
    return sendEmail({
      templateId: ADMINISTRATOR_EMAIL_VALIDATION_TEMPLATE,
      to: [{ email }],
      dynamic_template_data: {
        subject,
        preheader,
        validateToken,
        community,
      },
      userId,
    });
  } catch (err) {
    console.error('❌ Error in job:\n');
    console.error(err);
    return Raven.captureException(err);
  }
};
