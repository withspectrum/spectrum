// @flow
const debug = require('debug')('athena:send-message-notification-email');
import createQueue from '../../shared/bull/create-queue';
import { SEND_COMMUNITY_INVITE_EMAIL } from './constants';
const sendCommunityInviteEmailQueue = createQueue(SEND_COMMUNITY_INVITE_EMAIL);

const bufferCommunityInviteEmail = (recipient, community, sender) => {
  debug(
    `send message notification email to ${recipient.email} for community #${community.id}`
  );

  debug('in athena with recipient', recipient);
  debug('in athena with sender', sender);
  debug('in athena with community', community);

  return sendCommunityInviteEmailQueue.add({
    to: recipient.email,
    recipient,
    sender,
    community,
  });
};

export default bufferCommunityInviteEmail;
