// @flow
// Turn a callback-based listener into an async iterator
const Queue = require('then-queue');

const asyncify = (
  listener: (...args: any[]) => any,
  onError?: Error => void
) => {
  let queues = [];
  listener((...args) => queues.map(q => q.push(...args)));

  return () => {
    const queue = new Queue();
    queues.push(queue);

    // I have no idea how to type generators...
    // $FlowFixMe
    async function* AsyncGenerator() {
      try {
        while (true) {
          yield await queue.pop();
        }
      } catch (err) {
        // Remove the error'ing queue from the queues array
        queues = queues.filter(q => q !== queue);
        onError && onError(err);
      }
    }

    return AsyncGenerator();
  };
};

export default asyncify;
