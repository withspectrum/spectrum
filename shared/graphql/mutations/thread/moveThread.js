// @flow
import gql from 'graphql-tag';
import { graphql } from 'react-apollo';
import threadInfoFragment from '../../fragments/thread/threadInfo';
import type { ThreadInfoType } from '../../fragments/thread/threadInfo';

export type MoveThreadType = {
  data: {
    moveThread: {
      ...$Exact<ThreadInfoType>,
    },
  },
};

export const moveThreadMutation = gql`
  mutation moveThread($threadId: ID!, $channelId: ID!) {
    moveThread(threadId: $threadId, channelId: $channelId) {
      ...threadInfo
    }
  }
  ${threadInfoFragment}
`;

const moveThreadOptions = {
  props: ({ mutate }) => ({
    moveThread: ({
      threadId,
      channelId,
    }: {
      threadId: string,
      channelId: string,
    }) =>
      mutate({
        variables: {
          threadId,
          channelId,
        },
      }),
  }),
};

export default graphql(moveThreadMutation, moveThreadOptions);
