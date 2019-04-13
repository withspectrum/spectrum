// @flow

export type Loader = {
  load: (key: string | Array<string>) => Promise<any>,
  loadMany: (keys: Array<*>) => Promise<any>,
  clear: (key: string | Array<string>) => void,
};

export type DataLoaderOptions = {
  cache?: boolean,
};
