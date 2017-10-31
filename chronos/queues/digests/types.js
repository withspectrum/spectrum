// @flow

export type Timeframe = 'daily' | 'weekly';

export type User = {
  userId: string,
  email: string,
  firstName: ?string,
  username: string,
};
export type Users = Array<User>;

export type UserWithData = {
  email: string,
  username: string,
  name: ?string,
  userId: string,
  channels: Array<string>,
};
export type UsersWithData = Array<UserWithData>;

export type Thread = {
  channelId: string,
  communityId: string,
  totalMessageCount: number,
  newMessageCount: number,
  title: string,
  id: string,
};
export type Threads = Array<Thread>;

export type ThreadWithData = {
  channelId: string,
  communityId: string,
  totalMessageCount: number,
  newMessageCount: number,
  title: string,
  id: string,
  threadId: string,
  messageCountString: string,
  score: number,
  community: Community,
  channel: Channel,
};
export type ThreadsWithData = {
  [key: string]: Array<ThreadWithData>,
};

export type Community = {
  name: string,
  slug: string,
  profilePhoto: string,
  id: string,
};
export type Communities = Array<Community>;

export type Channel = {
  name: string,
  slug: string,
};
