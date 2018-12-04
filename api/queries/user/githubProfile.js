// @flow
require('now-env');
import type { DBUser } from 'shared/types';
import cache from 'shared/cache/redis';
import fetch from 'isomorphic-fetch';
import { githubProfile } from 'shared/graphql-cache-keys';

const apiUrl = 'https://api.github.com';
const apiRoute = '/user/';
const { GITHUB_OAUTH_CLIENT_ID, GITHUB_OAUTH_CLIENT_SECRET } = process.env;
const queryString = `?client_id=${GITHUB_OAUTH_CLIENT_ID}&client_secret=${GITHUB_OAUTH_CLIENT_SECRET}`;
const fetchUrl = apiUrl + apiRoute + githubProviderId + queryString;

export default async ({ githubProviderId, id }: DBUser) => {
  if (!githubProviderId) return null;

  const cachedGithubProfile = await cache.get(githubProfile(id));

  if (cachedGithubProfile) {
    try {
      const parsed = JSON.parse(cachedGithubProfile);
      return {
        id: parsed.id,
        username: parsed.username,
      };
    } catch (err) {}
  } else {
    const networkGithubProfile = await fetch(fetchUrl)
      .then(res => res.json())
      .catch(err => {
        console.error('Error getting github info from github api', err);
        return null;
      });

    if (networkGithubProfile) {
      const cacheRecord = {
        id: networkGithubProfile.id,
        username: networkGithubProfile.login,
      };

      await cache.set(
        githubProfile(id),
        JSON.stringify(cacheRecord),
        'EX',
        86400
      );

      return cacheRecord;
    }

    return null;
  }
};
