// @flow
const debug = require('debug')('athena:queue:moderation-events:spectrum');
require('now-env');
import axios from 'axios';
const SPECTRUM_MODERATION_API_KEY = process.env.SPECTRUM_MODERATION_API_KEY;

if (!SPECTRUM_MODERATION_API_KEY) {
  debug('No API key for Spectrum provided, not sending moderation events.');
}

export default async (text: string, contextId: string, userId: string) => {
  if (!SPECTRUM_MODERATION_API_KEY) return;

  const request = await axios({
    method: 'post',
    url: 'https://api.prod.getspectrum.io/api/v1/classification',
    headers: {
      Authorization: `Apikey ${SPECTRUM_MODERATION_API_KEY}`,
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
