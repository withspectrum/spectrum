// @flow
const debug = require('debug')('hermes:sendgrid-webhook-events');
import Raven from 'shared/raven';
import { getUserByEmail } from 'shared/db/queries/user';
import { deactivateUserEmailNotifications } from '../models/usersSettings';
import type { Job, SendGridWebhookEventJobData } from 'shared/bull/types';

const processEvent = async (job: Job<SendGridWebhookEventJobData>) => {
  const { event } = job.data;

  const user = await getUserByEmail(event.email);

  if (!user) {
    debug(`No user found with email ${event.email}`);
    return;
  }

  return await deactivateUserEmailNotifications(user.id).catch(e =>
    console.error(e.message)
  );
};

export default (job: Job<SendGridWebhookEventJobData>) => {
  try {
    debug('Processing SendGrid webhook event');
    return processEvent(job);
  } catch (err) {
    console.error('❌ Error in job:\n');
    console.error(err);
    Raven.captureException(err);
  }
};
