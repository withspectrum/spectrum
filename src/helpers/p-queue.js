// @flow
// based on https://github.com/zeit/next.js/blob/82d56e063aad12ac8fee5b9d5ed24ccf725b1a5b/packages/next-server/lib/p-queue.js
// with adapted code style and flow types added
// which is itself based on https://github.com/sindresorhus/p-queue (MIT)
// modified for browser support

class Queue {
  _queue: Array<mixed>;

  constructor() {
    this._queue = [];
  }
  enqueue(run) {
    this._queue.push(run);
  }
  dequeue() {
    return this._queue.shift();
  }
  size() {
    return this._queue.length;
  }
}

type Options = {
  concurrency: number,
};

export default class PQueue {
  queue: any;
  _pendingCount: number;
  _concurrency: number;
  _resolveEmpty: Function;

  constructor(opts: Options) {
    opts = Object.assign(
      {
        concurrency: Infinity,
      },
      opts
    );

    if (opts.concurrency < 1) {
      throw new TypeError(
        'Expected `concurrency` to be a number from 1 and up'
      );
    }

    this.queue = new Queue();
    this._pendingCount = 0;
    this._concurrency = opts.concurrency;
    this._resolveEmpty = () => {};
  }
  _next() {
    this._pendingCount--;

    if (this.queue.size() > 0) {
      this.queue.dequeue()();
    } else {
      this._resolveEmpty();
    }
  }
  add<R>(fn: () => Promise<R>): Promise<R> {
    return new Promise((resolve, reject) => {
      const run = () => {
        this._pendingCount++;

        fn().then(
          val => {
            resolve(val);
            this._next();
          },
          err => {
            reject(err);
            this._next();
          }
        );
      };

      if (this._pendingCount < this._concurrency) {
        run();
      } else {
        this.queue.enqueue(run);
      }
    });
  }
  onEmpty(): Promise<void> {
    return new Promise(resolve => {
      const existingResolve = this._resolveEmpty;
      this._resolveEmpty = () => {
        existingResolve();
        resolve();
      };
    });
  }
  size() {
    return this.queue.size();
  }
  pending() {
    return this._pendingCount;
  }
}
