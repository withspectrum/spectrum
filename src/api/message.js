// @flow
// $FlowFixMe
import { graphql, gql } from 'react-apollo';
import { messageInfoFragment } from './fragments/message/messageInfo';

/*
  Updates UI automatically via the containers subscribeToNewMessages helper
*/
const SEND_MESSAGE_MUTATION = gql`
  mutation sendMessage($message: MessageInput!) {
    addMessage(message: $message) {
      ...messageInfo
    }
  }
  ${messageInfoFragment}
`;
const SEND_MESSAGE_OPTIONS = {
  props: ({ ownProps, mutate }) => ({
    sendMessage: message =>
      console.log(message) ||
      mutate({
        variables: {
          message,
        },
      }),
  }),
};
export const sendMessageMutation = graphql(
  SEND_MESSAGE_MUTATION,
  SEND_MESSAGE_OPTIONS
);
