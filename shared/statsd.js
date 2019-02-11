// @flow
const os = require('os');
const debug = require('debug')('shared:middlewares:statsd');

type Tags = {
  [key: string]: string,
};

const stringify = (obj?: { [key: string]: string }): Array<string> => {
  if (!obj) return [];
  return Object.keys(obj).reduce((arr, key) => {
    // $FlowFixMe
    return arr.concat([`${key}:${obj[key]}`]);
  }, []);
};

const log = (
  name: string,
  key: string,
  value?: number,
  tags?: Tags,
  timestamp?: number
) => {
  let stringTags;
  if (!tags && typeof value !== 'number') {
    tags = value;
    value = undefined;
  }
  if (tags) {
    if (Array.isArray(tags)) {
      stringTags = tags.join(',');
    } else {
      stringTags = stringify(tags).join(',');
    }
  }
  debug(
    `${name}: ${key}${value !== undefined ? `:${value}` : ''}${
      stringTags ? `#${stringTags}` : ''
    }`
  );
};

let counts = {};
export let statsd = {
  histogram: (key: string, value: number, tags?: Tags, timestamp?: number) => {
    log('histogram', key, value, tags, timestamp);
  },
  timing: (key: string, value: number, tags?: Tags, timestamp?: number) => {
    log('timing', key, value, tags, timestamp);
  },
  increment: (key: string, value?: number, tags?: Tags, timestamp?: number) => {
    if (!counts[key]) counts[key] = 0;
    counts[key] += typeof value === 'number' ? value : 1;
    log(
      'increment',
      key,
      counts[key],
      tags || (typeof value !== 'number' && value) || undefined,
      timestamp
    );
  },
  gauge: (key: string, value: number, tags?: Tags, timestamp?: number) => {
    log('gauge', key, value, tags, timestamp);
  },
};
if (
  !process.env.DATADOG_API_KEY ||
  process.env.DATADOG_API_KEY === 'undefined'
) {
  console.warn('No DATADOG_API_KEY provided, not tracking metrics.');
} else {
  console.warn('Tracking metrics to DataDog.');
  const metrics = require('datadog-metrics');
  metrics.init({
    defaultTags: [
      `server:${process.env.SENTRY_NAME || 'unknown_server'}`,
      `hostname: ${os.hostname() || 'unknown_instance_hostname'}`,
    ],
  });

  // This is necessary for express-hot-shots to work
  const handleObjectTags = method => {
    const original = metrics[method];
    metrics[method] = (key, val, tags, timestamp) => {
      return original.call(
        metrics,
        key,
        val,
        Array.isArray(tags) ? tags : stringify(tags),
        timestamp
      );
    };
  };
  handleObjectTags('histogram');
  handleObjectTags('gauge');
  handleObjectTags('increment');
  metrics.timing = (...args) => metrics.histogram.call(metrics, ...args);

  statsd = metrics;
}

function collectMemoryStats() {
  var memory = process.memoryUsage();
  statsd.gauge('memory.rss', memory.rss);
  statsd.gauge('memory.heapTotal', memory.heapTotal);
  statsd.gauge('memory.heapUsed', memory.heapUsed);
}

// Report memory usage every second
setInterval(collectMemoryStats, 1000);
