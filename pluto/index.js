// @flow
const debug = require('debug')('pluto');
import Raven from 'shared/raven';
import createWorker from './create-worker-with-express';
import express from 'express';
import { createServer } from 'http';
import { handleWebhooks } from './webhooks';
import startChangefeeds from './changefeeds';
import {
  PROCESS_STRIPE_SUBSCRIPTION_WEBHOOK_EVENT,
  PROCESS_STRIPE_SOURCE_WEBHOOK_EVENT,
  PROCESS_STRIPE_CUSTOMER_WEBHOOK_EVENT,
  PROCESS_STRIPE_CHARGE_WEBHOOK_EVENT,
  PROCESS_STRIPE_INVOICE_WEBHOOK_EVENT,
  PROCESS_STRIPE_DISCOUNT_WEBHOOK_EVENT,
  PROCESS_STRIPE_COMMUNITY_ANALYTICS_ADDED,
  PROCESS_STRIPE_COMMUNITY_ANALYTICS_REMOVED,
  PROCESS_STRIPE_COMMUNITY_MODERATOR_ADDED,
  PROCESS_STRIPE_COMMUNITY_MODERATOR_REMOVED,
  PROCESS_STRIPE_COMMUNITY_PRIORITY_SUPPORT_ADDED,
  PROCESS_STRIPE_COMMUNITY_PRIORITY_SUPPORT_REMOVED,
  PROCESS_STRIPE_COMMUNITY_PRIVATE_CHANNEL_ADDED,
  PROCESS_STRIPE_COMMUNITY_PRIVATE_CHANNEL_REMOVED,
  PROCESS_STRIPE_COMMUNITY_ADMINISTRATOR_EMAIL_CHANGED,
  PROCESS_STRIPE_COMMUNITY_CREATED,
  PROCESS_STRIPE_COMMUNITY_DELETED,
  PROCESS_STRIPE_COMMUNITY_EDITED,
  PROCESS_STRIPE_COMMUNITY_OSS_STATUS_ACTIVATED,
  PROCESS_STRIPE_COMMUNITY_OSS_STATUS_ENABLED,
  PROCESS_STRIPE_COMMUNITY_OSS_STATUS_DISABLED,
} from './queues/constants';
import processStripeChargeWebhook from './queues/processStripeChargeWebhook';
import processStripeCustomerWebhook from './queues/processStripeCustomerWebhook';
import processStripeSourceWebhook from './queues/processStripeSourceWebhook';
import processStripeSubscriptionWebhook from './queues/processStripeSubscriptionWebhook';
import processStripeInvoiceWebhook from './queues/processStripeInvoiceWebhook';
import processStripeDiscountWebhook from './queues/processStripeDiscountWebhook';

import processModeratorAdded from './queues/processModeratorAdded';
import processModeratorRemoved from './queues/processModeratorRemoved';

import processAnalyticsAdded from './queues/processAnalyticsAdded';
import processAnalyticsRemoved from './queues/processAnalyticsRemoved';

import processPrioritySupportAdded from './queues/processPrioritySupportAdded';
import processPrioritySupportRemoved from './queues/processPrioritySupportRemoved';

import processPrivateChannelAdded from './queues/processPrivateChannelAdded';
import processPrivateChannelRemoved from './queues/processPrivateChannelRemoved';

import processAdministratorEmailChanged from './queues/processAdministratorEmailChanged';
import processCommunityCreated from './queues/processCommunityCreated';
import processCommunityDeleted from './queues/processCommunityDeleted';
import processCommunityEdited from './queues/processCommunityEdited';

import processOssStatusActivated from './queues/processOssStatusActivated';
import processOssStatusEnabled from './queues/processOssStatusEnabled';
import processOssStatusDisabled from './queues/processOssStatusDisabled';

const PORT = process.env.PORT || 3008;

debug('Logging with debug enabled!');
console.log('\n💰 Pluto, the payments worker, is starting...');

const app = express();

// Trust the now proxy
app.set('trust proxy', true);

