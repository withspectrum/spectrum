// @flow
const createQueue = require('./create-queue');
export const addQueue = (name: string, data: any) => {
  const worker = createQueue(name);

  return worker.add(
    { ...data },
    {
      removeOnComplete: true,
      removeOnFail: true,
    }
  );
};
export default addQueue;
