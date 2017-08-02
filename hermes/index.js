// @flow
const debug = require('debug')('hermes');
const createWorker = require('../shared/bull/create-worker');
import processSendNewMessageEmail from './queues/send-new-message-email';
import processSendCommunityInviteEmail from './queues/send-community-invite-email';
import processSendUserWelcomeEmail from './queues/send-user-welcome-email';
import processSendNewCommunityWelcomeEmail from './queues/send-new-community-welcome-email';
import processSendCommunityInvoiceReceiptEmail from './queues/send-community-invoice-receipt-email';
import {
  SEND_COMMUNITY_INVOICE_RECEIPT_EMAIL,
  SEND_COMMUNITY_INVITE_EMAIL,
  SEND_NEW_MESSAGE_EMAIL,
  SEND_NEW_USER_WELCOME_EMAIL,
  SEND_NEW_COMMUNITY_WELCOME_EMAIL,
} from './queues/constants';

const PORT = process.env.PORT || 3002;

console.log('\n✉️ Hermes, the email worker, is starting...');
debug('Logging with debug enabled!');
console.log('');

const server = createWorker({
  [SEND_COMMUNITY_INVITE_EMAIL]: processSendCommunityInviteEmail,
  [SEND_NEW_MESSAGE_EMAIL]: processSendNewMessageEmail,
  [SEND_NEW_USER_WELCOME_EMAIL]: processSendUserWelcomeEmail,
  [SEND_NEW_COMMUNITY_WELCOME_EMAIL]: processSendNewCommunityWelcomeEmail,
  [SEND_COMMUNITY_INVOICE_RECEIPT_EMAIL]: processSendCommunityInvoiceReceiptEmail,
});

server.listen(PORT);

console.log(
  `\n🗄 Queues open for business ${(process.env.NODE_ENV === 'production' &&
    `at ${process.env.COMPOSE_REDIS_URL}:${process.env.COMPOSE_REDIS_PORT}`) ||
    'locally'}; Server listening at localhost:${PORT}`
);
