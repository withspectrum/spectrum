// @flow
import type { JobOptions } from 'shared/bull/types';

export const defaultJobOptions = (pattern: string): JobOptions => ({
  removeOnComplete: true,
  removeOnFail: true,
  attempts: 1,
  repeat: {
    cron: pattern,
    tz: 'America/Los_Angeles',
  },
});
