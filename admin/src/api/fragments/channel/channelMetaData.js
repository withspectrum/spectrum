import { gql } from 'react-apollo';

export const channelMetaDataFragment = gql`
  fragment channelMetaData on Channel {
    metaData {
      threads
      members
    }
  }
`;
