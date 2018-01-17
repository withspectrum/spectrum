// @flow
import gql from 'graphql-tag';

export default gql`
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
      isOnline
    }
  }
`;
