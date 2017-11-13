// @flow
const debug = require('debug')('hermes');
const createWorker = require('../shared/bull/create-worker');
import processSendNewMessageEmail from './queues/send-new-message-email';
import processSendNewMentionThreadEmail from './queues/send-mention-thread-email';
import processSendNewMentionMessageEmail from './queues/send-mention-message-email';
import processSendNewDirectMessageEmail from './queues/send-new-direct-message-email';
import processSendCommunityInviteEmail from './queues/send-community-invite-email';
import processSendUserWelcomeEmail from './queues/send-user-welcome-email';
import processSendNewCommunityWelcomeEmail from './queues/send-new-community-welcome-email';
import processSendCommunityInvoiceReceiptEmail from './queues/send-community-invoice-receipt-email';
import processSendProInvoiceReceiptEmail from './queues/send-pro-invoice-receipt-email';
import processSendNewThreadEmail from './queues/send-new-thread-email';
import processSendDigestEmail from './queues/send-digest-email';
import processSendEmailValidationEmail from './queues/send-email-validation-email';
import processSendAdminCommunityCreatedEmail from './queues/send-admin-community-created-email';
import processSendAdminToxicContentEmail from './queues/send-admin-toxic-content-email';
import {
  SEND_COMMUNITY_INVOICE_RECEIPT_EMAIL,
  SEND_PRO_INVOICE_RECEIPT_EMAIL,
  SEND_COMMUNITY_INVITE_EMAIL,
  SEND_NEW_MESSAGE_EMAIL,
  SEND_NEW_MENTION_THREAD_EMAIL,
  SEND_NEW_MENTION_MESSAGE_EMAIL,
  SEND_NEW_DIRECT_MESSAGE_EMAIL,
  SEND_NEW_USER_WELCOME_EMAIL,
  SEND_NEW_COMMUNITY_WELCOME_EMAIL,
  SEND_THREAD_CREATED_NOTIFICATION_EMAIL,
  SEND_DIGEST_EMAIL,
  SEND_EMAIL_VALIDATION_EMAIL,
  SEND_ADMIN_COMMUNITY_CREATED_EMAIL,
  SEND_ADMIN_TOXIC_MESSAGE_EMAIL,
} from './queues/constants';

const PORT = process.env.PORT || 3002;

console.log('\n✉️ Hermes, the email worker, is starting...');
debug('Logging with debug enabled!');
console.log('');

const server = createWorker({
  [SEND_COMMUNITY_INVITE_EMAIL]: processSendCommunityInviteEmail,
  [SEND_NEW_MESSAGE_EMAIL]: processSendNewMessageEmail,
  [SEND_NEW_MENTION_THREAD_EMAIL]: processSendNewMentionThreadEmail,
  [SEND_NEW_MENTION_MESSAGE_EMAIL]: processSendNewMentionMessageEmail,
  [SEND_NEW_DIRECT_MESSAGE_EMAIL]: processSendNewDirectMessageEmail,
  [SEND_NEW_USER_WELCOME_EMAIL]: processSendUserWelcomeEmail,
  [SEND_NEW_COMMUNITY_WELCOME_EMAIL]: processSendNewCommunityWelcomeEmail,
  [SEND_COMMUNITY_INVOICE_RECEIPT_EMAIL]: processSendCommunityInvoiceReceiptEmail,
  [SEND_PRO_INVOICE_RECEIPT_EMAIL]: processSendProInvoiceReceiptEmail,
  [SEND_THREAD_CREATED_NOTIFICATION_EMAIL]: processSendNewThreadEmail,
  [SEND_DIGEST_EMAIL]: processSendDigestEmail,
  [SEND_EMAIL_VALIDATION_EMAIL]: processSendEmailValidationEmail,
  [SEND_ADMIN_COMMUNITY_CREATED_EMAIL]: processSendAdminCommunityCreatedEmail,
  [SEND_ADMIN_TOXIC_MESSAGE_EMAIL]: processSendAdminToxicContentEmail,
});

console.log(
  // $FlowIssue
  `🗄 Queues open for business ${(process.env.NODE_ENV === 'production' &&
    // $FlowIssue
    `at ${process.env.COMPOSE_REDIS_URL}:${process.env.COMPOSE_REDIS_PORT}`) ||
    'locally'}`
);

server.listen(PORT, 'localhost', () => {
  console.log(
    `💉 Healthcheck server running at ${server.address()
      .address}:${server.address().port}`
  );
});
