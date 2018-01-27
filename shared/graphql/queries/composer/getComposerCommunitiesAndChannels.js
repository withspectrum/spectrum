// @flow
import gql from 'graphql-tag';
import { graphql } from 'react-apollo';
import userInfoFragment from '../../fragments/user/userInfo';
import type { UserInfoType } from '../../fragments/user/userInfo';

type CommunityNode = {
  node: {
    id: string,
    name: string,
    slug: string,
    profilePhoto: string,
    communityPermissions: {
      isMember: boolean,
      isBlocked: boolean,
      isOwner: boolean,
      isModerator: boolean,
      reputation: number,
    },
  },
};

type ChannelNode = {
  node: {
    id: string,
    name: string,
    slug: string,
    isDefault: boolean,
    isPrivate: boolean,
    community: {
      id: string,
      isPro: boolean,
    },
    channelPermissions: {
      isMember: boolean,
      isPending: boolean,
      isBlocked: boolean,
      isOwner: boolean,
      isModerator: boolean,
    },
  },
};

export type GetComposerType = {
  ...$Exact<UserInfoType>,
  communityConnection: {
    edges: Array<?CommunityNode>,
  },
  channelConnection: {
    edges: Array<?ChannelNode>,
  },
};

export const getComposerCommunitiesAndChannelsQuery = gql`
  query getComposerCommunitiesAndChannels {
    user: currentUser {
      ...userInfo
      communityConnection {
        edges {
          node {
            id
            name
            slug
            profilePhoto
            communityPermissions {
              isMember
              isBlocked
              isOwner
              isModerator
              reputation
            }
          }
        }
      }
      channelConnection {
        edges {
          node {
            id
            name
            slug
            isDefault
            isPrivate
            community {
              id
              isPro
            }
            channelPermissions {
              isMember
              isPending
              isBlocked
              isOwner
              isModerator
            }
          }
        }
      }
    }
  }
  ${userInfoFragment}
`;

const getComposerCommunitiesAndChannelsOptions = {
  options: { fetchPolicy: 'cache-first' },
};

export default graphql(
  getComposerCommunitiesAndChannelsQuery,
  getComposerCommunitiesAndChannelsOptions
);
