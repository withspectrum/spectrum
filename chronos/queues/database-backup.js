// @flow
const debug = require('debug')('chronos:queue:database-backup');
const { compose, COMPOSE_DEPLOYMENT_ID } = require('../utils/compose');

const processJob = async () => {
  debug('pinging compose to start on-demand db backup');
  const result = await compose(
    `2016-07/deployments/${COMPOSE_DEPLOYMENT_ID}/backups`,
    {
      method: 'POST',
    }
  );
  const json = await result.json();
  debug(json);
  return;
};

export default processJob;