// Parse incoming request bodies for webhooks
app.use(require('body-parser').raw({ type: '*/*' }));

// $FlowIssue
app.get('/', (req, res) => res.status(200).send({ pluto: 'running' }));

// $FlowIssue
app.post('/webhooks', (req, res) => handleWebhooks(req, res));

// Queue map of all events to process
try {
  createWorker({
    [PROCESS_STRIPE_CHARGE_WEBHOOK_EVENT]: processStripeChargeWebhook,
    [PROCESS_STRIPE_CUSTOMER_WEBHOOK_EVENT]: processStripeCustomerWebhook,
    [PROCESS_STRIPE_INVOICE_WEBHOOK_EVENT]: processStripeInvoiceWebhook,
    [PROCESS_STRIPE_SOURCE_WEBHOOK_EVENT]: processStripeSourceWebhook,
    [PROCESS_STRIPE_SUBSCRIPTION_WEBHOOK_EVENT]: processStripeSubscriptionWebhook,
    [PROCESS_STRIPE_DISCOUNT_WEBHOOK_EVENT]: processStripeDiscountWebhook,

    [PROCESS_STRIPE_COMMUNITY_ANALYTICS_ADDED]: processAnalyticsAdded,
    [PROCESS_STRIPE_COMMUNITY_ANALYTICS_REMOVED]: processAnalyticsRemoved,

    [PROCESS_STRIPE_COMMUNITY_MODERATOR_ADDED]: processModeratorAdded,
    [PROCESS_STRIPE_COMMUNITY_MODERATOR_REMOVED]: processModeratorRemoved,

    [PROCESS_STRIPE_COMMUNITY_PRIORITY_SUPPORT_ADDED]: processPrioritySupportAdded,
    [PROCESS_STRIPE_COMMUNITY_PRIORITY_SUPPORT_REMOVED]: processPrioritySupportRemoved,

    [PROCESS_STRIPE_COMMUNITY_PRIVATE_CHANNEL_ADDED]: processPrivateChannelAdded,
    [PROCESS_STRIPE_COMMUNITY_PRIVATE_CHANNEL_REMOVED]: processPrivateChannelRemoved,

    [PROCESS_STRIPE_COMMUNITY_OSS_STATUS_ACTIVATED]: processOssStatusActivated,
    [PROCESS_STRIPE_COMMUNITY_OSS_STATUS_ENABLED]: processOssStatusEnabled,
    [PROCESS_STRIPE_COMMUNITY_OSS_STATUS_DISABLED]: processOssStatusDisabled,

    [PROCESS_STRIPE_COMMUNITY_ADMINISTRATOR_EMAIL_CHANGED]: processAdministratorEmailChanged,
    [PROCESS_STRIPE_COMMUNITY_CREATED]: processCommunityCreated,
    [PROCESS_STRIPE_COMMUNITY_DELETED]: processCommunityDeleted,
    [PROCESS_STRIPE_COMMUNITY_EDITED]: processCommunityEdited,
  });
} catch (err) {
  console.log('❌ Error starting worker', err);
  Raven.captureException(err);
}

try {
  startChangefeeds();
} catch (err) {
  console.log('❌ Error starting changefeeds', err);
  Raven.captureException(err);
}

const server = createServer(app);
server.listen(PORT);

console.log(`💰 Pluto server running at http://localhost:${PORT}`);

process.on('unhandledRejection', async err => {
  console.error('Unhandled rejection', err);
  try {
    // eslint-disable-next-line
    await new Promise(resolve => Raven.captureException(err, resolve));
  } catch (err) {
    console.error('Raven error', err);
  } finally {
    process.exit(1);
  }
});

process.on('uncaughtException', async err => {
  console.error('Uncaught exception', err);
  try {
    // eslint-disable-next-line
    await new Promise(resolve => Raven.captureException(err, resolve));
  } catch (err) {
    console.error('Raven error', err);
  } finally {
    process.exit(1);
  }
});
