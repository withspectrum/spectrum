// @flow
const debug = require('debug')('athena:queue:create-thread-email');
import Raven from '../../shared/raven';
import truncate from 'shared/truncate';
import getEmailStatus from '../utils/get-email-status';
import { getUserById } from 'shared/db/queries/user';
import { getCommunityById } from '../models/community';
import { getChannelById } from '../models/channel';
import { toPlainText, toState } from 'shared/draft-utils';
import { sendThreadCreatedNotificationEmailQueue } from 'shared/bull/queues';
import type { DBThread, DBUser } from 'shared/types';
import { signCommunity, signUser, signThread } from 'shared/imgix';

const createThreadNotificationEmail = async (
  thread: DBThread,
  recipients: Array<DBUser>
) => {
  const [creator, community, channel] = await Promise.all([
    getUserById(thread.creatorId),
    getCommunityById(thread.communityId),
    getChannelById(thread.channelId),
  ]);

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

    const signedThread = signThread(thread);

    // at this point the email is safe to send, construct data for Hermes
    const rawBody =
      thread.type === 'DRAFTJS'
        ? signedThread.content.body
          ? toPlainText(toState(JSON.parse(signedThread.content.body)))
          : ''
        : signedThread.content.body || '';

    // if the body is long, truncate it at 280 characters for the email preview
    const body = rawBody && truncate(rawBody.trim(), 280);

    const primaryActionLabel = 'View conversation';

    const signedCommunity = signCommunity(community);
    const signedCreator = signUser(creator);

    return sendThreadCreatedNotificationEmailQueue.add({
      // $FlowIssue
      recipient,
      primaryActionLabel,
      thread: {
        ...thread,
        // $FlowIssue
        creator: signedCreator,
        community: signedCommunity,
        channel,
        content: {
          title: thread.content.title,
          body,
        },
      },
    });
  });

  // send all the emails
  return Promise.all([emailPromises]).catch(err => {
    console.error('❌ Error in job:\n');
    console.error(err);
    Raven.captureException(err);
  });
};

export default createThreadNotificationEmail;
