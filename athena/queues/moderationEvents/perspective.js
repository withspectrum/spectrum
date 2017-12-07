// @flow
import axios from 'axios';
const env = require('node-env-file');
const IS_PROD = process.env.NODE_ENV === 'production';
const path = require('path');
if (!IS_PROD) {
  env(path.resolve(__dirname, '../../.env'), { raise: false });
}
const PERSPECTIVE_API_KEY = process.env.PERSPECTIVE_API_KEY;

export default async (text: string) => {
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
  if (!request || !request.data) return;

  // get the scores from the request
  const { attributeScores } = request.data;

  // if nothing was returned for whatever reason
  if (!attributeScores) return null;

  const { TOXICITY } = attributeScores;

  // ensure the fields we want exist
  if (!TOXICITY || !TOXICITY.summaryScore) return null;

  const { value } = TOXICITY.summaryScore;

  // if the toxicity probability is above 50%, alert us
  if (value > 0.5) return value;

  return null;
};
