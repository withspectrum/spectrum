// @flow
import axios from 'axios';
import { getUserById } from '../../models/user';
import { getCommunityById } from '../../models/community';
import { getChannelById } from '../../models/channel';
import { addQueue } from '../workerQueue';
import type { DBThread } from 'shared/types';
import { toState, toPlainText } from 'shared/draft-utils';

export default (thread: DBThread) => {
  const body =
    thread.type === 'draftjs'
      ? thread.content.body
        ? toPlainText(toState(JSON.parse(thread.content.body)))
        : ''
      : thread.content.body || '';

  const title = thread.content.title;
  const text = `${title} ${body}`;

  return axios({
    method: 'post',
    url: 'https://api.prod.getspectrum.io/api/v1/classification',
    headers: {
      Authorization: 'Apikey 205276812f89fcec2856d48c9192b2588',
      'Content-Type': 'application/json',
    },
    data: {
      jsonrpc: '2.0',
      method: 'classifyText',
      params: {
        text: text,
      },
      id: thread.id,
    },
  })
    .then(async ({ data }) => {
      if (!data || !data.response) return;

      const { toxic, toxicityConfidence } = data.response;

      if (toxic) {
        const [user, community, channel] = await Promise.all([
          getUserById(thread.creatorId),
          getCommunityById(thread.communityId),
          getChannelById(thread.channelId),
        ]);

        return addQueue('admin toxic content email', {
          type: 'thread',
          text,
          user,
          thread,
          community,
          channel,
          toxicityConfidence,
        });
      }

      return null;
    })
    .catch(error => {
      console.log('\n\nerror getting message toxicity', error);
      return;
    });
};
