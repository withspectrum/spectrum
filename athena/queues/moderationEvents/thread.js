// @flow
const debug = require('debug')('athena:queue:channel-notification');
import { getUserById } from '../../models/user';
import { getCommunityById } from '../../models/community';
import { getChannelById } from '../../models/channel';
import { getUserPermissionsInCommunity } from '../../models/usersCommunities';
import { addQueue } from '../../utils/addQueue';
import type { DBThread } from 'shared/types';
import { toState, toPlainText } from 'shared/draft-utils';
import getSpectrumScore from './spectrum';
import getPerspectiveScore from './perspective';

type JobData = {
  data: {
    thread: DBThread,
  },
};

export default async (job: JobData) => {
  debug('new job for admin thread moderation');

  const { data: { thread } } = job;

  const [user, community, channel, permissions] = await Promise.all([
    getUserById(thread.creatorId),
    getCommunityById(thread.communityId),
    getChannelById(thread.channelId),
    getUserPermissionsInCommunity(thread.communityId, thread.creatorId),
  ]);

  const body =
    thread.type === 'DRAFTJS'
      ? thread.content.body
        ? toPlainText(toState(JSON.parse(thread.content.body)))
        : ''
      : thread.content.body || '';

  const title = thread.content.title;
  const text = `${title} ${body}`;

  const meta = {
    authorId: thread.creatorId,
    communityId: community.id,
    joinedCommunityAt: permissions.createdAt,
    joinedSpectrumAt: user.createdAt,
    reputation: permissions.reputation,
    communityRole: permissions.isOwner
      ? 'owner'
      : permissions.isModerator
        ? 'moderator'
        : permissions.isMember ? 'member' : null,
  };

  const scores = await Promise.all([
    getSpectrumScore(text, thread.id, meta),
    getPerspectiveScore(text),
  ]).catch(err =>
    console.log('Error getting thread moderation scores from providers', err)
  );

  const spectrumScore = scores && scores[0];
  const perspectiveScore = scores && scores[1];

  // if neither models returned results
  if (!spectrumScore && !perspectiveScore) return;

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
