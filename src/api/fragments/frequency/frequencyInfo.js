import { gql } from 'react-apollo';

export const frequencyInfoFragment = gql`
  fragment frequencyInfo on Frequency {
    id
    name
    slug
    description
  }
`;
