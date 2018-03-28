// @flow

export type Args = {
  first?: number,
  after?: string,
  last?: number,
  before?: string,
  queryString: string,
  filter?: {
    communityId?: string,
    channelId?: string,
    creatorId?: string,
    everythingFeed?: boolean,
  },
};
