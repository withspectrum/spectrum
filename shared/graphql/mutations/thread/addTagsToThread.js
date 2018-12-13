// @flow
import gql from 'graphql-tag';
import { graphql } from 'react-apollo';
import threadInfoFragment from '../../fragments/thread/threadInfo';
import type { ThreadInfoType } from '../../fragments/thread/threadInfo';

export type AddTagsToThreadType = {
  data: {
    addTagsToThread: {
      ...$Exact<ThreadInfoType>,
    },
  },
};

export type AddTagsToThreadProps = {
  addTagsToThread: ({
    threadId: string,
    tagIds: Array<string>,
  }) => Promise<AddTagsToThreadType>,
};

export const addTagsToThreadQuery = gql`
  mutation addTagsToThread($input: AddTagsToThreadInput!) {
    addTagsToThread(input: $input) {
      ...threadInfo
    }
  }
  ${threadInfoFragment}
`;

const addTagsToThreadOptions = {
  props: ({ ownProps, mutate }): AddTagsToThreadProps => ({
    addTagsToThread: input => {
      return mutate({
        variables: {
          input,
        },
      });
    },
  }),
};

export default graphql(addTagsToThreadQuery, addTagsToThreadOptions);
