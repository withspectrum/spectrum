// @flow
const debug = require('debug')('pluto');
import Raven from 'shared/raven';
import createWorker from './create-worker-with-express';
import express from 'express';
import { createServer } from 'http';
import { handleWebhooks } from './webhooks';
import startChangefeeds from './changefeeds';
import {
  PROCESS_CHARGE_EVENT,
  PROCESS_CUSTOMER_EVENT,
  PROCESS_INVOICE_EVENT,
  PROCESS_SOURCE_EVENT,
  PROCESS_SUBSCRIPTION_EVENT,
} from './webhooks/constants';
import { processChargeEvent } from './webhooks/chargeEvent';
import { processCustomerEvent } from './webhooks/customerEvent';
import { processSourceEvent } from './webhooks/sourceEvent';
import { processSubscriptionEvent } from './webhooks/subscriptionEvent';
import { processInvoiceEvent } from './webhooks/invoiceEvent';
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
createWorker({
  [PROCESS_CHARGE_EVENT]: processChargeEvent,
  [PROCESS_CUSTOMER_EVENT]: processCustomerEvent,
  [PROCESS_INVOICE_EVENT]: processInvoiceEvent,
  [PROCESS_SOURCE_EVENT]: processSourceEvent,
  [PROCESS_SUBSCRIPTION_EVENT]: processSubscriptionEvent,
});

startChangefeeds();

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
