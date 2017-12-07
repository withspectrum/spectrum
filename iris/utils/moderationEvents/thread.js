// @flow
import { getUserById } from '../../models/user';
import { getCommunityById } from '../../models/community';
import { getChannelById } from '../../models/channel';
import { addQueue } from '../workerQueue';
import type { DBThread } from 'shared/types';
import { toState, toPlainText } from 'shared/draft-utils';
import getSpectrumScore from './spectrum';
import getPerspectiveScore from './perspective';

export default async (thread: DBThread) => {
  const body =
    thread.type === 'DRAFTJS'
      ? thread.content.body
        ? toPlainText(toState(JSON.parse(thread.content.body)))
        : ''
      : thread.content.body || '';

  const title = thread.content.title;
  const text = `${title} ${body}`;

  const [spectrumScore, perspectiveScore] = await Promise.all([
    getSpectrumScore(text, thread.id),
    getPerspectiveScore(text),
  ]);

  // if neither models returned results
  if (!spectrumScore && !perspectiveScore) return;

  const [user, community, channel] = await Promise.all([
    getUserById(thread.creatorId),
    getCommunityById(thread.communityId),
    getChannelById(thread.channelId),
  ]);

  try {
    return addQueue('admin toxic content email', {
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
  } catch (err) {
    console.log('\n\nerror getting message toxicity', err);
    return;
  }
};
