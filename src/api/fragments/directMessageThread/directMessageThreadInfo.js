import { gql } from 'react-apollo';

export const directMessageThreadInfoFragment = gql`
  fragment directMessageThreadInfo on DirectMessageThread {
    id
    snippet
    participants {
      id
      name
      profilePhoto
      username
      lastSeen
      lastActive
    }
  }
`;
