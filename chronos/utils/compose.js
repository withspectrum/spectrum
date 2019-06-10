// @flow
import fetch from 'node-fetch';

const COMPOSE_API_TOKEN = process.env.COMPOSE_API_TOKEN;

export const COMPOSE_DEPLOYMENT_ID = '5cd38bcf9c5cab000b617356';

export const compose = (path: string, fetchOptions?: Object = {}) => {
  if (!COMPOSE_API_TOKEN) {
    throw new Error('Please specify the COMPOSE_API_TOKEN env var.');
  }
  return fetch(`https://api.compose.io/${path}`, {
    ...fetchOptions,
    headers: {
      'Content-Type': 'application/json',
      ...(fetchOptions.headers || {}),
      Authorization: `Bearer ${COMPOSE_API_TOKEN}`,
    },
  });
};
