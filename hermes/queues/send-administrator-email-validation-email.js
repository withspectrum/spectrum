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

export default async (job: Job<AdministratorEmailValidationEmailJobData>) => {
  debug(`\nnew job: ${job.id}`);
  debug(`\nsending email validation email to: ${job.data.email}`);

  const { email, userId, communityId, community } = job.data;
  if (!email || !userId || !communityId) {
    debug(
      '\nno email or userId or communityId found for this request, returning'
    );
    return;
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
    return;
  } else {
    try {
      return sendEmail({
        TemplateId: ADMINISTRATOR_EMAIL_VALIDATION_TEMPLATE,
        To: email,
        Tag: SEND_ADMINISTRATOR_EMAIL_VALIDATION_EMAIL,
        TemplateModel: {
          subject,
          preheader,
          validateToken,
          community,
        },
      });
    } catch (err) {
      debug('❌ Error in job:\n');
      debug(err);
      Raven.captureException(err);
    }
  }
};
