const createQueue = require('../../shared/bull/create-queue');

export const addQueue = (name: string, data: any, opts: any) => {
  const worker = createQueue(name);

  return worker.add({ ...data }, { ...opts });
};

export const createJob = (
  name: string, // name of the queue the cron job should trigger
  pattern: string, // cron pattern
  timeframe?: string // an optional parameter to get passed into the addQueue function for adding variance to the timeframe of a cronjob
) => {
  console.log('inserting job at createJob');
  try {
    console.log('🕑 New cron job initiated: ' + name + ' - ' + timeframe);
    return addQueue(
      name,
      { timeframe },
      {
        repeat: { cron: pattern, tz: 'America/Los_Angeles' },
      }
    );
  } catch (err) {
    console.log('❌ Error processing cron job:\n' + err);
  }
};
