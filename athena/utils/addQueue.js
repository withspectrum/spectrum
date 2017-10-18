// @flow
const createQueue = require('shared/bull/create-queue');
export const addQueue = (name: string, data: any, opts: any) => {
  const worker = createQueue(name);

  return worker.add({ ...data }, { ...opts });
};
export default addQueue;
