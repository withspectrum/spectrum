// @flow

import type { ThreadInfoType } from '../../shared/graphql/fragments/thread/threadInfo';

export type UpdateCurrentUserLastSeenAction = {|
  type: 'UPDATE_CURRENTUSER_LASTSEEN',
  threadId: $PropertyType<ThreadInfoType, 'id'>,
  currentUserLastSeen: $PropertyType<ThreadInfoType, 'currentUserLastSeen'>,
|};

export type ThreadAction = UpdateCurrentUserLastSeenAction;
