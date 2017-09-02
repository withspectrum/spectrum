// @flow
const debug = require('debug')('hermes:queue:send-weekly-digest-email');
import sendEmail from '../send-email';
import { WEEKLY_DIGEST_TEMPLATE } from './constants';

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
  channelId: string,
  title: string,
  threadId: string,
};

type SendWeeklyDigestJobData = {
  email: string,
  name?: string,
  userId: string,
  threads: ThreadType,
  communities?: Array<TopCommunityType>,
};

type SendWeeklyDigestJob = {
  data: SendWeeklyDigestJobData,
  id: string,
};

export default (job: SendWeeklyDigestJob) => {
  debug(`\nnew job: ${job.id}`);
  debug(`\nsending weekly digest to: ${job.data.email}`);

  const { email, name, threads, communities } = job.data;
  if (!email) return;

  const greeting = name ? `Hey ${name},` : 'Hey there,';

  try {
    return sendEmail({
      TemplateId: WEEKLY_DIGEST_TEMPLATE,
      To: email,
      TemplateModel: {
        threads,
        greeting,
        communities,
      },
    });
  } catch (err) {
    console.log(err);
  }
};
