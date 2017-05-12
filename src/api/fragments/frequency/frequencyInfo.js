import { gql } from 'react-apollo';
import { communityInfoFragment } from '../community/communityInfo';

export const frequencyInfoFragment = gql`
  fragment frequencyInfo on Frequency {
    id
    name
    slug
    description
    isOwner
    isSubscriber
    community {
      ...communityInfo
    }
  }
  ${communityInfoFragment}
`;
