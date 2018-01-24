// @flow
import gql from 'graphql-tag';
import { graphql } from 'react-apollo';
import communityInfoFragment from '../../fragments/community/communityInfo';
import type { CommunityInfoType } from '../../fragments/community/communityInfo';
import { getThreadByIdQuery } from '../../queries/thread/getThread';

export type PinCommunityThreadType = {
  data: {
    pinThread: {
      ...$Exact<CommunityInfoType>,
    },
  },
};

export const pinThreadMutation = gql`
  mutation pinThread($threadId: ID!, $communityId: ID!, $value: String) {
    pinThread(threadId: $threadId, communityId: $communityId, value: $value) {
      ...communityInfo
    }
  }
  ${communityInfoFragment}
`;

const pinThreadOptions = {
  props: ({ mutate }) => ({
    pinThread: ({ threadId, communityId, value }) =>
      mutate({
        variables: {
          threadId,
          communityId,
          value,
        },
        update: (store, { data: { pinThread } }) => {
          const data = store.readQuery({
            query: getThreadByIdQuery,
            variables: {
              id: threadId,
            },
          });

          const newVal = Object.assign({}, ...data, {
            ...data,
            channel: {
              ...data.channel,
              __typename: 'Channel',
              community: {
                ...pinThread,
                __typename: 'Community',
              },
            },
            __typename: 'Thread',
          });

          // Write our data back to the cache.
          store.writeQuery({
            query: getThreadByIdQuery,
            data: newVal,
          });
        },
      }),
  }),
};

export default graphql(pinThreadMutation, pinThreadOptions);
