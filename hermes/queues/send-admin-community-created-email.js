// @flow
const debug = require('debug')('hermes:queue:admin-community-created-email');
import Raven from 'shared/raven';
import sendEmail from '../send-email';
import type { Job, AdminCommunityCreatedEmailJobData } from 'shared/bull/types';
import {
  ADMIN_COMMUNITY_CREATED_TEMPLATE,
  SEND_ADMIN_COMMUNITY_CREATED_EMAIL,
} from './constants';

export default (job: Job<AdminCommunityCreatedEmailJobData>): Promise<void> => {
  debug(`\nnew job: ${job.id}`);
  const { user, community } = job.data;

  try {
    return sendEmail({
      templateId: ADMIN_COMMUNITY_CREATED_TEMPLATE,
      to: [{ email: 'brian@spectrum.chat ' }, { email: 'max@spectrum.chat ' }],
      dynamic_template_data: {
        subject: `New community: ${community.name}`,
        user: {
          ...user,
          createdAt: new Date(user.createdAt),
        },
        community,
      },
    });
  } catch (err) {
    console.error('❌ Error in job:\n');
    console.error(err);
    return Raven.captureException(err);
  }
};
