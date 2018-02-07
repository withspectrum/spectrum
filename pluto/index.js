// @flow
const debug = require('debug')('pluto');
import { createServer } from 'http';
import express from 'express';
import Raven from 'shared/raven';
const PORT = process.env.PORT || 3008;
import { handleWebhooks } from './webhooks';

console.log('Server starting...');
debug('logging with debug enabled!');

// API server
const app = express();

// Trust the now proxy
app.set('trust proxy', true);

app.use(require('body-parser').raw({ type: '*/*' }));

// $FlowIssue
app.get('/', (req, res) => res.send('🚀'));

// $FlowIssue
app.post('/', (req, res) => handleWebhooks(req, res));

const server = createServer(app);

server.listen(PORT);
console.log(`🚀  Pluto server running at http://localhost:${PORT}`);

process.on('unhandledRejection', async err => {
  console.error('Unhandled rejection', err);
  try {
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
    await new Promise(resolve => Raven.captureException(err, resolve));
  } catch (err) {
    console.error('Raven error', err);
  } finally {
    process.exit(1);
  }
});
