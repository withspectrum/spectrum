// @flow

export type Key = string | Array<string>;

export type Loader = {
  load: (key: Key) => Promise<any>,
  loadMany: (keys: Array<Key>) => Promise<any>,
};

export type DataLoaderOptions = {
  cache?: boolean,
};
