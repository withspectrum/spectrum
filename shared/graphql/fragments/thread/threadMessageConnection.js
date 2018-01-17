// @flow
import gql from 'graphql-tag';
import messageInfoFragment from '../message/messageInfo';

export default gql`
  fragment threadMessageConnection on Thread {
    messageConnection(
      after: $after
      first: $first
      before: $before
      last: $last
    ) @connection(key: "messageConnection") {
      pageInfo {
        hasNextPage
        hasPreviousPage
      }
      edges {
        cursor
        node {
          ...messageInfo
        }
      }
    }
  }
  ${messageInfoFragment}
`;
