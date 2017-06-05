// @flow
import Queue from 'bull';

// A small wrapper around bull to have the connection options in a single place
export default (name: string, cb: Function) => new Queue(name).process(cb);
