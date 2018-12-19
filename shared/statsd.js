// @flow
const debug = require('debug')('shared:middlewares:statsd');
import metrics from 'datadog-metrics';

type Tags = {
  [key: string]: string,
};

export let statsd = {
  histogram: (
    key: string,
    value: number,
    tags?: Tags,
    timestamp?: number
  ) => {},
  timing: (key: string, value: number, tags?: Tags, timestamp?: number) => {},
  increment: (
    key: string,
    value?: number,
    tags?: Tags,
    timestamp?: number
  ) => {},
  gauge: (key: string, value: number, tags?: Tags, timestamp?: number) => {},
};
if (!process.env.DATADOG_API_KEY) {
  console.warn('No DATADOG_API_KEY provided, not tracking metrics.');
} else {
  metrics.init({
    defaultTags: [`server:${process.env.SENTRY_NAME || 'unknown_server'}`],
  });

  // $FlowFixMe
  const stringify = (obj?: { [key: string]: string }) => {
    if (!obj) return obj;
    return Object.keys(obj).reduce((arr, key) => {
      return arr.concat([`${key}:${obj[key]}`]);
    }, []);
  };
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
