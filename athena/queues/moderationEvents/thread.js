// @flow
const debug = require('debug')('athena:queue:channel-notification');
import { getUserById } from '../../models/user';
import { getCommunityById } from '../../models/community';
import { getChannelById } from '../../models/channel';
import type { DBThread } from 'shared/types';
import { toState, toPlainText } from 'shared/draft-utils';
import getSpectrumScore from './spectrum';
import getPerspectiveScore from './perspective';
import { _adminSendToxicContentEmailQueue } from 'shared/bull/queues';
import type { Job, AdminToxicThreadJobData } from 'shared/bull/types';

export default async (job: Job<AdminToxicThreadJobData>) => {
  debug('new job for admin thread moderation');

  const { data: { thread } } = job;

  const body =
    thread.type === 'DRAFTJS'
      ? thread.content.body
        ? toPlainText(toState(JSON.parse(thread.content.body)))
        : ''
      : thread.content.body || '';

  const title = thread.content.title;
  const text = `${title} ${body}`;

  const scores = await Promise.all([
    getSpectrumScore(text, thread.id, thread.creatorId),
    getPerspectiveScore(text),
  ]).catch(err =>
    console.log('Error getting thread moderation scores from providers', err)
  );

  const spectrumScore = scores && scores[0];
  const perspectiveScore = scores && scores[1];

  // if neither models returned results
  if (!spectrumScore && !perspectiveScore) return;

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
      spectrumScore,
      perspectiveScore,
    },
  });
};
