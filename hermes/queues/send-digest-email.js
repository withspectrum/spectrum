// @flow
const debug = require('debug')('hermes:queue:send-weekly-digest-email');
import sendEmail from '../send-email';
import { DIGEST_TEMPLATE } from './constants';
import Raven from 'shared/raven';
import { generateUnsubscribeToken } from '../utils/generate-jwt';
import { TYPE_DAILY_DIGEST, TYPE_WEEKLY_DIGEST } from './constants';
import formatDate from '../utils/format-date';
import type { Job, SendDigestEmailJobData } from 'shared/bull/types';

export default async (job: Job<SendDigestEmailJobData>): Promise<void> => {
  const {
    email,
    username,
    userId,
    threads,
    reputationString,
    communities,
    timeframe,
    hasOverflowThreads,
  } = job.data;

  if (!email || !userId || !username) {
    return Promise.resolve();
  }

  const unsubscribeType =
    timeframe === 'daily' ? TYPE_DAILY_DIGEST : TYPE_WEEKLY_DIGEST;

  const unsubscribeToken = await generateUnsubscribeToken(
    userId,
    unsubscribeType
  );

  if (!unsubscribeToken) return Promise.resolve();

  const tag =
    timeframe === 'daily'
      ? 'send daily digest email'
      : 'send weekly digest email';
  const subjectPrefix =
    timeframe === 'daily' ? 'Spectrum Daily Digest' : 'Spectrum Weekly Digest';

  const subjectStart =
    threads.length > 2
      ? `${threads[0].content.title}, ${threads[1].content.title}`
      : `${threads[0].content.title}`;

  const subjectEnd = ` and ${
    threads.length > 2 ? threads.length - 2 : threads.length - 1
  } more active conversations in your communities`;

  const subject = `${subjectPrefix}: ${subjectStart}${subjectEnd}`;

  const { day, month, year } = formatDate();

  const preheader =
    timeframe === 'daily'
      ? `Your Spectrum daily digest · ${month} ${day}, ${year}`
      : `Your Spectrum weekly digest · ${month} ${day}, ${year}`;

  try {
    return sendEmail({
      templateId: DIGEST_TEMPLATE,
      to: [{ email }],
      dynamic_template_data: {
        subject,
        preheader,
        unsubscribeToken,
        data: {
          hasOverflowThreads,
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
    console.error('❌ Error in job:\n');
    console.error(err);
    return Raven.captureException(err);
  }
};
