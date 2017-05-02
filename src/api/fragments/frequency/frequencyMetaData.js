import { gql } from 'react-apollo';

export const frequencyMetaDataFragment = gql`
  fragment frequencyMetaData on Frequency {
    metaData {
      stories
      subscribers
    }
  }
`;
