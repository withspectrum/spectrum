// @flow
import gql from 'graphql-tag';
import { graphql } from 'react-apollo';
import threadInfoFragment from '../../fragments/thread/threadInfo';
import type { ThreadInfoType } from '../../fragments/thread/threadInfo';

export type RemoveTagsFromThreadType = {
  data: {
    removeTagsFromThread: {
      ...$Exact<ThreadInfoType>,
    },
  },
};

export type RemoveTagsFromThreadProps = {
  removeTagsFromThread: ({
    threadId: string,
    tagIds: Array<string>,
  }) => Promise<RemoveTagsFromThreadType>,
};

export const removeTagsFromThreadQuery = gql`
  mutation removeTagsFromThread($input: RemoveTagsFromThreadInput!) {
    removeTagsFromThread(input: $input) {
      ...threadInfo
    }
  }
  ${threadInfoFragment}
`;

const removeTagsFromThreadOptions = {
  props: ({ ownProps, mutate }): RemoveTagsFromThreadProps => ({
    removeTagsFromThread: input => {
      return mutate({
        variables: {
          input,
        },
      });
    },
  }),
};

export default graphql(removeTagsFromThreadQuery, removeTagsFromThreadOptions);
