// @flow
import { graphql } from 'react-apollo';
import gql from 'graphql-tag';
import messageInfoFragment from '../../fragments/message/messageInfo';
import type { MessageInfoType } from '../../fragments/message/messageInfo';

export type EditMessageType = {
  ...$Exact<MessageInfoType>,
};

type EditMessageInput = {
  id: string,
  content: {
    body: string,
  },
};

export type EditMessageProps = {
  editmessage: (
    input: $PropertyType<EditMessageInput, 'input'>
  ) => Promise<EditMessageType>,
};

export const editMessageMutation = gql`
  mutation editMessage($input: EditMessageInput!) {
    editMessage(input: $input) {
      ...messageInfo
    }
  }
  ${messageInfoFragment}
`;

const editMessageOptions = {
  props: ({ mutate }) => ({
    editMessage: input =>
      mutate({
        variables: {
          input,
        },
      }),
  }),
};

export default graphql(editMessageMutation, editMessageOptions);
