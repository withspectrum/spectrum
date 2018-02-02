// @flow
import { Transform } from 'stream';
import redis from './redis';
const debug = require('debug')('hyperion:create-cache-stream');

const createCacheStream = (key: string) => {
  debug('create cache stream for', key);
  const buffer: Array<Buffer> = [];
  return new Transform({
    transform(data, enc, cb) {
      debug('new data', data);
      buffer.push(data);
      cb(null, data);
    },
    flush(cb) {
      debug('stream ended, writing to redis');
      redis.set(key, Buffer.concat(buffer), 'ex', 3600);
      cb();
    },
  });
};

export default createCacheStream;
