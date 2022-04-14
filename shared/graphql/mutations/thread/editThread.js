// @flow
import gql from 'graphql-tag';
import { graphql } from 'react-apollo';
import threadInfoFragment from '../../fragments/thread/threadInfo';
import type { ThreadInfoType } from '../../fragments/thread/threadInfo';

export type EditThreadType = {
  ...$Exact<ThreadInfoType>,
};

type File = {
  name: string,
  type: string,
  size: number,
  path: string,
};

type Attachment = {
  attachmentType: string,
  data: string,
};

type EditThreadInput = {
  threadId: string,
  content: {
    title: string,
    body: ?string,
  },
  attachments?: ?Array<Attachment>,
  filesToUpload?: ?Array<File>,
};

export const editThreadMutation = gql`
  mutation editThread($input: EditThreadInput!) {
    editThread(input: $input) {
      ...threadInfo
    }
  }
  ${threadInfoFragment}
`;

const editThreadOptions = {
  props: ({ mutate }) => ({
    editThread: (input: EditThreadInput) =>
      mutate({
        variables: {
          input,
        },
      }),
  }),
};

export default graphql(editThreadMutation, editThreadOptions);
