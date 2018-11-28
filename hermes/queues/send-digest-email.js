// @flow
const debug = require('debug')('hermes:queue:send-weekly-digest-email');
import sendEmail from '../send-email';
import { DIGEST_TEMPLATE } from './constants';
import Raven from 'shared/raven';
import { generateUnsubscribeToken } from '../utils/generate-jwt';
import { TYPE_DAILY_DIGEST, TYPE_WEEKLY_DIGEST } from './constants';
import formatDate from '../utils/format-date';
import type { Job, SendDigestEmailJobData } from 'shared/bull/types';

export default async (job: Job<SendDigestEmailJobData>) => {
  const {
    email,
    username,
    userId,
    threads,
    reputationString,
    communities,
    timeframe,
  } = job.data;

  if (!email || !userId || !username) {
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
