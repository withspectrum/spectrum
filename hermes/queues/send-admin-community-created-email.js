const debug = require('debug')(
  'hermes:queue:send-admin-community-created-email'
);
import sendEmail from '../send-email';
import {
  ADMIN_COMMUNITY_CREATED_TEMPLATE,
  SEND_ADMIN_COMMUNITY_CREATED_EMAIL,
} from './constants';

export default job => {
  debug(`\nnew job: ${job.id}`);
  const { user, community } = job.data;

  try {
    return sendEmail({
      templateId: ADMIN_COMMUNITY_CREATED_TEMPLATE,
      to: [
        { email: 'brian@spectrum.chat ' },
        { email: 'max@spectrum.chat ' },
        { email: 'bryn@spectrum.chat ' },
      ],
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
    Raven.captureException(err);
  }
};
