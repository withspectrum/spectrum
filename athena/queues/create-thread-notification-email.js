// @flow
const debug = require('debug')('athena:queue:create-thread-email');
import Raven from '../../shared/raven';
import truncate from 'shared/truncate';
import getEmailStatus from '../utils/get-email-status';
import { getUserById } from '../models/user';
import { getCommunityById } from '../models/community';
import { getChannelById } from '../models/channel';
import { SEND_THREAD_CREATED_NOTIFICATION_EMAIL } from './constants';
import { toPlainText, toState } from 'shared/draft-utils';
import addQueue from '../utils/addQueue';
import type { DBThread, DBUser } from 'shared/types';

const createThreadNotificationEmail = async (
  thread: DBThread,
  recipients: Array<DBUser>
) => {
  const creator = await getUserById(thread.creatorId);
  const community = await getCommunityById(thread.communityId);
  const channel = await getChannelById(thread.channelId);

  const emailPromises = recipients.map(async recipient => {
    // no way to send the user an email
    // if the user doesn't have a username, they have no way to access
    // user settings from the frontend, so an email will be worthless
    if (!recipient.email || !recipient.username) return;

    const shouldSendEmail = await getEmailStatus(
      recipient.id,
      'newThreadCreated'
    );
    // user is either online or has this notif type turned off
    if (!shouldSendEmail) return;

    // at this point the email is safe to send, construct data for Hermes
    const rawBody =
      thread.type === 'DRAFTJS'
        ? toPlainText(toState(JSON.parse(thread.content.body || '')))
        : thread.content.body || '';

    // if the body is long, truncate it at 280 characters for the email preview
    const body =
      rawBody && rawBody.length > 10 ? truncate(rawBody, 280) : rawBody;
    const primaryActionLabel = 'View conversation';

    return addQueue(
      SEND_THREAD_CREATED_NOTIFICATION_EMAIL,
      {
        recipient,
        primaryActionLabel,
        thread: {
          ...thread,
          creator,
          community,
          channel,
          content: {
            title: thread.content.title,
            body,
          },
        },
      },
      {
        removeOnComplete: true,
        removeOnFail: true,
      }
    );
  });

  // send all the emails
  return Promise.all([emailPromises]).catch(err => {
    debug('❌ Error in job:\n');
    debug(err);
    Raven.captureException(err);
    console.log(err);
  });
};

export default createThreadNotificationEmail;
