// @flow
const debug = require('debug')('chronos');
const createWorker = require('./jobs/bull/create-worker');
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

const PORT = process.env.PORT || 3004;

console.log('\n✉️ Chronos, the cron job worker, is starting...');
debug('Logging with debug enabled!');
console.log('');

const server = createWorker({
  [PROCESS_WEEKLY_DIGEST_EMAIL]: processDataForDigest,
  [PROCESS_DAILY_DIGEST_EMAIL]: processDataForDigest,
  [PROCESS_INDIVIDUAL_DIGEST]: processSingleDigestEmail,
  [PROCESS_DAILY_CORE_METRICS]: processDailyCoreMetrics,
  [PROCESS_ACTIVE_COMMUNITY_ADMIN_REPORT]: processActiveCommunityAdminReport,
});

// start the jobs
weeklyDigest();
dailyDigest();
dailyCoreMetrics();
// activeCommunityReport();

// $FlowIssue
console.log(
  `🗄 Crons open for business ${process.env.NODE_ENV === 'production'
    ? 'in production'
    : 'locally'}`
);

server.listen(PORT, 'localhost', () => {
  console.log(
    `💉 Healthcheck server running at ${server.address()
      .address}:${server.address().port}`
  );
});
