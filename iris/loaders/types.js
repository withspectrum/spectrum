// @flow

export type Loader = {
  load: (key: string) => Promise<any>,
  loadMany: (keys: Array<string>) => Promise<any>,
};
