// @flow
const debug = require('debug')('hermes:queue:send-weekly-digest-email');
import sendEmail from '../send-email';
import { DIGEST_TEMPLATE } from './constants';

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
  threads: ThreadType,
  reputationString: string,
  communities: ?Array<TopCommunityType>,
  timeframe: 'daily' | 'weekly',
};

type SendWeeklyDigestJob = {
  data: SendWeeklyDigestJobData,
  id: string,
};

export default (job: SendWeeklyDigestJob) => {
  debug(`\nnew job: ${job.id}`);
  debug(`\nsending weekly digest to: ${job.data.email}`);

  const {
    email,
    name,
    username,
    threads,
    communities,
    timeframe,
    reputationString,
  } = job.data;
  if (!email) {
    debug(`\nno email found for this weekly digest, returning`);
    return;
  }

  const greeting = name ? `Hey ${name},` : 'Hey there,';

  try {
    return sendEmail({
      TemplateId: DIGEST_TEMPLATE,
      To: email,
      TemplateModel: {
        threads,
        greeting,
        communities,
        reputationString,
        username,
        timeframe: {
          subject: timeframe,
          time: timeframe === 'daily' ? 'day' : 'week',
        },
      },
    });
  } catch (err) {
    console.log(err);
  }
};
