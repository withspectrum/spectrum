// @flow
import createQueue from './create-queue';

// A small wrapper around bull to have the connection options in a single place
export default (name: string, cb: Function) => {
  console.log(`📥 Processing ${name} queue...`);
  return createQueue(name).process(cb);
};
