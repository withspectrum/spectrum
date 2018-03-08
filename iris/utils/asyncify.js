// @flow
// Turn a callback-based listener into an async iterator
// Based on https://github.com/apollographql/graphql-subscriptions/blob/master/src/event-emitter-to-async-iterator.ts
const debug = require('debug')('iris:utils:asyncify');
import { $$asyncIterator } from 'iterall';
import Raven from 'shared/raven';

type Listener = <K>((arg: any) => void) => Promise<K>;

type onError = (err: Error) => void;

const defaultOnError = (err: Error) => {
  throw new Error(err);
};

type Options = {|
  onError?: onError,
  onClose?: Function,
|};

const asyncify = (
  listener: Listener,
  { onError = defaultOnError, onClose }: Options = {}
) => {
  try {
    let pullQueue = [];
    let pushQueue = [];
    let listening = true;
    let listenerReturnValue;
    // Start listener
    listener(value => pushValue(value))
      .then(a => {
        listenerReturnValue = a;
      })
      .catch(err => {
        onError(err);
      });

    function pushValue(value) {
      if (pullQueue.length !== 0) {
        pullQueue.shift()({ value, done: false });
      } else {
        pushQueue.push(value);
      }
    }

    function pullValue() {
      return new Promise(resolve => {
        if (pushQueue.length !== 0) {
          resolve({ value: pushQueue.shift(), done: false });
        } else {
          pullQueue.push(resolve);
        }
      });
    }

    function emptyQueue() {
      if (listening) {
        listening = false;
        pullQueue.forEach(resolve => resolve({ value: undefined, done: true }));
        pullQueue = [];
        pushQueue = [];
        onClose && onClose(listenerReturnValue);
      }
    }

    return ({
      next() {
        return listening ? pullValue() : this.return();
      },
      return() {
        emptyQueue();
        return Promise.resolve({ value: undefined, done: true });
      },
      throw(error) {
        emptyQueue();
        onError(error);
        return Promise.reject(error);
      },
      [$$asyncIterator]() {
        return this;
      },
    }: any);
  } catch (err) {
    debug(err);
    onError(err);
  }
};

export default asyncify;
