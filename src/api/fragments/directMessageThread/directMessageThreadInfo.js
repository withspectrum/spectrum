import { gql } from 'react-apollo';

export const directMessageThreadInfoFragment = gql`
  fragment directMessageThreadInfo on DirectMessageThread {
    id
    snippet
    threadLastActive
    participants {
      id
      name
      profilePhoto
      username
      lastSeen
      lastActive
      userId
    }
  }
`;
