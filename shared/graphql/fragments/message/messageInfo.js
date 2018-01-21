// @flow
import gql from 'graphql-tag';
import userInfoFragment from '../user/userInfo';
import type { UserInfoType } from '../user/userInfo';
import reactionInfoFragment from '../reaction/reactionInfo';
import type { ReactionInfoType } from '../reaction/reactionInfo';

type Reaction = {
  ...$Exact<ReactionInfoType>,
};

export type MessageInfoType = {
  id: string,
  timestamp: Date,
  messageType: string,
  sender: {
    ...$Exact<UserInfoType>,
    isPro: boolean,
    contextPermissions: {
      communityId: string,
      reputation: number,
      isOwner: boolean,
      isModerator: boolean,
    },
  },
  reactions: Array<?Reaction>,
  content: {
    body: string,
  },
};

export default gql`
  fragment messageInfo on Message {
    id
    timestamp
    messageType
    sender {
      ...userInfo
      isPro
      contextPermissions {
        communityId
        reputation
        isOwner
        isModerator
      }
    }
    reactions {
      ...reactionInfo
    }
    content {
      body
    }
  }
  ${userInfoFragment}
  ${reactionInfoFragment}
`;
