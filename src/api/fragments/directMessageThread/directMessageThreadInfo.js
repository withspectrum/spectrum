import { gql } from 'react-apollo';

export const directMessageThreadInfoFragment = gql`
  fragment directMessageThreadInfo on DirectMessageThread {
    id
    snippet
    lastActivity
    status {
      userId
      lastActivity
      lastSeen
    }
  }
`;
