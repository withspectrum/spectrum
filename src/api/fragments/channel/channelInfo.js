import { gql } from 'react-apollo';
import { communityInfoFragment } from '../community/communityInfo';

export const channelInfoFragment = gql`
  fragment channelInfo on Channel {
    id
    name
    slug
    description
    isPrivate
    isOwner
    isSubscriber
    isPending
    isBlocked
    community {
      ...communityInfo
    }
  }
  ${communityInfoFragment}
`;
