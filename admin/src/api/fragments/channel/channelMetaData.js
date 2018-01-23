import gql from 'graphql-tag';

export const channelMetaDataFragment = gql`
  fragment channelMetaData on Channel {
    metaData {
      threads
      members
    }
  }
`;
