// @flow
import AWS from 'aws-sdk';
const https = require('https');
const { compose, COMPOSE_DEPLOYMENT_ID } = require('../utils/compose');

AWS.config.update({
  accessKeyId: process.env.S3_TOKEN || 'asdf123',
  secretAccessKey: process.env.S3_SECRET || 'asdf123',
  apiVersions: {
    s3: 'latest',
  },
});
const s3 = new AWS.S3();

export default async () => {
  const backupListResult = await compose(
    `2016-07/deployments/${COMPOSE_DEPLOYMENT_ID}/backups`
  );

  const backupListJson = await backupListResult.json();

  if (!backupListJson._embedded || !backupListJson._embedded.backups) {
    console.error(
      `Failed to load list of backups of deployment ${COMPOSE_DEPLOYMENT_ID}.`
    );
    return;
  }

  const newestBackup = backupListJson._embedded.backups
    .filter(backup => backup.is_downloadable)
    .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))[0];

  if (!newestBackup) {
    console.error('Failed to find latest backup.');
    return;
  }

  const backupResult = await compose(
    `2016-07/deployments/${COMPOSE_DEPLOYMENT_ID}/backups/${newestBackup.id}`
  );
  const backupJson = await backupResult.json();

  await new Promise((resolve, reject) => {
    https.get(backupJson.download_link, response => {
      s3.upload(
        {
          Body: response,
          Bucket: `spectrum-chat/backups`,
          Key: backupJson.name,
        },
        function(err) {
          if (err) {
            console.error(err);
            return reject(err);
          }
          return resolve();
        }
      );
    });
  });
};
