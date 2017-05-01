import { gql } from 'react-apollo';

export const communityMetaDataFragment = gql`
  fragment communityMetaData on Community {
    metaData {
      frequencies
      members
    }
  }
`;
