// @flow
const debug = require('debug')('chronos');
import createWorker from 'shared/bull/create-worker';
import processDataForDigest from './queues/digests';
import processSingleDigestEmail from './queues/digests/processDigestEmail';
import processDailyCoreMetrics from './queues/coreMetrics';
import processActiveCommunityAdminReport from './queues/coreMetrics/activeCommunityAdminReport';
import {
  PROCESS_WEEKLY_DIGEST_EMAIL,
  PROCESS_DAILY_DIGEST_EMAIL,
  PROCESS_INDIVIDUAL_DIGEST,
  PROCESS_DAILY_CORE_METRICS,
  PROCESS_ACTIVE_COMMUNITY_ADMIN_REPORT,
} from './queues/constants';
import {
  weeklyDigest,
  dailyDigest,
  dailyCoreMetrics,
  activeCommunityReport,
} from './jobs';

const PORT = parseInt(process.env.PORT, 10) || 3004;

console.log('\n✉️ Chronos, the cron job worker, is starting...');
debug('Logging with debug enabled!');
console.log('');

const server = createWorker(
  {
    [PROCESS_WEEKLY_DIGEST_EMAIL]: processDataForDigest,
    [PROCESS_DAILY_DIGEST_EMAIL]: processDataForDigest,
    [PROCESS_INDIVIDUAL_DIGEST]: processSingleDigestEmail,
    [PROCESS_DAILY_CORE_METRICS]: processDailyCoreMetrics,
    [PROCESS_ACTIVE_COMMUNITY_ADMIN_REPORT]: processActiveCommunityAdminReport,
  },
  {
    settings: {
      lockDuration: 600000, // Key expiration time for job locks.
      stalledInterval: 0, // How often check for stalled jobs (use 0 for never checking).
      maxStalledCount: 0, // Max amount of times a stalled job will be re-processed.
    },
  }
);

// start the jobs
weeklyDigest();
dailyDigest();
dailyCoreMetrics();
activeCommunityReport();

// $FlowIssue
console.log(
  `🗄 Crons open for business ${
    process.env.NODE_ENV === 'production' ? 'in production' : 'locally'
  }`
);

// NOTE(@mxstbr): 511 is the default value, have to add that so flow
// doesn't complain. Ref: https://nodejs.org/api/net.html#net_server_listen_port_host_backlog_callback
server.listen(PORT, 'localhost', 511, () => {
  console.log(
    `💉 Healthcheck server running at ${server.address().address}:${
      server.address().port
    }`
  );
});
