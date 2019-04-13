// @flow
const debug = require('debug')('athena:queue:moderation-events:perspective');
require('now-env');
import axios from 'axios';
const PERSPECTIVE_API_KEY = process.env.PERSPECTIVE_API_KEY;

if (!PERSPECTIVE_API_KEY) {
  debug('No API key for Perspective provided, not sending moderation events.');
}

export default async (text: string) => {
  if (!PERSPECTIVE_API_KEY) return;
  // $FlowFixMe
  const request = await axios({
    method: 'post',
    // $FlowIssue
    url: `https://commentanalyzer.googleapis.com/v1alpha1/comments:analyze?key=${PERSPECTIVE_API_KEY}`,
    headers: {
      'Content-Type': 'application/json',
    },
    data: {
      comment: {
        text,
      },
      requestedAttributes: {
        TOXICITY: {},
      },
    },
  });

  // if something failed?
  if (!request || !request.data) return null;

  // get the scores from the request
  const { attributeScores } = request.data;

  // if nothing was returned for whatever reason
  if (!attributeScores) return null;

  const { TOXICITY } = attributeScores;

  // ensure the fields we want exist
  if (!TOXICITY || !TOXICITY.summaryScore) return null;

  const { value } = TOXICITY.summaryScore;

  // if the toxicity probability is above 50%, alert us
  if (value > 0.9) return value;

  return null;
};
