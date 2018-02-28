// @flow

export type Key = string;

export type Loader = {
  load: (key: Key | Array<Key>) => Promise<any>,
  loadMany: (keys: Array<Key>) => Promise<any>,
};

export type DataLoaderOptions = {
  cache?: boolean,
};
