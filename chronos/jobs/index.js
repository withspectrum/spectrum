// @flow
import { defaultJobOptions } from './utils';

import {
  weeklyDigestQueue,
  dailyDigestQueue,
  dailyCoreMetricsQueue,
  activeCommunityReportQueue,
  removeSeenUsersNotificationsQueue,
  databaseBackupQueue,
  offsiteBackupQueue,
} from 'shared/bull/queues';

/*
  None of the cron-job initaliziers need data in the Job, so we pass undefined
  as the data argument to the queue
*/

export const weeklyDigest = () => {
  // monday morning
  return weeklyDigestQueue.add(undefined, defaultJobOptions('0 6 * * 1'));
};

export const dailyDigest = () => {
  // end of day, every day
  return dailyDigestQueue.add(undefined, defaultJobOptions('0 19 * * *'));
};

export const dailyCoreMetrics = () => {
  // midnight daily
  return dailyCoreMetricsQueue.add(undefined, defaultJobOptions('0 0 * * *'));
};

export const activeCommunityReport = () => {
  // 1am daily
  return activeCommunityReportQueue.add(
    undefined,
    defaultJobOptions('0 1 * * *')
  );
};

export const hourlyBackups = () => {
  // Every hour
  return databaseBackupQueue.add(undefined, defaultJobOptions('30 * * * *'));
};

export const hourlyOffsiteBackup = () => {
  // Every hour offset by 30m from hourly backups, which should be enough time for the backups to finish
  return offsiteBackupQueue.add(undefined, defaultJobOptions('0 * * * *'));
};

export const removeSeenUsersNotifications = () => {
  // 2am daily
  return removeSeenUsersNotificationsQueue.add(
    undefined,
    defaultJobOptions('0 2 * * *')
  );
};

export const startJobs = () => {
  weeklyDigest();
  dailyDigest();
  dailyCoreMetrics();
  activeCommunityReport();
  removeSeenUsersNotifications();
  hourlyBackups();
  hourlyOffsiteBackup();
};
