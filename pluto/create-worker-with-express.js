import EventEmitter from 'events';
import createQueue from 'shared/bull/create-queue';

const createWorker = queueMap => {
  // We add one error listener per queue, so we have to set the max listeners
  // to whatever it is set to + the amount of queues passed in
  EventEmitter.defaultMaxListeners =
    Object.keys(queueMap).length + EventEmitter.defaultMaxListeners;
  // Start processing the queues
  return Object.keys(queueMap).map(name => {
    const queue = createQueue(name);
    queue.process(queueMap[name]);
    return queue;
  });
};

export default createWorker;
