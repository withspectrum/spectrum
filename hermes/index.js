// @flow
const debug = require('debug')('hermes');
const createWorker = require('../shared/bull/create-worker');
import processSendNewMessageEmail from './queues/send-new-message-email';
import processSendNewDirectMessageEmail from './queues/send-new-direct-message-email';
import processSendCommunityInviteEmail from './queues/send-community-invite-email';
import processSendUserWelcomeEmail from './queues/send-user-welcome-email';
import processSendNewCommunityWelcomeEmail from './queues/send-new-community-welcome-email';
import processSendCommunityInvoiceReceiptEmail from './queues/send-community-invoice-receipt-email';
import processSendProInvoiceReceiptEmail from './queues/send-pro-invoice-receipt-email';
import processSendNewThreadEmail from './queues/send-new-thread-email';
import processSendWeeklyDigestEmail from './queues/send-weekly-digest-email';
import {
  SEND_COMMUNITY_INVOICE_RECEIPT_EMAIL,
  SEND_PRO_INVOICE_RECEIPT_EMAIL,
  SEND_COMMUNITY_INVITE_EMAIL,
  SEND_NEW_MESSAGE_EMAIL,
  SEND_NEW_DIRECT_MESSAGE_EMAIL,
  SEND_NEW_USER_WELCOME_EMAIL,
  SEND_NEW_COMMUNITY_WELCOME_EMAIL,
  SEND_THREAD_CREATED_NOTIFICATION_EMAIL,
  SEND_WEEKLY_DIGEST_EMAIL,
} from './queues/constants';

const PORT = process.env.PORT || 3002;

console.log('\n✉️ Hermes, the email worker, is starting...');
debug('Logging with debug enabled!');
console.log('');

const server = createWorker({
  [SEND_COMMUNITY_INVITE_EMAIL]: processSendCommunityInviteEmail,
  [SEND_NEW_MESSAGE_EMAIL]: processSendNewMessageEmail,
  [SEND_NEW_DIRECT_MESSAGE_EMAIL]: processSendNewDirectMessageEmail,
  [SEND_NEW_USER_WELCOME_EMAIL]: processSendUserWelcomeEmail,
  [SEND_NEW_COMMUNITY_WELCOME_EMAIL]: processSendNewCommunityWelcomeEmail,
  [SEND_COMMUNITY_INVOICE_RECEIPT_EMAIL]: processSendCommunityInvoiceReceiptEmail,
  [SEND_PRO_INVOICE_RECEIPT_EMAIL]: processSendProInvoiceReceiptEmail,
  [SEND_THREAD_CREATED_NOTIFICATION_EMAIL]: processSendNewThreadEmail,
  [SEND_WEEKLY_DIGEST_EMAIL]: processSendWeeklyDigestEmail,
});

console.log(
  `🗄 Queues open for business ${(process.env.NODE_ENV === 'production' &&
    `at ${process.env.COMPOSE_REDIS_URL}:${process.env.COMPOSE_REDIS_PORT}`) ||
    'locally'}`
);

server.listen(PORT, 'localhost', () => {
  console.log(
    `💉 Healthcheck server running at ${server.address()
      .address}:${server.address().port}`
  );
});
