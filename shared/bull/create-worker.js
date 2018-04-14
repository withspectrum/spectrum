// @flow
// Create a worker with bull and start a small webserver which responds with
// health information
const http = require('http');
const EventEmitter = require('events');
const createQueue = require('./create-queue');
const Raven = require('shared/raven');
import type { Queues } from './types';
import toobusy from '../middlewares/toobusy';

type QueueMap = {
  [name: string]: (job: Object) => ?Promise<any>,
};

// Helper function to sum properties of an array of objects
// e.g. [{ completed: 6 }, { completed: 2 }] => 8
const sumArr = (input: Array<Object>, prop: string) => {
  return input.reduce((sum, item) => sum + item[prop], 0);
};

const createWorker = (queueMap: QueueMap, queueOptions?: Object = {}) => {
  // We add one error listener per queue, so we have to set the max listeners
  // to whatever it is set to + the amount of queues passed in
  // $FlowIssue
  EventEmitter.defaultMaxListeners =
    // $FlowIssue
    Object.keys(queueMap).length + EventEmitter.defaultMaxListeners;
  // Start processing the queues
  const queues = Object.keys(queueMap).map(name => {
    const queue = createQueue(name, queueOptions);
    queue.process(queueMap[name]);
    return queue;
  });

  // Return the job count when requesting anything via HTTP
  return http.createServer((req, res) => {
    toobusy(req, res, () => {
      res.setHeader('Content-Type', 'application/json');
      // Summarize the data across all the queues
      Promise.all(queues.map(queue => queue.getJobCounts())).then(jobCounts => {
        const data = {
          waiting: sumArr(jobCounts, 'waiting'),
          active: sumArr(jobCounts, 'active'),
          completed: sumArr(jobCounts, 'completed'),
          failed: sumArr(jobCounts, 'failed'),
          delayed: sumArr(jobCounts, 'delayed'),
        };

        res.end(JSON.stringify(data, null, 2));
      });
    });
  });
};

module.exports = createWorker;
