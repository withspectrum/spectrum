// @flow
import gql from 'graphql-tag';

export default gql`
  fragment channelMetaData on Channel {
    metaData {
      threads
      members
    }
  }
`;
