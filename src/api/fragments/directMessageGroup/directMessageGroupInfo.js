import { gql } from 'react-apollo';

export const directMessageGroupInfoFragment = gql`
  fragment directMessageGroupInfo on DirectMessageGroup {
    id
    snippet
    lastActivity
    status {
      uid
      lastActivity
      lastSeen
    }
  }
`;
