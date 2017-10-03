// @flow
import Raven from 'raven';
// $FlowIssue
import commitHash from 'shared/get-commit-hash';
const createQueue = require('../../shared/bull/create-queue');
if (process.env.NODE_ENV !== 'development') {
  Raven.config(
    'https://3bd8523edd5d43d7998f9b85562d6924:d391ea04b0dc45b28610e7fad735b0d0@sentry.io/154812',
    {
      environment: process.env.NODE_ENV,
      release: commitHash,
      tags: { git_commit: commitHash },
    }
  ).install();
}

export const addQueue = (name: string, data: any) => {
  const worker = createQueue(name);
  return worker
    .add(
      { ...data },
      {
        removeOnComplete: true,
        removeOnFail: true,
      }
    )
    .catch(err => Raven.captureException(err));
};
