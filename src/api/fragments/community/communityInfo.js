import { gql } from 'react-apollo';

export const communityInfoFragment = gql`
  fragment communityInfo on Community {
    id
    name
    slug
    description
    metaData {
      members
      frequencies
    }
  }
`;
