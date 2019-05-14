// @flow
const debug = require('debug')('chronos:queue:database-backup');
const fetch = require('node-fetch');

const processJob = async () => {
  if (!process.env.COMPOSE_API_TOKEN) {
    console.warn(
      'Cannot start hourly backup, COMPOSE_API_TOKEN env variable is missing.'
    );
    return;
  }
  debug('pinging compose to start on-demand db backup');
  const result = await fetch(
    'https://api.compose.io/2016-07/deployments/5cd38bcf9c5cab000b617356/backups',
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${process.env.COMPOSE_API_TOKEN}`,
      },
    }
  );
  const json = await result.json();
  debug(json);
  return;
};

export default processJob;
