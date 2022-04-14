// @flow
// Turn a callback-based listener into many async iterators without buffering
import { $$asyncIterator } from 'iterall';

type Listener = ((arg: any) => void) => Promise<any>;

const defaultOnError = (err: Error) => {
  throw new Error(err);
};

type Options = {|
  onError?: (err: Error) => void,
  filter?: (arg: any) => boolean,
|};

type Watcher = {
  filter?: (arg: any) => boolean,
  callback?: ({ done: boolean, value: any }) => void,
};

const asyncify = (listener: Listener) => {
  let watchers: Array<Watcher> = [];
  listener(value => {
    watchers.forEach(watcher => {
      if (watcher.callback && (!watcher.filter || watcher.filter(value))) {
        watcher.callback({ done: false, value });
      }
    });
  });

  return ({ filter, onError = defaultOnError }: Options = {}) => {
    let watcher: Watcher = { filter };
    let watching = true;
    const cleanup = () => {
      if (watching) {
        watching = false;
        watchers = watchers.filter(w => w !== watcher);
      }
    };
    try {
      return {
        next: () =>
          new Promise(resolve => {
            watcher.callback = resolve;
            watchers.push(watcher);
          }),
        return: () => {
          cleanup();
          return Promise.resolve({ done: true });
        },
        throw: err => {
          cleanup();
          onError(err);
          return Promise.reject(err);
        },
        [$$asyncIterator]() {
          return this;
        },
      };
    } catch (err) {
      onError(err);
    }
  };
};

export default asyncify;
