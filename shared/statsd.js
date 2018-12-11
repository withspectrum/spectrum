// @flow
const debug = require('debug')('shared:middlewares:statsd');
import StatsD from 'hot-shots';

export const statsd = new StatsD({
  mock: process.env.NODE_ENV !== 'production',
  prefix: `${process.env.SENTRY_NAME || 'server'}.`,
});

statsd.socket.on('error', function(error) {
  console.error('Error in socket: ', error);
});

// Log StatsD events in development by monkey-patching the internal _send method
// because hot-shots does not expose a way to listen to events as they happen
if (debug.enabled) {
  const originalSend = statsd._send;
  statsd._send = (...args) => {
    statsd.mockBuffer.forEach(item => {
      debug(item);
    });
    statsd.mockBuffer = [];
    return originalSend.call(statsd, ...args);
  };
}
