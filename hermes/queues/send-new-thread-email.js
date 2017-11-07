// @flow
const debug = require('debug')('hermes:queue:send-new-thread-email');
import sendEmail from '../send-email';
import truncate from 'shared/truncate';
import { generateUnsubscribeToken } from '../utils/generate-jwt';
import {
  NEW_THREAD_CREATED_TEMPLATE,
  TYPE_NEW_THREAD_CREATED,
  TYPE_MUTE_CHANNEL,
  TYPE_MUTE_COMMUNITY,
  DEBUG_TEMPLATE,
} from './constants';

type SendNewThreadNotificationJobData = {
  recipient: {
    id: string,
    email: string,
    username: string,
  },
  primaryActionLabel: string,
  thread: {
    community: {
      id: string,
      slug: string,
      profilePhoto: string,
      name: string,
    },
    creator: {
      profilePhoto: string,
      username: string,
      name: string,
    },
    channel: {
      id: string,
      name: string,
    },
    id: string,
    content: {
      title: string,
      body?: string,
    },
  },
};

type SendNewThreadEmailJob = {
  data: SendNewThreadNotificationJobData,
  id: string,
};

export default async (job: SendNewThreadEmailJob) => {
  const { recipient, thread, primaryActionLabel } = job.data;

  debug(`\nnew job: ${job.id}`);
  debug(`\nsending new thread email to: ${recipient.email}`);

  const unsubscribeToken = await generateUnsubscribeToken(
    recipient.id,
    TYPE_NEW_THREAD_CREATED
  );

  if (!unsubscribeToken || !recipient.email) return;

  const subject = `${truncate(thread.content.title, 80)} by ${thread.creator
    .name} · ${thread.community.name} (${thread.channel.name})`;
  const preheader = thread.content.body
    ? truncate(thread.content.body, 80)
    : `Published just now`;

  try {
    return sendEmail({
      TemplateId: NEW_THREAD_CREATED_TEMPLATE,
      To: recipient.email,
      TemplateModel: {
        subject,
        preheader,
        data: {
          thread,
          primaryActionLabel,
        },
        recipient,
        unsubscribeToken,
        muteChannelToken: generateUnsubscribeToken(
          recipient.id,
          TYPE_MUTE_CHANNEL,
          thread.channel.id
        ),
        muteCommunityToken: generateUnsubscribeToken(
          recipient.id,
          TYPE_MUTE_COMMUNITY,
          thread.community.id
        ),
      },
    });
  } catch (err) {
    console.log(err);
  }
};
