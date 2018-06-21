// @flow
import gql from 'graphql-tag';
import { graphql } from 'react-apollo';
import threadInfoFragment from '../../fragments/thread/threadInfo';
import type { ThreadInfoType } from '../../fragments/thread/threadInfo';

export type AddThreadReactionType = {
  data: {
    addThreadReaction: {
      ...$Exact<ThreadInfoType>,
    },
  },
};

export type AddThreadReactionProps = {
  addThreadReaction: ({ input: { threadId: string } }) => Promise<
    AddThreadReactionType
  >,
};

export const addThreadReactionQuery = gql`
  mutation addThreadReaction($input: AddThreadReactionInput!) {
    addThreadReaction(input: $input) {
      ...threadInfo
    }
  }
  ${threadInfoFragment}
`;

const addThreadReactionOptions = {
  props: ({ mutate }) => ({
    addThreadReaction: ({ input }) =>
      mutate({
        variables: {
          input: {
            ...input,
            type: 'like',
          },
        },
      }),
  }),
};

export default graphql(addThreadReactionQuery, addThreadReactionOptions);
