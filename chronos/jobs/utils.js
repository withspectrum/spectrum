const createQueue = require('./create-queue');

export const addQueue = (name: string, data: any, opts: any) => {
  const worker = createQueue(name);

  return worker.add({ ...data }, { ...opts });
};

export const createJob = (
  name: string, // name of the queue the cron job should trigger
  pattern: string, // cron pattern
  timeframe?: string // an optional parameter to get passed into the addQueue function for adding variance to the timeframe of a cronjob
) => {
  try {
    console.log('🕑 New cron job initiated: ' + name + ' - ' + timeframe);
    return addQueue(
      name,
      { timeframe },
      {
        removeOnComplete: true,
        removeOnFail: true,
        attempts: 1,
        repeat: { cron: pattern, tz: 'America/Los_Angeles' },
      }
    );
  } catch (err) {
    console.log('❌ Error processing cron job:\n' + err);
  }
};
