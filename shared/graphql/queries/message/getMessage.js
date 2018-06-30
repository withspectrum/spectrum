// @flow
import { graphql } from 'react-apollo';
import gql from 'graphql-tag';
import messageInfoFragment from '../../fragments/message/messageInfo';
import type { MessageInfoType } from '../../fragments/message/messageInfo';

export type GetMessageType = {
  ...$Exact<MessageInfoType>,
};

export const getMessageByIdQuery = gql`
  query getMessageById($id: ID!) {
    message(id: $id) {
      ...messageInfo
    }
  }
  ${messageInfoFragment}
`;

const getMessageByIdOptions = {
  options: ({ id }) => ({
    variables: {
      id,
    },
  }),
};

export const getMessageById = graphql(
  getMessageByIdQuery,
  getMessageByIdOptions
);
