// @flow
import gql from 'graphql-tag';

type Participant = {
  id: string,
  name: string,
  profilePhoto: string,
  username: string,
  lastSeen: ?Date,
  lastActive: ?Date,
  userId: string,
  isOnline: boolean,
};

export type DirectMessageThreadInfoType = {
  id: string,
  snippet: ?string,
  threadLastActive: ?Date,
  participants: Array<Participant>,
};

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
