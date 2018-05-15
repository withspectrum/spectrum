// @flow
const debug = require('debug')('hermes:queue:send-weekly-digest-email');
import sendEmail from '../send-email';
import { DIGEST_TEMPLATE } from './constants';
import Raven from 'shared/raven';
import { generateUnsubscribeToken } from '../utils/generate-jwt';
import { TYPE_DAILY_DIGEST, TYPE_WEEKLY_DIGEST } from './constants';
import formatDate from '../utils/format-date';

type ChannelType = {
  name: string,
  slug: string,
};

type CommunityType = {
  name: string,
  slug: string,
  profilePhoto: string,
};

type TopCommunityType = {
  name: string,
  slug: string,
  profilePhoto: string,
  coverPhoto: string,
  description: string,
  id: string,
};

type ThreadType = {
  community: CommunityType,
  channel: ChannelType,
  channelId: string,
  title: string,
  threadId: string,
  messageCountString: string,
};

type SendWeeklyDigestJobData = {
  email: string,
  name?: string,
  username: string,
  userId: string,
  threads: Array<ThreadType>,
  reputationString: string,
  communities: ?Array<TopCommunityType>,
  timeframe: 'daily' | 'weekly',
};

type SendWeeklyDigestJob = {
  data: SendWeeklyDigestJobData,
  id: string,
};

export default async (job: SendWeeklyDigestJob) => {
  debug(`\nnew job: ${job.id}`);
  debug(`\nsending weekly digest to: ${job.data.email}`);

  const {
    email,
    userId,
    username,
    threads,
    communities,
    timeframe,
    reputationString,
  } = job.data;
  if (!email || !userId) {
    debug('\nno email or userId found for this weekly digest, returning');
    return;
  }

  const unsubscribeType =
    timeframe === 'daily' ? TYPE_DAILY_DIGEST : TYPE_WEEKLY_DIGEST;
  const unsubscribeToken = await generateUnsubscribeToken(
    userId,
    unsubscribeType
  );

  if (!unsubscribeToken) return;

  const tag =
    timeframe === 'daily'
      ? 'send daily digest email'
      : 'send weekly digest email';
  const subjectPrefix =
    timeframe === 'daily' ? 'Spectrum Daily Digest' : 'Spectrum Weekly Digest';
  const subjectStart =
    threads.length > 2
      ? `${threads[0].title}, ${threads[1].title}`
      : `${threads[0].title}`;
  const subjectEnd = ` and ${
    threads.length > 2 ? threads.length - 2 : threads.length - 1
  } more active conversations in your communities`;
  const subject = `${subjectPrefix}: ${subjectStart}${subjectEnd}`;
  const { day, month, year } = formatDate();
  const preheader =
    timeframe === 'daily'
      ? `Your Spectrum daily digest · ${month} ${day}, ${year}`
      : 'Your Spectrum weekly digest';

  try {
    return sendEmail({
      TemplateId: DIGEST_TEMPLATE,
      To: email,
      Tag: tag,
      TemplateModel: {
        subject,
        preheader,
        unsubscribeToken,
        data: {
          username,
          threads,
          communities,
          reputationString,
          timeframe: {
            subject: timeframe,
            time: timeframe === 'daily' ? 'day' : 'week',
          },
        },
      },
      userId,
    });
  } catch (err) {
    debug('❌ Error in job:\n');
    debug(err);
    Raven.captureException(err);
  }
};
