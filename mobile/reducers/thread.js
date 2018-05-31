// @flow

import type { ThreadInfoType } from '../../shared/graphql/fragments/thread/threadInfo';
import type { Reducer } from 'redux';
import type { ThreadAction } from '../actions/thread';

// Used to decide whether to display New Thread! message
export type LastSeenMap = Map<
  $PropertyType<ThreadInfoType, 'id'>,
  $PropertyType<ThreadInfoType, 'currentUserLastSeen'>
>;

export type ThreadState = {
  +lastSeenMap: LastSeenMap,
};

const initialState: ThreadState = {
  lastSeenMap: new Map(),
};

export const threadReducer: Reducer<ThreadState, ThreadAction> = (
  state: ThreadState = initialState,
  action: ThreadAction
): ThreadState => {
  switch (action.type) {
    case 'UPDATE_CURRENTUSER_LASTSEEN':
      const newLastSeenMap: LastSeenMap = state.lastSeenMap.set(
        action.threadId,
        action.currentUserLastSeen
      );

      return { ...state, lastSeenMap: newLastSeenMap };

    default:
      return state;
  }
};
