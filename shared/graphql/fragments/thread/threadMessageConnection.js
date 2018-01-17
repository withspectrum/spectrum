// @flow
import gql from 'graphql-tag';
import messageInfoFragment from '../message/messageInfo';

export default gql`
  fragment threadMessageConnection on Thread {
    messageConnection(after: $after) {
      pageInfo {
        hasNextPage
        hasPreviousPage
      }
      edges {
        node {
          ...messageInfo
        }
      }
    }
  }
  ${messageInfoFragment}
`;
