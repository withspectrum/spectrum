// @flow
import axios from 'axios';
import { getUserById } from '../../models/user';
import { getThread } from '../../models/thread';
import { getCommunityById } from '../../models/community';
import { getChannelById } from '../../models/channel';
import { addQueue } from '../workerQueue';
import type { DBMessage } from 'shared/types';
import { toState, toPlainText } from 'shared/draft-utils';

export default (message: DBMessage) => {
  const text =
    message.messageType === 'draftjs'
      ? toPlainText(toState(JSON.parse(message.content.body)))
      : message.content.body;

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
      id: message.id,
    },
  })
    .then(async ({ data }) => {
      if (!data || !data.result) return;
      const { toxic, toxicityConfidence } = data.result;

      if (toxic) {
        const [user, thread] = await Promise.all([
          getUserById(message.senderId),
          getThread(message.threadId),
        ]);

        const [community, channel] = await Promise.all([
          getCommunityById(thread.communityId),
          getChannelById(thread.channelId),
        ]);

        return addQueue('admin toxic content email', {
          type: 'message',
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
