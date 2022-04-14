// @flow
import type { DBUser } from 'shared/types';

export default ({ githubProviderId, githubUsername }: DBUser) => {
  if (!githubProviderId || !githubUsername) return null;
  return {
    id: githubProviderId,
    username: githubUsername,
  };
};
