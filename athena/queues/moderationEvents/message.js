// @flow
const debug = require('debug')('athena:queue:moderation-events:message');
import { getUserById } from 'shared/db/queries/user';
import { getThreadById } from '../../models/thread';
import { getCommunityById } from '../../models/community';
import { getChannelById } from '../../models/channel';
import { toState, toPlainText } from 'shared/draft-utils';
import getPerspectiveScore from './perspective';
import { _adminSendToxicContentEmailQueue } from 'shared/bull/queues';
import type { Job, AdminToxicMessageJobData } from 'shared/bull/types';
import { messageTypeObj } from 'shared/draft-utils/process-message-content';

export default async (job: Job<AdminToxicMessageJobData>) => {
  debug('new job for admin message moderation');
  const {
    data: { message },
  } = job;

  const text =
    message.messageType === messageTypeObj.draftjs
      ? toPlainText(toState(JSON.parse(message.content.body)))
      : message.content.body;

  const perspectiveScore = await getPerspectiveScore(text).catch(err =>
    console.error('Error getting message moderation score from providers', {
      error: err.message,
      data: {
        text,
        threadId: message.id,
      },
    })
  );

  if (!perspectiveScore) return;

  const [user, thread] = await Promise.all([
    getUserById(message.senderId),
    getThreadById(message.threadId),
  ]);

  const [community, channel] = await Promise.all([
    getCommunityById(thread.communityId),
    getChannelById(thread.channelId),
  ]);

  return _adminSendToxicContentEmailQueue.add({
    type: 'message',
    text,
    user,
    thread,
    community,
    channel,
    toxicityConfidence: {
      perspectiveScore,
    },
  });
};
