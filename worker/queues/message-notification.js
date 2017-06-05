// @flow
import createQueue from '../create-queue';
import { MESSAGE_NOTIFICATION } from './constants';

export default () =>
  createQueue(MESSAGE_NOTIFICATION, job => {
    // Generate and store message notification here
    console.log('\n-----NEW MESSAGE NOTIFICATION JOB-----');
    console.log(job.data);
  });
