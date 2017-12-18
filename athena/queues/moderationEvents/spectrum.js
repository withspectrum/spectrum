// @flow
import axios from 'axios';

export default async (text: string, contextId: string, userId: string) => {
  const request = await axios({
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
        meta: {
          authorId: userId,
        },
      },
      id: contextId,
    },
  });

  const { data } = request;

  if (!data || !data.result) return;

  const { toxic, toxicityConfidence } = data.result;

  if (toxic) return toxicityConfidence;

  return null;
};
