// @flow

import type { ThreadInfoType } from '../../shared/graphql/fragments/thread/threadInfo';

export type UpdateCurrentUserLastSeenAction = {|
  type: 'UPDATE_CURRENTUSER_LASTSEEN',
  threadId: $Property<ThreadInfoType, 'id'>,
  currentUserLastSeen: $Property<ThreadInfoType, 'currentUserLastSeen'>,
|};

export type ThreadAction = UpdateCurrentUserLastSeenAction;
