// @flow
export type Job<JobData> = {|
  id: string,
  data: JobData,
  remove: () => Promise<void>,
  finished: () => Promise<void>,
|};

export type JobOptions = {|
  jobId?: number | string,
  delay?: number,
  removeOnComplete?: boolean,
  removeOnFail?: boolean,
  attempts?: number,
  repeat?: {
    cron: string,
    tz: 'America/Los_Angeles',
  },
|};

interface BullQueue<JobData> {
  add: (data: JobData, options?: JobOptions) => Promise<any>;
  process: (
    cb: (job: Job<JobData>, done: Function) => void | Promise<any>
  ) => void;
  getJob: (id: string) => Promise<Job<JobData> | null>;
}

export type SearchIndexJobData = {
  id: string,
  type: 'message' | 'thread' | 'user' | 'community',
  event: 'created' | 'edited' | 'deleted' | 'moved',
};

export type Queues = {
  // vulcan
  searchQueue: BullQueue<SearchIndexJobData>,
};
