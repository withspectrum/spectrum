// @flow

export type Args = {
  first?: number,
  after?: string,
  last?: number,
  before?: string,
  queryString: string,
  searchFilter?: {
    communityId?: string,
    channelId?: string,
    userId?: string,
    everythingFeed?: boolean,
  },
};
