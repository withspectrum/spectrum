// @flow
const debug = require('debug')('athena:queue:moderation-events:thread');
import { getUserById } from 'shared/db/queries/user';
import { getCommunityById } from '../../models/community';
import { getChannelById } from '../../models/channel';
import { toState, toPlainText } from 'shared/draft-utils';
import getPerspectiveScore from './perspective';
import { _adminSendToxicContentEmailQueue } from 'shared/bull/queues';
import type { Job, AdminToxicThreadJobData } from 'shared/bull/types';

export default async (job: Job<AdminToxicThreadJobData>) => {
  debug('new job for admin thread moderation');

  const {
    data: { thread },
  } = job;

  const body =
    thread.type === 'DRAFTJS'
      ? thread.content.body
        ? toPlainText(toState(JSON.parse(thread.content.body)))
        : ''
      : thread.content.body || '';

  const title = thread.content.title;
  const text = `${title} ${body}`;

  const perspectiveScore = await getPerspectiveScore(text).catch(err =>
    console.error('Error getting thread moderation scores from providers', {
      error: err.message,
      data: {
        text,
        threadId: thread.id,
      },
    })
  );

  // if neither models returned results
  if (!perspectiveScore) return;

  const [user, community, channel] = await Promise.all([
    getUserById(thread.creatorId),
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
