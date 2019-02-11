// @flow
const debug = require('debug')('chronos');
import Raven from 'shared/raven';
import createWorker from 'shared/bull/create-worker';
import processDailyDigest from 'chronos/queues/digests/dailyDigest';
import processWeeklyDigest from 'chronos/queues/digests/weeklyDigest';
import processSingleDigestEmail from 'chronos/queues/digests/processIndividualDigest';
import processDailyCoreMetrics from 'chronos/queues/coreMetrics';
import processActiveCommunityAdminReport from 'chronos/queues/coreMetrics/activeCommunityAdminReport';
import processRemoveSeenUsersNotifications from 'chronos/queues/remove-seen-usersNotifications';
import {
  PROCESS_WEEKLY_DIGEST_EMAIL,
  PROCESS_DAILY_DIGEST_EMAIL,
  PROCESS_INDIVIDUAL_DIGEST,
  PROCESS_DAILY_CORE_METRICS,
  PROCESS_ACTIVE_COMMUNITY_ADMIN_REPORT,
  PROCESS_REMOVE_SEEN_USERS_NOTIFICATIONS,
} from 'chronos/queues/constants';
import { startJobs } from 'chronos/jobs';

const PORT = parseInt(process.env.PORT, 10) || 3004;

debug('\n⏱ Chronos, the cron job worker, is starting...');
debug('Logging with debug enabled!\n');

const server = createWorker(
  {
    [PROCESS_WEEKLY_DIGEST_EMAIL]: processWeeklyDigest,
    [PROCESS_DAILY_DIGEST_EMAIL]: processDailyDigest,
    [PROCESS_INDIVIDUAL_DIGEST]: processSingleDigestEmail,
    [PROCESS_DAILY_CORE_METRICS]: processDailyCoreMetrics,
    [PROCESS_ACTIVE_COMMUNITY_ADMIN_REPORT]: processActiveCommunityAdminReport,
    [PROCESS_REMOVE_SEEN_USERS_NOTIFICATIONS]: processRemoveSeenUsersNotifications,
  },
  {
    settings: {
      lockDuration: 600000, // Key expiration time for job locks.
      maxStalledCount: 0, // Max amount of times a stalled job will be re-processed.
    },
  }
);

// start the jobs
startJobs();

// $FlowIssue
debug('🗄 Crons open for business');

// NOTE(@mxstbr): 511 is the default value, have to add that so flow
// doesn't complain. Ref: https://nodejs.org/api/net.html#net_server_listen_port_host_backlog_callback
server.listen(PORT, 'localhost', 511, () => {
  // prettier-ignore
  debug(`💉 Healthcheck server running at ${server.address().address}:${server.address().port}`);
});

process.on('unhandledRejection', async err => {
  console.error('Unhandled rejection', err);
  try {
    await new Promise(resolve => Raven.captureException(err, resolve));
  } catch (err) {
    console.error('Raven error', err);
  } finally {
    process.exit(1);
  }
});

process.on('uncaughtException', async err => {
  console.error('Uncaught exception', err);
  try {
    await new Promise(resolve => Raven.captureException(err, resolve));
  } catch (err) {
    console.error('Raven error', err);
  } finally {
    process.exit(1);
  }
});
