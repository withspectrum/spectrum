import type {
  DBThread,
  DBUser,
  DBCommunity,
  DBMessage,
  SearchThread,
  SeachUser,
  SearchCommunity,
} from 'shared/types';

export const dbThreadToSearchThread = (thread: DBThread): SearchThread => {};

export const dbMessageToSearchThread = (message: DBMessage): SearchThread => {};

export const dbUserToSearchUser = (user: DBUser): SearchUser => {};

export const dbCommunityToSearchCommunity = (
  community: DBCommunity
): SearchCommunity => {};
