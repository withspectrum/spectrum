import { gql } from 'react-apollo';
import { frequencyInfoFragment } from '../frequency/frequencyInfo';

export const userFrequenciesFragment = gql`
  fragment userFrequencies on User {
    frequencyConnection {
      pageInfo {
        hasNextPage
        hasPreviousPage
      }
      edges {
        node {
          ...frequencyInfo
        }
      }
    }
  }
  ${frequencyInfoFragment}
`;
