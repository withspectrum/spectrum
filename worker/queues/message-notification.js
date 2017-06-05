// @flow
import createQueue from '../create-queue';
import { MESSAGE_NOTIFICATION } from './contants';

export default () =>
  createQueue(MESSAGE_NOTIFICATION, job => {
    // Generate and store message notification here
    console.log('\n-----NEW MESSAGE NOTIFICATION JOB-----');
    console.log(job.data);
  });
