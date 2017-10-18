// @flow
// Turn a callback-based listener into an async iterator
const Queue = require('then-queue');

const asyncify = (
  listener: (...args: any[]) => any,
  onError?: Error => void
) => {
  const queue = new Queue();

  listener(
    (...args) => console.log('push value onto queue') || queue.push(...args)
  );

  // I have no idea how to type generators...
  // $FlowFixMe
  async function* AsyncGenerator() {
    try {
      while (true) {
        console.log('wait for queue to pop');
        yield await queue.pop();
        console.log('queue popped, value pulled');
      }
    } catch (err) {
      onError && onError(err);
    }
  }

  return AsyncGenerator;
};

export default asyncify;
