// @flow
import gql from 'graphql-tag';
import { graphql } from 'react-apollo';
import threadInfoFragment from '../../fragments/thread/threadInfo';
import type { ThreadInfoType } from '../../fragments/thread/threadInfo';

export type RemoveThreadReactionType = {
  data: {
    removeThreadReaction: {
      ...$Exact<ThreadInfoType>,
    },
  },
};

export type RemoveThreadReactionProps = {
  removeThreadReaction: ({ input: { threadId: string } }) => Promise<
    RemoveThreadReactionType
  >,
};

export const removeThreadReactionQuery = gql`
  mutation removeThreadReaction($input: RemoveThreadReactionInput!) {
    removeThreadReaction(input: $input) {
      ...threadInfo
    }
  }
  ${threadInfoFragment}
`;

const removeThreadReactionOptions = {
  props: ({ mutate }) => ({
    removeThreadReaction: ({ input }) =>
      mutate({
        variables: {
          input,
        },
      }),
  }),
};

export default graphql(removeThreadReactionQuery, removeThreadReactionOptions);
