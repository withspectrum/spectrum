const debug = require('debug')(
  'hermes:queue:send-admin-community-created-email'
);
import sendEmail from '../send-email';
import { ADMIN_COMMUNITY_CREATED_TEMPLATE } from './constants';

export default job => {
  debug(`\nnew job: ${job.id}`);
  const { user, community } = job.data;

  try {
    return sendEmail({
      TemplateId: ADMIN_COMMUNITY_CREATED_TEMPLATE,
      To: 'brian@spectrum.chat, max@spectrum.chat, bryn@spectrum.chat',
      TemplateModel: {
        user: {
          ...user,
          createdAt: new Date(user.createdAt),
        },
        community,
      },
    });
  } catch (err) {
    console.log(err);
  }
};
